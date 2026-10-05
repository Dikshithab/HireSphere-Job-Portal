from django.db import models
from django.conf import settings


class Notification(models.Model):

    NOTIFICATION_TYPES = (
        ("APPLICATION_SUBMITTED", "Application Submitted"),
        ("APPLICATION_RECEIVED", "Application Received"),
        ("APPLICATION_SHORTLISTED", "Application Shortlisted"),
        ("APPLICATION_REJECTED", "Application Rejected"),
        ("APPLICATION_HIRED", "Application Hired"),
        ("NEW_JOB", "New Job"),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications"
    )

    notification_type = models.CharField(
        max_length=50,
        choices=NOTIFICATION_TYPES
    )

    title = models.CharField(
        max_length=255
    )

    message = models.TextField()

    job = models.ForeignKey(
        "jobs.Job",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="notifications"
    )

    application_id = models.IntegerField(
        null=True,
        blank=True
    )

    is_read = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.email} - {self.title}"