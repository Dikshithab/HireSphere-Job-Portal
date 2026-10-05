from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import Resume, ResumeBuilder
from .serializers import ResumeSerializer,ResumeBuilderSerializer
from .resume_parser import extract_text_from_resume
from .ai_job_matching import find_matching_jobs
from .ai_analyzer import analyze_resume
import json
import re
from django.conf import settings
from jobs.models import Job
from .models import Resume
from hiresphere.throttles import AIRequestThrottle

class ResumeUploadView(APIView):

    permission_classes = [IsAuthenticated]
    throttle_classes = [AIRequestThrottle]

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

class AIJobMatchView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [AIRequestThrottle]

    def post(self, request, job_id):

        # ------------------------------------------
        # ONLY JOB SEEKERS
        # ------------------------------------------

        if request.user.role != "JOB_SEEKER":
            return Response(
                {
                    "message": "Only job seekers can use AI job matching."
                },
                status=403
            )

        # ------------------------------------------
        # GET RESUME ID
        # ------------------------------------------

        resume_id = request.data.get("resume_id")

        if not resume_id:
            return Response(
                {
                    "message": "resume_id is required."
                },
                status=400
            )

        # ------------------------------------------
        # GET RESUME
        # ------------------------------------------

        try:
            resume = Resume.objects.get(
                id=resume_id,
                user=request.user
            )

        except Resume.DoesNotExist:
            return Response(
                {
                    "message": "Resume not found or you do not have access to this resume."
                },
                status=404
            )

        # ------------------------------------------
        # CHECK EXTRACTED TEXT
        # ------------------------------------------

        resume_text = (
            resume.extracted_text or ""
        ).strip()

        if not resume_text:
            return Response(
                {
                    "message": "No extracted text is available for this resume. Please upload the resume again."
                },
                status=400
            )

        # ------------------------------------------
        # GET JOB
        # ------------------------------------------

        try:
            job = (
                Job.objects
                .select_related("company")
                .get(id=job_id)
            )

        except Job.DoesNotExist:
            return Response(
                {
                    "message": "Job not found."
                },
                status=404
            )

        # ------------------------------------------
        # JOB INFORMATION
        # ------------------------------------------

        job_text = f"""
Job Title:
{job.title}

Description:
{job.description}

Requirements:
{job.requirements}

Skills:
{job.skills}

Experience Level:
{job.experience_level}

Job Type:
{job.job_type}
"""

        # ------------------------------------------
        # AI PROMPT
        # ------------------------------------------

        prompt = f"""
You are an AI recruitment assistant.

Compare the candidate's resume with the job.

CANDIDATE RESUME:
{resume_text}

JOB:
{job_text}

Return ONLY valid JSON.

Use exactly this structure:

{{
    "match_percentage": 0,
    "matched_skills": [],
    "missing_skills": [],
    "experience_match": "",
    "summary": "",
    "recommendation": ""
}}

Rules:

1. match_percentage must be between 0 and 100.
2. matched_skills should contain skills that appear relevant to both the resume and job.
3. missing_skills should contain important job skills that are missing from the resume.
4. experience_match should explain whether the candidate's experience matches the role.
5. summary should briefly explain the overall match.
6. recommendation should explain what the candidate should improve.
7. Do not invent skills that are not present in the resume or job.
8. Return JSON only.
"""

        # ------------------------------------------
        # CALL GROQ
        # ------------------------------------------

        try:

            from groq import Groq

            client = Groq(
                api_key=settings.GROQ_API_KEY
            )

            completion = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are an AI recruitment assistant. "
                            "Return only valid JSON."
                        )
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.2,
            )

            ai_response = (
                completion
                .choices[0]
                .message
                .content
                .strip()
            )

            # ------------------------------------------
            # CLEAN JSON RESPONSE
            # ------------------------------------------

            ai_response = re.sub(
                r"^```json\s*|\s*```$",
                "",
                ai_response
            ).strip()

            result = json.loads(ai_response)

            # ------------------------------------------
            # RETURN RESULT
            # ------------------------------------------

            return Response(
                {
                    "resume_id": resume.id,
                    "job_id": job.id,
                    "job_title": job.title,
                    "company_name": job.company.name,

                    "match_percentage": result.get(
                        "match_percentage",
                        0
                    ),

                    "matched_skills": result.get(
                        "matched_skills",
                        []
                    ),

                    "missing_skills": result.get(
                        "missing_skills",
                        []
                    ),

                    "experience_match": result.get(
                        "experience_match",
                        ""
                    ),

                    "summary": result.get(
                        "summary",
                        ""
                    ),

                    "recommendation": result.get(
                        "recommendation",
                        ""
                    )
                },
                status=200
            )

        except json.JSONDecodeError:

            return Response(
                {
                    "message": "AI returned an invalid response. Please try again."
                },
                status=500
            )

        except Exception as e:

            print(
                "AI Job Matching Error:",
                str(e)
            )

            return Response(
                {
                    "message": "AI job matching failed."
                },
                status=500
            )
