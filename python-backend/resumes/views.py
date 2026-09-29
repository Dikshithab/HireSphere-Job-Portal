from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import Resume, ResumeBuilder
from .serializers import ResumeSerializer,ResumeBuilderSerializer
from .resume_parser import extract_text_from_resume
from .ai_job_matching import find_matching_jobs
from .ai_analyzer import analyze_resume

class ResumeUploadView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        file = request.FILES.get("file")

        if not file:
            return Response(
                {"message": "Please upload a resume file"},
                status=status.HTTP_400_BAD_REQUEST
            )

        file_name = file.name

        if not file_name or not file_name.strip():
            return Response(
                {"message": "Invalid file name"},
                status=status.HTTP_400_BAD_REQUEST
            )

        lower_file_name = file_name.lower()

        if not (
            lower_file_name.endswith(".pdf")
            or lower_file_name.endswith(".docx")
        ):
            return Response(
                {
                    "message":
                    "Only PDF and DOCX files are supported"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            extracted_text = extract_text_from_resume(file)

            if not extracted_text:
                return Response(
                    {
                        "message":
                        "Could not extract text from the resume"
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            title = file_name.rsplit(".", 1)[0]

            resume = Resume.objects.create(
                title=title,
                file_name=file_name,
                extracted_text=extracted_text,
                source="UPLOAD",
                user=request.user
            )

            serializer = ResumeSerializer(resume)

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        except ValueError as e:

            return Response(
                {"message": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

        except Exception as e:

            return Response(
                {
                    "message":
                    f"Failed to upload resume: {str(e)}"
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class MyResumesView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        resumes = Resume.objects.filter(
            user=request.user
        ).order_by("-created_at")

        serializer = ResumeSerializer(
            resumes,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


class UserResumesView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):

        resumes = Resume.objects.filter(
            user_id=user_id
        ).order_by("-created_at")

        serializer = ResumeSerializer(
            resumes,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


class LatestResumeView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):

        try:
            resume = Resume.objects.filter(
                user_id=user_id
            ).latest("created_at")

        except Resume.DoesNotExist:

            return Response(
                {"message": "No resume found for this user"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ResumeSerializer(resume)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )
class ResumeBuilderView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = ResumeBuilderSerializer(
            data=request.data
        )

        if serializer.is_valid():

            resume = serializer.save(
                user=request.user
            )

            return Response(
                {
                    "message": "Resume created successfully!",
                    "resume": ResumeBuilderSerializer(resume).data
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def get(self, request):

        resumes = ResumeBuilder.objects.filter(
            user=request.user
        ).order_by("-created_at")

        serializer = ResumeBuilderSerializer(
            resumes,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


class ResumeBuilderDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, resume_id):

        try:
            resume = ResumeBuilder.objects.get(
                id=resume_id,
                user=request.user
            )

        except ResumeBuilder.DoesNotExist:

            return Response(
                {"message": "Resume not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ResumeBuilderSerializer(resume)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def put(self, request, resume_id):

        try:
            resume = ResumeBuilder.objects.get(
                id=resume_id,
                user=request.user
            )

        except ResumeBuilder.DoesNotExist:

            return Response(
                {"message": "Resume not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ResumeBuilderSerializer(
            resume,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():

            serializer.save()

            return Response(
                {
                    "message": "Resume updated successfully!",
                    "resume": serializer.data
                },
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, resume_id):

        try:
            resume = ResumeBuilder.objects.get(
                id=resume_id,
                user=request.user
            )

        except ResumeBuilder.DoesNotExist:

            return Response(
                {"message": "Resume not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        resume.delete()

        return Response(
            {"message": "Resume deleted successfully"},
            status=status.HTTP_200_OK
        )
class AIResumeAnalyzeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        resume_id = request.data.get("resumeId")
        job_description = request.data.get("job_description")

        if not resume_id:
            return Response(
                {"error": "Resume ID is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not job_description or not job_description.strip():
            return Response(
                {"error": "Job description is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            resume = Resume.objects.get(
                id=resume_id,
                user=request.user
            )
        except Resume.DoesNotExist:
            return Response(
                {"error": "Resume not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            result = analyze_resume(
                resume_text=resume.extracted_text,
                job_description=job_description.strip(),
            )

            return Response(result, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            return Response(
                result,
                status=status.HTTP_200_OK
            )

        except ValueError as e:
            return Response(
                {
                    "error": str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        except Exception as e:
            print("AI Resume Analysis Error:", e)

            return Response(
                {
                    "error": f"AI Resume Analysis failed: {str(e)}"
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
class AIJobMatchingView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.role != "JOB_SEEKER":
            return Response(
                {
                    "message": (
                        "Only Job Seekers can access "
                        "AI Job Matching."
                    )
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # Support both names temporarily
        resume_id = (
            request.query_params.get("resume_id")
            or request.query_params.get("resumeId")
        )

        if not resume_id:
            return Response(
                {
                    "message": "resume_id is required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            resume_id = int(resume_id)
        except (TypeError, ValueError):
            return Response(
                {
                    "message": "Invalid resume ID."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            matches = find_matching_jobs(
                resume_id,
                request.user
            )

            return Response(
                matches,
                status=status.HTTP_200_OK
            )

        except PermissionError as e:
            return Response(
                {
                    "message": str(e)
                },
                status=status.HTTP_403_FORBIDDEN
            )

        except ValueError as e:
            return Response(
                {
                    "message": str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        except Exception as e:
            print(
                "AI Job Matching Error:",
                str(e)
            )

            return Response(
                {
                    "message": (
                        "Failed to generate job matches."
                    )
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )