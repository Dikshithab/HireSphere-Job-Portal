from django.urls import path

from .views import (
    ApplyJobView,
    EmployerApplicationsView,
    MyApplicationsView,
    RecruiterDashboardView,
    UpdateApplicationStatusView,
    RecruiterCandidateSearchView,
    RecruiterAnalyticsView
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
    path(
    "recruiter-dashboard/",
    RecruiterDashboardView.as_view(),
    name="recruiter-dashboard"
),
path(
    "recruiter-candidates/",
    RecruiterCandidateSearchView.as_view(),
    name="recruiter-candidates"
),
path(
    "recruiter-analytics/",
    RecruiterAnalyticsView.as_view(),
    name="recruiter-analytics"
),
path(
    "jobs/<int:job_id>/apply/",
    ApplyJobView.as_view(),
    name="apply-job"
),
path(
    "applications/<int:application_id>/status/",
    UpdateApplicationStatusView.as_view(),
    name="update-application-status"
),
]