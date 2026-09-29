from django.urls import path

from .views import (
    ApplyJobView,
    EmployerApplicationsView,
    MyApplicationsView,
    UpdateApplicationStatusView,
)


urlpatterns = [

    path(
        "jobs/<int:job_id>/apply/",
        ApplyJobView.as_view(),
        name="apply-job"
    ),

    path(
        "employer/",
        EmployerApplicationsView.as_view(),
        name="employer-applications"
    ),

    path(
        "my/",
        MyApplicationsView.as_view(),
        name="my-applications"
    ),

    path(
        "<int:application_id>/status/",
        UpdateApplicationStatusView.as_view(),
        name="update-application-status"
    ),
]