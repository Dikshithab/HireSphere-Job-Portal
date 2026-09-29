from django.urls import path

from .views import (
    ResumeUploadView,
    MyResumesView,
    UserResumesView,
    LatestResumeView,
    ResumeBuilderView,
    ResumeBuilderDetailView,
    AIResumeAnalyzeView,
    AIJobMatchingView,
)


urlpatterns = [
    path("upload/", ResumeUploadView.as_view(), name="resume-upload"),
    path("my/", MyResumesView.as_view(), name="my-resumes"),
    path("user/<int:user_id>/", UserResumesView.as_view(), name="user-resumes"),
    path("user/<int:user_id>/latest/", LatestResumeView.as_view(), name="latest-resume"),

    path("builder/", ResumeBuilderView.as_view(), name="resume-builder"),
    path(
        "builder/<int:resume_id>/",
        ResumeBuilderDetailView.as_view(),
        name="resume-builder-detail",
    ),

    path(
        "ai-resume/analyze/",
        AIResumeAnalyzeView.as_view(),
        name="ai-resume-analyze",
    ),
    path(
    "ai-job-matching/matches/",
    AIJobMatchingView.as_view(),
    name="ai-job-matching",
),
]