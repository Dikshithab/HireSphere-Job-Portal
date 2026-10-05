from django.urls import reverse
from django.utils import timezone
from datetime import timedelta

from rest_framework import status
from rest_framework.test import APITestCase

from users.models import User
from jobs.models import Company, Job
from .models import JobApplication


class ApplicationAPITests(APITestCase):

    def setUp(self):

        # Job seeker
        self.job_seeker = User.objects.create_user(
            email="seeker@test.com",
            password="TestPassword123",
            name="Test Seeker",
            role="JOB_SEEKER"
        )

        # Employer
        self.employer = User.objects.create_user(
            email="employer@test.com",
            password="TestPassword123",
            name="Test Employer",
            role="EMPLOYER"
        )

        # Company
        self.company = Company.objects.create(
            name="Test Company",
            description="Test company",
            employer=self.employer
        )

        # Active job
        self.job = Job.objects.create(
            title="Python Developer",
            description="Python backend developer",
            requirements="Django REST API",
            skills="Python,Django,REST",
            location="Hyderabad",
            job_type="FULL_TIME",
            salary=600000,
            experience_level="FRESHER",
            vacancies=2,
            application_deadline=timezone.now() + timedelta(days=30),
            remote=False,
            status="ACTIVE",
            company=self.company
        )

        self.apply_url = reverse(
            "apply-job",
            kwargs={"job_id": self.job.id}
        )

    # ==========================================
    # TEST 1 — JOB SEEKER CAN APPLY
    # ==========================================

    def test_job_seeker_can_apply(self):

        self.client.force_authenticate(
            user=self.job_seeker
        )

        response = self.client.post(
            self.apply_url
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED
        )

        self.assertTrue(
            JobApplication.objects.filter(
                job=self.job,
                applicant=self.job_seeker
            ).exists()
        )

    # ==========================================
    # TEST 2 — DUPLICATE APPLICATION
    # ==========================================

    def test_duplicate_application_is_rejected(self):

        self.client.force_authenticate(
            user=self.job_seeker
        )

        first_response = self.client.post(
            self.apply_url
        )

        self.assertEqual(
            first_response.status_code,
            status.HTTP_201_CREATED
        )

        second_response = self.client.post(
            self.apply_url
        )

        self.assertEqual(
            second_response.status_code,
            status.HTTP_400_BAD_REQUEST
        )

    # ==========================================
    # TEST 3 — EMPLOYER CANNOT APPLY
    # ==========================================

    def test_employer_cannot_apply(self):

        self.client.force_authenticate(
            user=self.employer
        )

        response = self.client.post(
            self.apply_url
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN
        )

    # ==========================================
    # TEST 4 — UNAUTHENTICATED USER
    # ==========================================

    def test_unauthenticated_user_cannot_apply(self):

        response = self.client.post(
            self.apply_url
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED
        )

    # ==========================================
    # TEST 5 — APPLICATION IS CREATED ONLY ONCE
    # ==========================================

    def test_application_count(self):

        self.client.force_authenticate(
            user=self.job_seeker
        )

        self.client.post(
            self.apply_url
        )

        self.assertEqual(
            JobApplication.objects.filter(
                applicant=self.job_seeker
            ).count(),
            1
        )
class ApplicationStatusAPITests(APITestCase):

    def setUp(self):

        self.job_seeker = User.objects.create_user(
            email="seeker2@test.com",
            password="TestPassword123",
            name="Test Seeker",
            role="JOB_SEEKER"
        )

        self.employer = User.objects.create_user(
            email="employer2@test.com",
            password="TestPassword123",
            name="Test Employer",
            role="EMPLOYER"
        )

        self.other_employer = User.objects.create_user(
            email="otheremployer@test.com",
            password="TestPassword123",
            name="Other Employer",
            role="EMPLOYER"
        )

        self.company = Company.objects.create(
            name="Test Company 2",
            description="Test company",
            employer=self.employer
        )

        self.job = Job.objects.create(
            title="Django Developer",
            description="Django developer",
            requirements="Django REST",
            skills="Python,Django",
            location="Hyderabad",
            job_type="FULL_TIME",
            salary=600000,
            experience_level="FRESHER",
            vacancies=2,
            application_deadline=timezone.now() + timedelta(days=30),
            remote=False,
            status="ACTIVE",
            company=self.company
        )

        self.application = JobApplication.objects.create(
            job=self.job,
            applicant=self.job_seeker,
            status="PENDING"
        )

        self.status_url = reverse(
            "update-application-status",
            kwargs={
                "application_id": self.application.id
            }
        )

    # ==========================================
    # TEST 1 — EMPLOYER CAN UPDATE STATUS
    # ==========================================

    def test_employer_can_update_status(self):

        self.client.force_authenticate(
            user=self.employer
        )

        response = self.client.put(
            self.status_url,
            {
                "status": "SHORTLISTED"
            },
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.application.refresh_from_db()

        self.assertEqual(
            self.application.status,
            "SHORTLISTED"
        )

    # ==========================================
    # TEST 2 — INVALID STATUS
    # ==========================================

    def test_invalid_status_is_rejected(self):

        self.client.force_authenticate(
            user=self.employer
        )

        response = self.client.put(
            self.status_url,
            {
                "status": "INVALID_STATUS"
            },
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST
        )

    # ==========================================
    # TEST 3 — OTHER EMPLOYER CANNOT UPDATE
    # ==========================================

    def test_other_employer_cannot_update_application(self):

        self.client.force_authenticate(
            user=self.other_employer
        )

        response = self.client.put(
            self.status_url,
            {
                "status": "HIRED"
            },
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN
        )

    # ==========================================
    # TEST 4 — JOB SEEKER CANNOT UPDATE
    # ==========================================

    def test_job_seeker_cannot_update_status(self):

        self.client.force_authenticate(
            user=self.job_seeker
        )

        response = self.client.put(
            self.status_url,
            {
                "status": "HIRED"
            },
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN
        )