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

    job_type = serializers.CharField(
        source="job.job_type",
        read_only=True
    )

    salary = serializers.DecimalField(
        source="job.salary",
        max_digits=12,
        decimal_places=2,
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

    # ------------------------------------------
    # APPLICATION TIMELINE
    # ------------------------------------------

    timeline = serializers.SerializerMethodField()

    def get_timeline(self, obj):

        timeline = [
            {
                "status": "APPLIED",
                "label": "Application Submitted",
                "completed": True,
                "date": obj.applied_at,
            }
        ]

        status_labels = {
            "PENDING": "Application Under Review",
            "SHORTLISTED": "Shortlisted",
            "REJECTED": "Application Rejected",
            "HIRED": "Hired",
        }

        # Get actual status history from database
        history = obj.status_history.all()

        for item in history:

            timeline.append({
                "status": item.status,
                "label": status_labels.get(
                    item.status,
                    item.status
                ),
                "completed": True,
                "date": item.changed_at,
            })

        return timeline

    class Meta:
        model = JobApplication

        fields = [
            "id",
            "job",
            "job_title",
            "company_name",
            "location",
            "job_type",
            "salary",
            "applicant_name",
            "applicant_email",
            "status",
            "applied_at",
            "timeline",
        ]

        read_only_fields = [
            "id",
            "job_title",
            "company_name",
            "location",
            "job_type",
            "salary",
            "applicant_name",
            "applicant_email",
            "status",
            "applied_at",
            "timeline",
        ]
