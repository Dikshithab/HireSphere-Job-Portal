from django.urls import path

from .views import (
    AIJobMatchView,
    AIJobRecommendationsView,
    ResumeManagementView,
    ResumeUploadView,
    MyResumesView,
    UserResumesView,
    LatestResumeView,
    ResumeBuilderView,
    ResumeBuilderDetailView,
    AIResumeAnalyzeView,
    AICandidateRankingView,
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
    "ai-job-match/<int:job_id>/",
    AIJobMatchView.as_view(),
    name="ai-job-match"
),
path(
    "manage/",
    ResumeManagementView.as_view(),
    name="resume-management"
),

path(
    "manage/<int:resume_id>/",
    ResumeManagementView.as_view(),
    name="resume-management-detail"
),
path(
    "ai-job-recommendations/",
    AIJobRecommendationsView.as_view(),
    name="ai-job-recommendations"
),
path(
    "ai-candidate-ranking/<int:job_id>/",
    AICandidateRankingView.as_view(),
    name="ai-candidate-ranking"
),
]