class ResumeManagementView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        resumes = Resume.objects.filter(
            user=request.user
        ).order_by("-is_primary", "-created_at")

        data = []

        for resume in resumes:
            data.append({
                "id": resume.id,
                "title": resume.title,
                "file_name": resume.file_name,
                "source": resume.source,
                "is_primary": resume.is_primary,
                "created_at": resume.created_at,
            })

        return Response(data)

    def patch(self, request, resume_id):

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

        Resume.objects.filter(
            user=request.user
        ).update(is_primary=False)

        resume.is_primary = True
        resume.save()

        return Response({
            "message": "Primary resume updated successfully.",
            "resume_id": resume.id
        })

    def delete(self, request, resume_id):

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

        was_primary = resume.is_primary

        resume.delete()

        if was_primary:
            next_resume = (
                Resume.objects
                .filter(user=request.user)
                .order_by("-created_at")
                .first()
            )

            if next_resume:
                next_resume.is_primary = True
                next_resume.save()

        return Response({
            "message": "Resume deleted successfully."
        })
class AIJobRecommendationsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.role != "JOB_SEEKER":
            return Response(
                {
                    "error": "AI job recommendations are available for job seekers only."
                },
                status=403
            )

        # Get primary resume first
        resume = (
            Resume.objects
            .filter(
                user=request.user,
                is_primary=True
            )
            .first()
        )

        # If no primary resume, use latest resume
        if not resume:
            resume = (
                Resume.objects
                .filter(user=request.user)
                .order_by("-created_at")
                .first()
            )

        if not resume:
            return Response(
                {
                    "error": "Please upload a resume before using AI job recommendations."
                },
                status=400
            )

        if not resume.extracted_text:
            return Response(
                {
                    "error": "Your resume does not contain extracted text. Please upload your resume again."
                },
                status=400
            )

        jobs = list(
            Job.objects
            .filter(status="ACTIVE")
            .select_related("company")
            .order_by("-created_at")[:20]
        )

        if not jobs:
            return Response(
                {
                    "recommendations": []
                }
            )

        resume_text = resume.extracted_text[:12000]

        job_data = []

        for job in jobs:
            job_data.append({
                "id": job.id,
                "title": job.title,
                "company": job.company.name,
                "description": job.description,
                "requirements": job.requirements,
                "skills": job.skills,
                "experience": job.experience_level,
                "location": job.location,
                "job_type": job.job_type,
            })

        prompt = f"""
You are an AI job recommendation engine.

Analyze the candidate resume and recommend the most relevant jobs.

CANDIDATE RESUME:
{resume_text}

AVAILABLE JOBS:
{json.dumps(job_data)}

Return ONLY valid JSON.

Use this exact structure:

{{
    "recommendations": [
        {{
            "job_id": 1,
            "match_percentage": 85,
            "matched_skills": ["Python", "Django"],
            "missing_skills": ["Docker"],
            "reason": "Short explanation of why this job matches."
        }}
    ]
}}

Rules:

1. Return maximum 5 jobs.
2. Only recommend jobs with meaningful relevance.
3. match_percentage must be between 0 and 100.
4. Consider skills, experience, job description and requirements.
5. Do not invent candidate skills.
6. Sort recommendations from highest match to lowest match.
"""

        try:

            from groq import Groq

            client = Groq(
                api_key=settings.GROQ_API_KEY
            )

            completion = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a precise AI job recommendation engine."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.2,
                max_tokens=2500
            )

            content = completion.choices[0].message.content

            # Remove markdown code fences if AI adds them
            content = re.sub(
                r"```json|```",
                "",
                content
            ).strip()

            result = json.loads(content)

            recommendations = []

            for item in result.get(
                "recommendations",
                []
            ):

                job_id = item.get("job_id")

                matching_job = next(
                    (
                        job
                        for job in jobs
                        if job.id == job_id
                    ),
                    None
                )

                if not matching_job:
                    continue

                recommendations.append({
                    "job_id": matching_job.id,
                    "title": matching_job.title,
                    "company": matching_job.company.name,
                    "location": matching_job.location,
                    "job_type": matching_job.job_type,
                    "salary": matching_job.salary,
                    "match_percentage": item.get(
                        "match_percentage",
                        0
                    ),
                    "matched_skills": item.get(
                        "matched_skills",
                        []
                    ),
                    "missing_skills": item.get(
                        "missing_skills",
                        []
                    ),
                    "reason": item.get(
                        "reason",
                        ""
                    )
                })

            return Response({
                "resume_id": resume.id,
                "recommendations": recommendations
            })

        except Exception as e:

            print(
                "AI Job Recommendation Error:",
                str(e)
            )

            return Response(
                {
                    "error": "Unable to generate job recommendations right now."
                },
                status=500
            )
