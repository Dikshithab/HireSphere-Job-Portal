from rest_framework import serializers
from .models import JobApplication


class JobApplicationSerializer(serializers.ModelSerializer):

    job_title = serializers.CharField(
        source="job.title",
        read_only=True
    )

    company_name = serializers.CharField(
        source="job.company.name",
        read_only=True
    )

    location = serializers.CharField(
        source="job.location",
        read_only=True
    )

    applicant_name = serializers.CharField(
        source="applicant.name",
        read_only=True
    )

    applicant_email = serializers.EmailField(
        source="applicant.email",
        read_only=True
    )

    class Meta:
        model = JobApplication

        fields = [
            "id",
            "job",
            "job_title",
            "company_name",
            "location",
            "applicant_name",
            "applicant_email",
            "status",
            "applied_at",
        ]

        read_only_fields = [
            "id",
            "job_title",
            "company_name",
            "location",
            "applicant_name",
            "applicant_email",
            "status",
            "applied_at",
        ]