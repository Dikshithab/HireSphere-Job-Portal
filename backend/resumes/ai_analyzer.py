import os
import json
from openai import OpenAI


def analyze_resume(resume_text, job_description):
    """Analyze a resume against a job description using Groq."""

    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        raise ValueError("GROQ_API_KEY is not configured.")

    if not isinstance(resume_text, str) or not resume_text.strip():
        raise ValueError("Resume text is empty. Please upload a valid resume.")

    if not isinstance(job_description, str) or not job_description.strip():
        raise ValueError("Job description is empty.")

    client = OpenAI(
    api_key=api_key,
    base_url="https://api.groq.com/openai/v1",
    timeout=60.0,
    max_retries=2,
)
    system_prompt = """
You are an expert ATS resume analyzer and career assistant.

Analyze the candidate's resume against the provided job description.

Return only a valid JSON object with exactly these fields:

{
    "ats_score": 0,
    "summary": "",
    "strengths": [],
    "weaknesses": [],
    "missing_skills": [],
    "recommendations": [],
    "experience_analysis": "",
    "project_analysis": ""
}

Rules:
- ats_score must be an integer from 0 to 100.
- strengths, weaknesses, missing_skills, and recommendations
  must be arrays of strings.
- summary, experience_analysis, and project_analysis must be strings.
- Do not invent information that is absent from the resume.
- Compare the resume specifically against the job description.
- Consider skills, experience, projects, education, keywords,
  and relevance.
"""

    user_prompt = f"""
RESUME:
{resume_text.strip()}

JOB DESCRIPTION:
{job_description.strip()}
"""

    try:
        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.2,
            response_format={"type": "json_object"},
        )

        content = response.choices[0].message.content

        if not content:
            raise ValueError("Groq returned an empty response.")

        result = json.loads(content)

        required_fields = [
            "ats_score",
            "summary",
            "strengths",
            "weaknesses",
            "missing_skills",
            "recommendations",
            "experience_analysis",
            "project_analysis",
        ]

        for field in required_fields:
            if field not in result:
                raise ValueError(
                    f"AI response is missing the required field: {field}"
                )

        if not isinstance(result["ats_score"], (int, float)):
            raise ValueError("AI returned an invalid ATS score.")

        result["ats_score"] = max(
            0, min(100, int(result["ats_score"]))
        )

        for field in [
            "strengths",
            "weaknesses",
            "missing_skills",
            "recommendations",
        ]:
            if not isinstance(result[field], list):
                raise ValueError(f"AI returned an invalid {field} field.")

        for field in [
            "summary",
            "experience_analysis",
            "project_analysis",
        ]:
            if not isinstance(result[field], str):
                raise ValueError(f"AI returned an invalid {field} field.")

        return result

    except json.JSONDecodeError as exc:
        raise ValueError("Groq returned invalid JSON.") from exc
    except Exception as exc:
        print(f"Groq Resume Analysis Error: {type(exc).__name__}: {exc}")
        raise
