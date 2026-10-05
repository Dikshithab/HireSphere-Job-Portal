from rest_framework import serializers
from .models import Resume, ResumeBuilder

class ResumeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Resume
        fields = [
            "id",
            "title",
            "file_name",
            "extracted_text",
            "source",
            "user",
            "created_at",
            "uploaded_at",
        ]

        read_only_fields = [
            "id",
            "user",
            "created_at",
            "uploaded_at",
        ]
class ResumeBuilderSerializer(serializers.ModelSerializer):

    class Meta:
        model = ResumeBuilder

        fields = [
            "id",
            "title",
            "full_name",
            "email",
            "phone",
            "location",
            "linkedin",
            "github",
            "portfolio",
            "summary",
            "education",
            "experience",
            "projects",
            "certifications",
            "skills",
            "template",
            "user",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "user",
            "created_at",
            "updated_at",
        ]