class AICandidateRankingView(APIView):

    permission_classes = [IsAuthenticated]
    throttle_classes = [AIRequestThrottle]

    def get(self, request, job_id):

        if request.user.role != "EMPLOYER":
            return Response(
                {
                    "error": "Only employers can access candidate ranking."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            job = Job.objects.select_related("company").get(
                id=job_id,
                company__employer=request.user
            )

        except Job.DoesNotExist:
            return Response(
                {
                    "error": "Job not found or you do not have permission to access it."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        applications = JobApplication.objects.filter(
            job=job
        ).select_related(
            "applicant"
        )

        if not applications.exists():
            return Response({
                "job": {
                    "id": job.id,
                    "title": job.title,
                    "company": job.company.name
                },
                "candidates": []
            })

        candidate_data = []

        for application in applications:

            resume = (
                Resume.objects
                .filter(
                    user=application.applicant,
                    is_primary=True
                )
                .first()
            )

            if not resume:
                resume = (
                    Resume.objects
                    .filter(
                        user=application.applicant
                    )
                    .order_by("-created_at")
                    .first()
                )

            candidate_data.append({
                "application_id": application.id,
                "candidate_id": application.applicant.id,
                "name": getattr(
                    application.applicant,
                    "name",
                    ""
                ) or getattr(
                    application.applicant,
                    "full_name",
                    ""
                ) or application.applicant.email,
                "email": application.applicant.email,
                "status": application.status,
                "resume_text": (
                    resume.extracted_text[:10000]
                    if resume and resume.extracted_text
                    else ""
                )
            })

        prompt_candidates = []

        for candidate in candidate_data:

            prompt_candidates.append({
                "application_id": candidate["application_id"],
                "candidate_name": candidate["name"],
                "resume": candidate["resume_text"]
            })

        prompt = f"""
You are an AI recruitment candidate ranking system.

Analyze the job and all candidates.

JOB:
Title: {job.title}

Description:
{job.description}

Requirements:
{job.requirements}

Skills:
{job.skills}

Experience Level:
{job.experience_level}

Location:
{job.location}

Job Type:
{job.job_type}

CANDIDATES:
{json.dumps(prompt_candidates)}

Return ONLY valid JSON.

Use exactly this structure:

{{
    "candidates": [
        {{
            "application_id": 1,
            "match_percentage": 92,
            "matched_skills": ["Python", "Django"],
            "missing_skills": ["Docker"],
            "experience_match": "Strong",
            "summary": "Short explanation of candidate fit."
        }}
    ]
}}

Rules:

1. Include every candidate.
2. Match percentage must be between 0 and 100.
3. Consider skills, experience, requirements and job description.
4. Do not invent skills that are not present in the resume.
5. Rank candidates from highest match to lowest match.
6. Be consistent and objective.
7. Keep summary short.
"""

        try:

            from groq import Groq

            client = Groq(
                api_key=settings.GROQ_API_KEY
            )

            completion = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are a precise AI candidate "
                            "ranking engine."
                        )
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.1,
                max_tokens=4000
            )

            content = completion.choices[0].message.content

            content = re.sub(
                r"```json|```",
                "",
                content
            ).strip()

            result = json.loads(content)

            ranked_candidates = []

            for item in result.get(
                "candidates",
                []
            ):

                application_id = item.get(
                    "application_id"
                )

                candidate = next(
                    (
                        c
                        for c in candidate_data
                        if c["application_id"] == application_id
                    ),
                    None
                )

                if not candidate:
                    continue

                ranked_candidates.append({
                    "application_id": candidate[
                        "application_id"
                    ],
                    "candidate_id": candidate[
                        "candidate_id"
                    ],
                    "name": candidate["name"],
                    "email": candidate["email"],
                    "status": candidate["status"],
                    "match_percentage": item.get(
                        "match_percentage",
                        0
                    ),
                    "matched_skills": item.get(
                        "matched_skills",
                        []
                    ),
                    "missing_skills": item.get(
                        "missing_skills",
                        []
                    ),
                    "experience_match": item.get(
                        "experience_match",
                        "Unknown"
                    ),
                    "summary": item.get(
                        "summary",
                        ""
                    )
                })

            ranked_candidates.sort(
                key=lambda x: x["match_percentage"],
                reverse=True
            )

            return Response({
                "job": {
                    "id": job.id,
                    "title": job.title,
                    "company": job.company.name
                },
                "total_candidates": len(
                    ranked_candidates
                ),
                "candidates": ranked_candidates
            })

        except Exception as e:

            print(
                "AI Candidate Ranking Error:",
                str(e)
            )

            return Response(
                {
                    "error": (
                        "Unable to generate candidate "
                        "ranking right now."
                    )
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )