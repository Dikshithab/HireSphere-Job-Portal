from django.db import models
from django.conf import settings


class Company(models.Model):

    name = models.CharField(max_length=255)

    description = models.CharField(
        max_length=2000,
        blank=True,
        null=True
    )

    website = models.URLField(
        blank=True,
        null=True
    )

    location = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    logo_url = models.URLField(
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    employer = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        unique=True
    )

    def __str__(self):
        return self.name


class Job(models.Model):

    STATUS_CHOICES = (
        ("ACTIVE", "Active"),
        ("CLOSED", "Closed"),
        ("DRAFT", "Draft"),
        ("EXPIRED", "Expired"),

    )

    title = models.CharField(
        max_length=150
    )

    description = models.TextField()

    requirements = models.TextField(
        blank=True,
        null=True
    )

    skills = models.TextField(
        blank=True,
        null=True
    )

    location = models.CharField(
        max_length=100
    )

    job_type = models.CharField(
        max_length=50
    )

    salary = models.FloatField(
        blank=True,
        null=True
    )

    experience_level = models.CharField(
        max_length=50
    )

    vacancies = models.IntegerField(
        default=1
    )

    application_deadline = models.DateField(
        blank=True,
        null=True
    )

    remote = models.BooleanField(
        default=False
    )

    status = models.CharField(
        max_length=30,
        choices=STATUS_CHOICES,
        default="ACTIVE"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="jobs"
    )

    def __str__(self):
        return self.title
class SavedJob(models.Model):

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="saved_jobs"
    )

    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name="saved_by"
    )

    saved_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "job"],
                name="unique_saved_job"
            )
        ]
        ordering = ["-saved_at"]

    def __str__(self):
        return f"{self.user.email} saved {self.job.title}"