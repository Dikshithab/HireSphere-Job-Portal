import logging
import re

from django.db.models import Q
from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from jobs.models import Job

from .ai_analyzer import analyze_resume
from .models import Resume, ResumeBuilder
from .resume_parser import extract_text_from_resume
from .serializers import ResumeBuilderSerializer, ResumeSerializer
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
logger = logging.getLogger(__name__)


# ============================================================
# HELPERS
# ============================================================

def normalize_text(value):
    """Normalize text for simple case-insensitive comparisons."""
    return re.sub(r"\s+", " ", str(value or "")).strip().lower()


def get_job_value(job, *field_names, default=""):
    """Safely retrieve a value from a model using candidate field names."""
    for field_name in field_names:
        try:
            value = getattr(job, field_name, None)
        except Exception:
            value = None

        if value is not None:
            return value

    return default


def extract_skills(text):
    """
    Extract a basic set of common technical skills.
    This is a lightweight matching helper, not an ATS-grade parser.
    """
    text = normalize_text(text)

    skills = [
        "python",
        "java",
        "javascript",
        "typescript",
        "react",
        "django",
        "flask",
        "fastapi",
        "html",
        "css",
        "sql",
        "mysql",
        "postgresql",
        "mongodb",
        "rest api",
        "django rest framework",
        "spring boot",
        "git",
        "github",
        "docker",
        "kubernetes",
        "aws",
        "azure",
        "machine learning",
        "deep learning",
        "artificial intelligence",
        "generative ai",
        "large language models",
        "llm",
        "rag",
        "cybersecurity",
        "network security",
        "linux",
        "data analysis",
        "pandas",
        "numpy",
        "scikit-learn",
        "c",
        "c++",
    ]

    found = []

    for skill in skills:
        pattern = r"(?<![a-z0-9+#])" + re.escape(skill) + r"(?![a-z0-9+#])"

        if re.search(pattern, text):
            found.append(skill)

    return found


def get_job_description(job):
    """Build searchable text from common job model fields."""
    values = []

    for field_name in (
        "title",
        "job_title",
        "description",
        "requirements",
        "required_skills",
        "skills",
        "experience",
        "experience_level",
        "job_type",
        "location",
    ):
        value = get_job_value(job, field_name)

        if value:
            if isinstance(value, (list, tuple, set)):
                values.extend(str(item) for item in value)
            else:
                values.append(str(value))

    return " ".join(values)


def get_active_jobs():
    """
    Return active jobs when the model has an ACTIVE status field.
    If the project uses a different status representation, adjust
    this helper to match the actual Job model.
    """
    queryset = Job.objects.all()

    try:
        status_field = Job._meta.get_field("status")
        choices = dict(status_field.choices or [])

        if "ACTIVE" in choices:
            queryset = queryset.filter(status="ACTIVE")
        elif choices:
            active_value = next(
                (
                    key
                    for key, label in choices.items()
                    if str(label).strip().lower() == "active"
                ),
                None,
            )

            if active_value is not None:
                queryset = queryset.filter(status=active_value)

    except Exception:
        # Do not break job retrieval just because the model uses
        # another active-job representation.
        pass

    return queryset


def match_resume_to_job(resume_text, job):
    """Calculate a transparent, rule-based resume/job compatibility score."""
    resume_text_normalized = normalize_text(resume_text)
    job_text = get_job_description(job)
    job_text_normalized = normalize_text(job_text)

    resume_skills = set(extract_skills(resume_text))
    job_skills = set(extract_skills(job_text))

    matched_skills = sorted(resume_skills.intersection(job_skills))
    missing_skills = sorted(job_skills.difference(resume_skills))

    if job_skills:
        skill_score = round(
            len(matched_skills) / len(job_skills) * 70
        )
    else:
        skill_score = 0

    title = get_job_value(job, "title", "job_title")
    title_words = [
        word
        for word in normalize_text(title).split()
        if len(word) > 2
    ]

    title_matches = sum(
        1
        for word in title_words
        if re.search(
            r"(?<![a-z0-9])" + re.escape(word) + r"(?![a-z0-9])",
            resume_text_normalized,
        )
    )

    title_score = (
        round(title_matches / len(title_words) * 20)
        if title_words
        else 0
    )

    # This is a simple keyword-overlap heuristic, not a semantic AI score.
    description_words = {
        word
        for word in re.findall(r"[a-z][a-z0-9+#.-]{2,}", job_text_normalized)
        if word not in {
            "the", "and", "for", "with", "you", "your", "are",
            "will", "our", "this", "that", "from", "have", "has",
            "job", "role", "work", "years", "experience",
        }
    }

    resume_words = set(
        re.findall(r"[a-z][a-z0-9+#.-]{2,}", resume_text_normalized)
    )

    overlap = len(description_words.intersection(resume_words))
    description_score = (
        round(min(overlap / max(len(description_words), 1), 1) * 10)
    )

    score = min(100, skill_score + title_score + description_score)

    return {
        "matchScore": score,
        "matchedSkills": matched_skills,
        "missingSkills": missing_skills,
        "matchReason": (
            f"Matched {len(matched_skills)} identified technical skill(s). "
            "The score is based on keyword overlap and is an estimate."
        ),
    }


