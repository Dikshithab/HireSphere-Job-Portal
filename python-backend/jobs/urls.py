from django.urls import path

from .views import (
    CompanyView,
    JobView,
    JobDetailView,
    JobManageView,
    EmployerJobsView,
    SavedJobView,
    SavedJobsView,


)

urlpatterns = [
    path("company/", CompanyView.as_view(), name="company"),
    path("employer/", EmployerJobsView.as_view(), name="employer-jobs"),
    path("", JobView.as_view(), name="jobs"),
    path("saved/", SavedJobsView.as_view(), name="saved-jobs"),
    path("<int:job_id>/", JobDetailView.as_view(), name="job-detail"),
    path("<int:job_id>/manage/", JobManageView.as_view(), name="job-manage"),
    path("<int:job_id>/save/", SavedJobView.as_view(), name="save-job"),

]