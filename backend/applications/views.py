from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from django.db.models import Count, Q
from django.db.models.functions import TruncDate
from django.utils import timezone
from .models import ApplicationStatusHistory, JobApplication
from .serializers import JobApplicationSerializer
from jobs.models import Job
from notifications.models import Notification
from resumes.models import Resume
from hiresphere.throttles import AIRequestThrottle
# ==========================================
# APPLY FOR JOB
# ==========================================

class ApplyJobView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [AIRequestThrottle]
    def post(self, request, job_id):

        # Only job seekers can apply
        if request.user.role != "JOB_SEEKER":
            return Response(
                {
                    "message": "Only job seekers can apply for jobs."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # Find job
        try:
            job = Job.objects.get(id=job_id)
        except Job.DoesNotExist:
            return Response(
                {
                    "message": "Job not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )
                # Job must be active
        if job.status != "ACTIVE":
            return Response(
                {
                    "message": "This job is no longer accepting applications."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check application deadline
        if (
            job.application_deadline
            and job.application_deadline < timezone.now()
        ):
            return Response(
                {
                    "message": "The application deadline for this job has passed."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Prevent employer from applying to their own job
        if job.company.employer == request.user:
            return Response(
                {
                    "message": "You cannot apply to your own job."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # Check duplicate application
        if JobApplication.objects.filter(
            job=job,
            applicant=request.user
        ).exists():

            return Response(
                {
                    "message": "You have already applied for this job."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create application
        application = JobApplication.objects.create(
            job=job,
            applicant=request.user
        )
        ApplicationStatusHistory.objects.create(
    application=application,
    status="PENDING"
)
        Notification.objects.create(
    user=request.user,
    notification_type="APPLICATION_SUBMITTED",
    title="Application Submitted",
    message=f"Your application for {job.title} at {job.company.name} has been submitted successfully.",
    job=job,
    application_id=application.id
)
        Notification.objects.create(
    user=job.company.employer,
    notification_type="APPLICATION_RECEIVED",
    title="New Application Received",
    message=f"{request.user.name} applied for your {job.title} position.",
    job=job,
    application_id=application.id
)
        serializer = JobApplicationSerializer(application)

        return Response(
            {
                "message": "Application submitted successfully!",
                "application": serializer.data
            },
            status=status.HTTP_201_CREATED
        )




# ==========================================
# MY APPLICATIONS - JOB SEEKER
# ==========================================

class MyApplicationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        # Only job seekers can view their applications
        if request.user.role != "JOB_SEEKER":
            return Response(
                {
                    "message": "Only job seekers can view their applications."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        applications = (
            JobApplication.objects
            .filter(applicant=request.user)
            .select_related(
                "job",
                "job__company"
            )
            .order_by("-applied_at")
        )

        serializer = JobApplicationSerializer(
            applications,
            many=True
        )

        return Response(
            {
                "count": applications.count(),
                "applications": serializer.data
            },
            status=status.HTTP_200_OK
        )

    

# ==========================================
# EMPLOYER APPLICATIONS
# ==========================================

class EmployerApplicationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.role != "EMPLOYER":
            return Response(
                {
                    "message": "Only employers can view applications."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        applications = (
            JobApplication.objects
            .filter(job__company__employer=request.user)
            .select_related(
                "job",
                "job__company",
                "applicant"
            )
            .order_by("-applied_at")
        )

        serializer = JobApplicationSerializer(
            applications,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


# ==========================================
# UPDATE APPLICATION STATUS
# ==========================================

class UpdateApplicationStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, application_id):

        if request.user.role != "EMPLOYER":
            return Response(
                {
                    "message": "Only employers can update application status."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            application = (
                JobApplication.objects
                .select_related("job__company")
                .get(id=application_id)
            )

        except JobApplication.DoesNotExist:
            return Response(
                {
                    "message": "Application not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # Make sure this employer owns the job
        if application.job.company.employer != request.user:
            return Response(
                {
                    "message": "You are not authorized to update this application."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        new_status = request.data.get("status")

        valid_statuses = [
            "PENDING",
            "SHORTLISTED",
            "REJECTED",
            "HIRED"
        ]

        if new_status not in valid_statuses:
            return Response(
                {
                    "message": "Invalid application status."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        application.status = new_status
        application.save()

        serializer = JobApplicationSerializer(application)

        return Response(
            {
                "message": "Application status updated successfully.",
                "application": serializer.data
            },
            status=status.HTTP_200_OK
        )
class RecruiterDashboardView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.role != "EMPLOYER":
            return Response(
                {
                    "error": "Only employers can access the recruiter dashboard."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        jobs = Job.objects.filter(
            company__employer=request.user
        )

        applications = JobApplication.objects.filter(
            job__company__employer=request.user
        )

        # Calculate all application statuses in one database query
        application_counts = applications.aggregate(
            total=Count("id"),
            pending=Count(
                "id",
                filter=Q(status="PENDING")
            ),
            shortlisted=Count(
                "id",
                filter=Q(status="SHORTLISTED")
            ),
            rejected=Count(
                "id",
                filter=Q(status="REJECTED")
            ),
            hired=Count(
                "id",
                filter=Q(status="HIRED")
            ),
        )

        # Job-wise application statistics
        job_statistics = (
            jobs
            .annotate(
                application_count=Count("applications")
            )
            .values(
                "id",
                "title",
                "application_count"
            )
            .order_by("-application_count")
        )

        return Response({
            "total_jobs": jobs.count(),

            "total_applications": application_counts["total"] or 0,

            "pending": application_counts["pending"] or 0,

            "shortlisted": application_counts["shortlisted"] or 0,

            "rejected": application_counts["rejected"] or 0,

            "hired": application_counts["hired"] or 0,

            "job_statistics": list(job_statistics)
        })
class RecruiterCandidateSearchView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.role != "EMPLOYER":
            return Response(
                {
                    "error": "Only employers can search candidates."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        keyword = request.GET.get("keyword", "").strip()
        skills = request.GET.get("skills", "").strip()
        application_status = request.GET.get("status", "").strip()
        sort_by = request.GET.get("sort", "newest").strip()

        applications = (
            JobApplication.objects
            .filter(
                job__company__employer=request.user
            )
            .select_related(
                "applicant",
                "job"
            )
            .prefetch_related(
                "applicant__resumes"
            )
        )

        # Search by candidate name/email
        if keyword:
            applications = applications.filter(
                Q(
                    applicant__email__icontains=keyword
                )
                |
                Q(
                    applicant__name__icontains=keyword
                )
            )

        # Application status
        if application_status:
            applications = applications.filter(
                status=application_status
            )

        # Skills / resume text
        if skills:
            skill_list = [
                skill.strip()
                for skill in skills.split(",")
                if skill.strip()
            ]

            for skill in skill_list:
                applications = applications.filter(
                    applicant__resumes__extracted_text__icontains=skill
                )

        applications = applications.distinct()

        # Sorting
        if sort_by == "oldest":
            applications = applications.order_by(
                "applied_at"
            )

        else:
            applications = applications.order_by(
                "-applied_at"
            )

        candidates = []

        for application in applications:

            resumes = list(application.applicant.resumes.all())

        resume = next(
    (r for r in resumes if r.is_primary),
    None
)

        if not resume and resumes:
            resume = max(
                resumes,
                key=lambda r: r.created_at
    )

            
            
            candidate_name = (
                getattr(
                    application.applicant,
                    "name",
                    ""
                )
                or getattr(
                    application.applicant,
                    "full_name",
                    ""
                )
                or application.applicant.email
            )

            candidates.append({
                "application_id": application.id,
                "candidate_id": application.applicant.id,
                "name": candidate_name,
                "email": application.applicant.email,
                "job_id": application.job.id,
                "job_title": application.job.title,
                "status": application.status,
                "applied_at": application.applied_at,
                "has_resume": bool(resume),
                "resume_id": resume.id if resume else None,
            })

        return Response({
            "total_candidates": len(candidates),
            "candidates": candidates
        })
class RecruiterAnalyticsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.role != "EMPLOYER":
            return Response(
                {
                    "error": "Only employers can access analytics."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        jobs = Job.objects.filter(
            company__employer=request.user
        )

        applications = JobApplication.objects.filter(
            job__company__employer=request.user
        )

        # ==========================================
        # APPLICATION STATUS COUNTS
        # ==========================================

        application_counts = applications.aggregate(
            total=Count("id"),

            pending=Count(
                "id",
                filter=Q(status="PENDING")
            ),

            shortlisted=Count(
                "id",
                filter=Q(status="SHORTLISTED")
            ),

            rejected=Count(
                "id",
                filter=Q(status="REJECTED")
            ),

            hired=Count(
                "id",
                filter=Q(status="HIRED")
            ),
        )

        total_applications = application_counts["total"] or 0
        pending = application_counts["pending"] or 0
        shortlisted = application_counts["shortlisted"] or 0
        rejected = application_counts["rejected"] or 0
        hired = application_counts["hired"] or 0

        # ==========================================
        # STATUS CHART DATA
        # ==========================================

        status_data = (
            applications
            .values("status")
            .annotate(
                count=Count("id")
            )
            .order_by("status")
        )

        # ==========================================
        # DAILY APPLICATION DATA
        # ==========================================

        daily_data = (
            applications
            .annotate(
                date=TruncDate("applied_at")
            )
            .values("date")
            .annotate(
                count=Count("id")
            )
            .order_by("date")
        )

        # ==========================================
        # JOB-WISE APPLICATION DATA
        # ==========================================

        job_data = (
            jobs
            .annotate(
                application_count=Count("applications")
            )
            .values(
                "id",
                "title",
                "application_count"
            )
            .order_by("-application_count")
        )

        # ==========================================
        # HIRING RATE
        # ==========================================

        hiring_rate = (
            round(
                (hired / total_applications) * 100,
                2
            )
            if total_applications
            else 0
        )

        # ==========================================
        # RESPONSE
        # ==========================================

        return Response({

            "summary": {
                "total_jobs": jobs.count(),
                "total_applications": total_applications,
                "pending": pending,
                "shortlisted": shortlisted,
                "rejected": rejected,
                "hired": hired,
                "hiring_rate": hiring_rate
            },

            "status_data": list(status_data),

            "daily_data": [
                {
                    "date": item["date"],
                    "count": item["count"]
                }
                for item in daily_data
            ],

            "job_data": list(job_data)
        })