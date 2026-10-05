from django.db import models
from django.conf import settings


class Resume(models.Model):

    SOURCE_CHOICES = (
        ("UPLOAD", "Upload"),
        ("BUILDER", "Builder"),
    )

    title = models.CharField(max_length=255)

    file_name = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    extracted_text = models.TextField(
        blank=True,
        null=True
    )

    source = models.CharField(
        max_length=20,
        choices=SOURCE_CHOICES,
        default="UPLOAD"
    )
    is_primary = models.BooleanField(default=False)

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="resumes"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    uploaded_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.title

class ResumeBuilder(models.Model):

    title = models.CharField(
        max_length=255,
        default="My Professional Resume"
    )

    full_name = models.CharField(
        max_length=255,
        blank=True
    )

    email = models.EmailField(
        blank=True
    )

    phone = models.CharField(
        max_length=30,
        blank=True
    )

    location = models.CharField(
        max_length=255,
        blank=True
    )

    linkedin = models.URLField(
        blank=True
    )

    github = models.URLField(
        blank=True
    )

    portfolio = models.URLField(
        blank=True
    )

    summary = models.TextField(
        blank=True
    )

    education = models.JSONField(
        default=list,
        blank=True
    )

    experience = models.JSONField(
        default=list,
        blank=True
    )

    projects = models.JSONField(
        default=list,
        blank=True
    )

    certifications = models.JSONField(
        default=list,
        blank=True
    )

    skills = models.JSONField(
        default=list,
        blank=True
    )

    template = models.CharField(
        max_length=50,
        default="modern"
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="built_resumes"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.title