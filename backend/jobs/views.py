from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import Company, Job, SavedJob
from .serializers import CompanySerializer, JobSerializer

from django.db.models import Q
from django.core.cache import cache


# =========================================================
# COMPANY
# =========================================================

class CompanyView(APIView):

    permission_classes = [IsAuthenticated]

    # GET MY COMPANY
    def get(self, request):

        try:
            company = Company.objects.get(
                employer=request.user
            )

        except Company.DoesNotExist:
            return Response(
                {"message": "Company not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = CompanySerializer(company)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    # UPDATE MY COMPANY
    def put(self, request):

        if request.user.role != "EMPLOYER":
            return Response(
                {"message": "Only employers can update a company"},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            company = Company.objects.get(
                employer=request.user
            )

        except Company.DoesNotExist:
            return Response(
                {"message": "Company not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = CompanySerializer(
            company,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():

            company = serializer.save()

            return Response(
                CompanySerializer(company).data,
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    # DELETE MY COMPANY
    def delete(self, request):

        if request.user.role != "EMPLOYER":
            return Response(
                {"message": "Only employers can delete a company"},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            company = Company.objects.get(
                employer=request.user
            )

        except Company.DoesNotExist:
            return Response(
                {"message": "Company not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        company.delete()

        return Response(
            {"message": "Company deleted successfully"},
            status=status.HTTP_200_OK
        )


# =========================================================
# JOBS
# =========================================================

class JobView(APIView):

    permission_classes = [AllowAny]

    # CREATE JOB
    def post(self, request):

        if not request.user.is_authenticated:
            return Response(
                {"message": "Authentication required"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if request.user.role != "EMPLOYER":
            return Response(
                {"message": "Only employers can create jobs"},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            company = Company.objects.get(
                employer=request.user
            )

        except Company.DoesNotExist:
            return Response(
                {"message": "Create a company before posting a job"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = JobSerializer(
            data=request.data
        )

        if serializer.is_valid():

            job = serializer.save(
                company=company
            )

            # Clear cached job listings
            cache.clear()

            return Response(
                JobSerializer(job).data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    # GET ALL ACTIVE JOBS + ADVANCED SEARCH
    def get(self, request):

        # -----------------------------------------
        # REDIS CACHE
        # -----------------------------------------

        cache_key = "jobs:" + request.get_full_path()

        cached_jobs = cache.get(cache_key)

        if cached_jobs is not None:
            return Response(
                cached_jobs,
                status=status.HTTP_200_OK
            )

        # -----------------------------------------
        # GET ACTIVE JOBS
        # -----------------------------------------

        jobs = (
            Job.objects
            .select_related("company")
            .filter(status="ACTIVE")
            .order_by("-created_at")
        )

        # -----------------------------------------
        # 1. KEYWORD
        # -----------------------------------------

        keyword = request.query_params.get("keyword")

        if keyword:
            jobs = jobs.filter(
                Q(title__icontains=keyword)
                | Q(description__icontains=keyword)
                | Q(requirements__icontains=keyword)
                | Q(skills__icontains=keyword)
                | Q(company__name__icontains=keyword)
            )

        # -----------------------------------------
        # 2. LOCATION
        # -----------------------------------------

        location = request.query_params.get("location")

        if location:
            jobs = jobs.filter(
                location__icontains=location
            )

        # -----------------------------------------
        # 3. SKILLS
        # -----------------------------------------

        skills = request.query_params.get("skills")

        if skills:
            jobs = jobs.filter(
                skills__icontains=skills
            )

        # -----------------------------------------
        # 4. EXPERIENCE
        # -----------------------------------------

        experience = request.query_params.get("experience")

        if experience:
            jobs = jobs.filter(
                experience_level__icontains=experience
            )

        # -----------------------------------------
        # 5. JOB TYPE
        # -----------------------------------------

        job_type = request.query_params.get("job_type")

        if job_type:
            jobs = jobs.filter(
                job_type__iexact=job_type
            )

        # -----------------------------------------
        # 6. REMOTE / ON-SITE
        # -----------------------------------------

        remote = request.query_params.get("remote")

        if remote is not None:

            if remote.lower() == "true":
                jobs = jobs.filter(remote=True)

            elif remote.lower() == "false":
                jobs = jobs.filter(remote=False)

        # -----------------------------------------
        # 7. MINIMUM SALARY
        # -----------------------------------------

        min_salary = request.query_params.get("min_salary")

        if min_salary:

            try:
                jobs = jobs.filter(
                    salary__gte=float(min_salary)
                )

            except ValueError:
                return Response(
                    {"message": "Invalid minimum salary"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # -----------------------------------------
        # 8. MAXIMUM SALARY
        # -----------------------------------------

        max_salary = request.query_params.get("max_salary")

        if max_salary:

            try:
                jobs = jobs.filter(
                    salary__lte=float(max_salary)
                )

            except ValueError:
                return Response(
                    {"message": "Invalid maximum salary"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # -----------------------------------------
        # SERIALIZE
        # -----------------------------------------

        serializer = JobSerializer(
            jobs,
            many=True
        )

        # -----------------------------------------
        # SAVE IN REDIS FOR 5 MINUTES
        # -----------------------------------------

        cache.set(
            cache_key,
            serializer.data,
            timeout=300
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


# =========================================================
# EMPLOYER JOBS
# =========================================================

class EmployerJobsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.role != "EMPLOYER":
            return Response(
                {"message": "Only employers can view their jobs"},
                status=status.HTTP_403_FORBIDDEN
            )

        jobs = (
            Job.objects
            .select_related("company")
            .filter(
                company__employer=request.user
            )
            .order_by("-created_at")
        )

        serializer = JobSerializer(
            jobs,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


# =========================================================
# JOB DETAILS
# =========================================================

class JobDetailView(APIView):

    permission_classes = [AllowAny]

    def get(self, request, job_id):

        try:
            job = (
                Job.objects
                .select_related("company")
                .get(id=job_id)
            )

        except Job.DoesNotExist:
            return Response(
                {"message": "Job not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = JobSerializer(job)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


# =========================================================
# MANAGE JOB
# =========================================================

class JobManageView(APIView):

    permission_classes = [IsAuthenticated]

    # UPDATE JOB
    def put(self, request, job_id):

        if request.user.role != "EMPLOYER":
            return Response(
                {"message": "Only employers can update jobs"},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            job = (
                Job.objects
                .select_related("company")
                .get(id=job_id)
            )

        except Job.DoesNotExist:
            return Response(
                {"message": "Job not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        if job.company.employer != request.user:
            return Response(
                {"message": "You can only update your own jobs"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = JobSerializer(
            job,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():

            job = serializer.save()

            # Clear cached job listings
            cache.clear()

            return Response(
                JobSerializer(job).data,
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    # DELETE JOB
    def delete(self, request, job_id):

        if request.user.role != "EMPLOYER":
            return Response(
                {"message": "Only employers can delete jobs"},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            job = (
                Job.objects
                .select_related("company")
                .get(id=job_id)
            )

        except Job.DoesNotExist:
            return Response(
                {"message": "Job not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        if job.company.employer != request.user:
            return Response(
                {"message": "You can only delete your own jobs"},
                status=status.HTTP_403_FORBIDDEN
            )

        job.delete()

        # Clear cached job listings
        cache.clear()

        return Response(
            {"message": "Job deleted successfully"},
            status=status.HTTP_200_OK
        )


# =========================================================
# SAVED JOB
# =========================================================

class SavedJobView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, job_id):

        try:
            job = Job.objects.get(
                id=job_id,
                status="ACTIVE"
            )

        except Job.DoesNotExist:
            return Response(
                {"message": "Job not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        saved_job, created = SavedJob.objects.get_or_create(
            user=request.user,
            job=job
        )

        if created:
            return Response(
                {
                    "message": "Job saved successfully",
                    "saved": True,
                    "job_id": job.id
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            {
                "message": "Job already saved",
                "saved": True,
                "job_id": job.id
            },
            status=status.HTTP_200_OK
        )

    def delete(self, request, job_id):

        deleted, _ = SavedJob.objects.filter(
            user=request.user,
            job_id=job_id
        ).delete()

        if deleted:
            return Response(
                {
                    "message": "Job removed from saved jobs",
                    "saved": False,
                    "job_id": job_id
                },
                status=status.HTTP_200_OK
            )

        return Response(
            {
                "message": "Job was not saved",
                "saved": False,
                "job_id": job_id
            },
            status=status.HTTP_404_NOT_FOUND
        )


# =========================================================
# SAVED JOBS
# =========================================================

class SavedJobsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        saved_jobs = (
            SavedJob.objects
            .filter(user=request.user)
            .select_related(
                "job",
                "job__company"
            )
        )

        jobs = []

        for saved in saved_jobs:

            job = saved.job

            jobs.append({
                "id": job.id,
                "title": job.title,
                "description": job.description,
                "requirements": job.requirements,
                "skills": job.skills,
                "location": job.location,
                "job_type": job.job_type,
                "salary": job.salary,
                "experience_level": job.experience_level,
                "vacancies": job.vacancies,
                "application_deadline": job.application_deadline,
                "remote": job.remote,
                "status": job.status,
                "company_name": job.company.name,
                "saved_at": saved.saved_at,
            })

        return Response(
            jobs,
            status=status.HTTP_200_OK
        )