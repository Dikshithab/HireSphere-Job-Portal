from rest_framework import serializers
from .models import Company, Job


class CompanySerializer(serializers.ModelSerializer):

    class Meta:
        model = Company
        fields = [
            "id",
            "name",
            "description",
            "website",
            "location",
            "logo_url",
            "created_at",
            "employer",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "employer",
        ]


class JobSerializer(serializers.ModelSerializer):

    company_name = serializers.CharField(
        source="company.name",
        read_only=True
    )

    class Meta:
        model = Job
        fields = [
            "id",
            "title",
            "description",
            "requirements",
            "skills",
            "location",
            "job_type",
            "salary",
            "experience_level",
            "vacancies",
            "application_deadline",
            "remote",
            "status",
            "created_at",
            "company",
            "company_name",
        ]

        read_only_fields = [
            "id",
            "created_at",
                "company",
            "company_name",
        ]