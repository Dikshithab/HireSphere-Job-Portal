from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import JobApplication
from .serializers import JobApplicationSerializer
from jobs.models import Job
from notifications.models import Notification

# ==========================================
# APPLY FOR JOB
# ==========================================

class ApplyJobView(APIView):
    permission_classes = [IsAuthenticated]

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

        applications = (
            JobApplication.objects
            .filter(applicant=request.user)
            .select_related("job", "job__company")
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