# ============================================================
# RESUME UPLOAD
# ============================================================

class ResumeUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        uploaded_file = request.FILES.get("file")

        if not uploaded_file:
            return Response(
                {"message": "Please upload a resume file."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        file_name = uploaded_file.name or ""
        lower_file_name = file_name.lower()

        if not file_name.strip():
            return Response(
                {"message": "Invalid file name."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not lower_file_name.endswith((".pdf", ".docx")):
            return Response(
                {"message": "Only PDF and DOCX files are supported."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            extracted_text = extract_text_from_resume(uploaded_file)

            if not extracted_text or not extracted_text.strip():
                return Response(
                    {
                        "message": (
                            "Could not extract readable text from this resume."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            resume = Resume.objects.create(
                title=file_name.rsplit(".", 1)[0],
                file_name=file_name,
                extracted_text=extracted_text,
                source="UPLOAD",
                user=request.user,
            )

            return Response(
                ResumeSerializer(resume).data,
                status=status.HTTP_201_CREATED,
            )

        except ValueError as exc:
            return Response(
                {"message": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception:
            logger.exception("Resume upload failed.")

            return Response(
                {"message": "Resume upload failed. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# ============================================================
# RESUME LISTING
# ============================================================

class MyResumesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        resumes = Resume.objects.filter(
            user=request.user
        ).order_by("-created_at")

        return Response(
            ResumeSerializer(resumes, many=True).data,
            status=status.HTTP_200_OK,
        )


class UserResumesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        # Users may access only their own uploaded resumes.
        if request.user.id != user_id and not request.user.is_staff:
            return Response(
                {"message": "You cannot access another user's resumes."},
                status=status.HTTP_403_FORBIDDEN,
            )

        resumes = Resume.objects.filter(
            user_id=user_id
        ).order_by("-created_at")

        return Response(
            ResumeSerializer(resumes, many=True).data,
            status=status.HTTP_200_OK,
        )


class LatestResumeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        if request.user.id != user_id and not request.user.is_staff:
            return Response(
                {"message": "You cannot access another user's resumes."},
                status=status.HTTP_403_FORBIDDEN,
            )

        resume = Resume.objects.filter(
            user_id=user_id
        ).order_by("-created_at").first()

        if not resume:
            return Response(
                {"message": "No resume found for this user."},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(
            ResumeSerializer(resume).data,
            status=status.HTTP_200_OK,
        )


# ============================================================
# RESUME BUILDER
# ============================================================

class ResumeBuilderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ResumeBuilderSerializer(data=request.data)

        if serializer.is_valid():
            resume = serializer.save(user=request.user)

            return Response(
                {
                    "message": "Resume created successfully!",
                    "resume": ResumeBuilderSerializer(resume).data,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

    def get(self, request):
        resumes = ResumeBuilder.objects.filter(
            user=request.user
        ).order_by("-created_at")

        return Response(
            ResumeBuilderSerializer(resumes, many=True).data,
            status=status.HTTP_200_OK,
        )


class ResumeBuilderDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, resume_id):
        resume = get_object_or_404(
            ResumeBuilder,
            id=resume_id,
            user=request.user,
        )

        return Response(
            ResumeBuilderSerializer(resume).data,
            status=status.HTTP_200_OK,
        )

    def put(self, request, resume_id):
        resume = get_object_or_404(
            ResumeBuilder,
            id=resume_id,
            user=request.user,
        )

        serializer = ResumeBuilderSerializer(
            resume,
            data=request.data,
            partial=True,
        )

        if serializer.is_valid():
            serializer.save()

            return Response(
                {
                    "message": "Resume updated successfully!",
                    "resume": serializer.data,
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

    def delete(self, request, resume_id):
        resume = get_object_or_404(
            ResumeBuilder,
            id=resume_id,
            user=request.user,
        )

        resume.delete()

        return Response(
            {"message": "Resume deleted successfully."},
            status=status.HTTP_200_OK,
        )


# ============================================================
# RESUME MANAGEMENT
# ============================================================

class ResumeManagementView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        resumes = Resume.objects.filter(
            user=request.user
        ).order_by("-is_primary", "-created_at")

        data = [
            {
                "id": resume.id,
                "title": resume.title,
                "file_name": resume.file_name,
                "source": resume.source,
                "is_primary": resume.is_primary,
                "created_at": resume.created_at,
            }
            for resume in resumes
        ]

        return Response(data, status=status.HTTP_200_OK)

    def patch(self, request, resume_id):
        resume = get_object_or_404(
            Resume,
            id=resume_id,
            user=request.user,
        )

        Resume.objects.filter(user=request.user).update(
            is_primary=False
        )

        resume.is_primary = True
        resume.save(update_fields=["is_primary"])

        return Response(
            {
                "message": "Primary resume updated successfully.",
                "resume_id": resume.id,
            },
            status=status.HTTP_200_OK,
        )

    def delete(self, request, resume_id):
        resume = get_object_or_404(
            Resume,
            id=resume_id,
            user=request.user,
        )

        was_primary = resume.is_primary
        resume.delete()

        if was_primary:
            next_resume = (
                Resume.objects.filter(user=request.user)
                .order_by("-created_at")
                .first()
            )

            if next_resume:
                next_resume.is_primary = True
                next_resume.save(update_fields=["is_primary"])

        return Response(
            {"message": "Resume deleted successfully."},
            status=status.HTTP_200_OK,
        )


# ============================================================
# AI RESUME ANALYZER
# ============================================================

class AIResumeAnalyzeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        resume_id = request.data.get("resumeId")
        target_role = request.data.get("target_role", "")

        if not isinstance(target_role, str) or not target_role.strip():
            return Response(
                {"error": "Target role is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            resume = Resume.objects.get(
                id=resume_id,
                user=request.user,
            )
        except (Resume.DoesNotExist, ValueError, TypeError):
            return Response(
                {"error": "Resume not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if not resume.extracted_text or not resume.extracted_text.strip():
            return Response(
                {
                    "error": (
                        "No readable resume text is available. "
                        "Please upload a readable PDF or DOCX."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            result = analyze_resume(
                resume_text=resume.extracted_text,
                target_role=target_role.strip()[:150],
            )

            return Response(result, status=status.HTTP_200_OK)

        except ValueError as exc:
            return Response(
                {"error": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception:
            logger.exception("AI resume analysis failed.")

            return Response(
                {
                    "error": (
                        "Resume analysis is temporarily unavailable. "
                        "Please try again later."
                    )
                },
                status=status.HTTP_502_BAD_GATEWAY,
            )


# ============================================================
# AI JOB MATCHING
# ============================================================

class AIJobMatchView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Match the selected uploaded resume against active jobs.

        GET /api/resumes/ai-job-matching/matches/?resume_id=10
        """
        resume_id = request.query_params.get("resume_id")

        if not resume_id:
            return Response(
                {"error": "Please select a resume."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            resume = Resume.objects.get(
                id=resume_id,
                user=request.user,
            )
        except (Resume.DoesNotExist, ValueError, TypeError):
            return Response(
                {"error": "Resume not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if not resume.extracted_text or not resume.extracted_text.strip():
            return Response(
                {"error": "The selected resume contains no readable text."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        jobs = get_active_jobs()
        results = []

        for job in jobs:
            match_data = match_resume_to_job(
                resume.extracted_text,
                job,
            )

            results.append(
                {
                    "jobId": job.id,
                    "jobTitle": get_job_value(
                        job, "title", "job_title", default="Untitled job"
                    ),
                    "companyName": str(
                        get_job_value(job, "company_name", default="")
                        or get_job_value(
                            getattr(job, "company", None),
                            "name",
                            default="Company",
                        )
                    ),
                    "location": get_job_value(job, "location"),
                    "jobType": get_job_value(job, "job_type"),
                    "experienceLevel": get_job_value(
                        job, "experience_level", "experience"
                    ),
                    "salary": get_job_value(
                        job, "salary", "salary_max", default=None
                    ),
                    "matchScore": match_data["matchScore"],
                    "matchedSkills": match_data["matchedSkills"],
                    "missingSkills": match_data["missingSkills"],
                    "matchReason": match_data["matchReason"],
                }
            )

        results.sort(
            key=lambda item: item["matchScore"],
            reverse=True,
        )

        return Response(results[:20], status=status.HTTP_200_OK)
