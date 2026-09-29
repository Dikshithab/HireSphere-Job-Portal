import os
import json
from openai import OpenAI


def analyze_resume(resume_text, job_description):
    """Analyze a resume against a job description using Groq."""

    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        raise ValueError("GROQ_API_KEY is not configured.")

    if not resume_text:
        raise ValueError("Resume text is empty.")

    if not job_description:
        raise ValueError("Job description is empty.")

    client = OpenAI(
        api_key=api_key,
        base_url="https://api.groq.com/openai/v1",
    )

    system_prompt = """
You are an expert ATS resume analyzer and career assistant.

Analyze the candidate's resume against the provided job description.

Return ONLY valid JSON.

The JSON must contain exactly these fields:

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
- strengths must be an array of strings.
- weaknesses must be an array of strings.
- missing_skills must be an array of strings.
- recommendations must be an array of strings.
- Do not invent information that is not present in the resume.
- Compare the resume specifically against the job description.
- Consider skills, experience, projects, education, keywords and relevance.
"""

    user_prompt = f"""
RESUME:

{resume_text}


JOB DESCRIPTION:

{job_description}
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[
            {
                "role": "system",
                "content": system_prompt,
            },
            {
                "role": "user",
                "content": user_prompt,
            },
        ],
        temperature=0.2,
        response_format={
            "type": "json_object"
        },
    )

    content = response.choices[0].message.content

    if not content:
        raise ValueError("Groq returned an empty response.")

    try:
        result = json.loads(content)
    except json.JSONDecodeError:
        raise ValueError("Groq returned invalid JSON.")

    return result