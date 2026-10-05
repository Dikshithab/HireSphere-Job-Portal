"""
URL configuration for hiresphere project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
"""
URL configuration for hiresphere project.
"""

from django.contrib import admin
from django.urls import path, include
from django.db import connection

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status


class HealthCheckView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    throttle_classes = []

    def get(self, request):
        try:
            connection.ensure_connection()

            return Response({
                "status": "ok",
                "application": "HireSphere",
                "database": "ok"
            })

        except Exception:
            return Response({
                "status": "error",
                "application": "HireSphere",
                "database": "unavailable"
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)


urlpatterns = [
    path("admin/", admin.site.urls),

    # Health check
    path("api/health/", HealthCheckView.as_view(), name="health-check"),

    # API routes
    path("api/users/", include("users.urls")),

    path("api/jobs/", include("jobs.urls")),

    path("api/applications/", include("applications.urls")),

    path("api/resumes/", include("resumes.urls")),

    path("api/chatbot/", include("chatbot.urls")),

    path(
        "api/notifications/",
        include("notifications.urls")
    ),
]