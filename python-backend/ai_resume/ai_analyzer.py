import json
import os
import requests

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
MODEL = "openai/gpt-oss-20b"


def clean_json_response(response):
    response = response.strip()

    if response.startswith("```json"):
        response = response[7:]

    if response.startswith("```"):
        response = response[3:]

    if response.endswith("```"):
        response = response[:-3]

    return response.strip()


def build_prompt(resume_text, job_description):
    return f"""
You are an expert Applicant Tracking System (ATS) and technical recruiter.

Analyze the candidate's resume against the target job description.

=========================
STRICT ANALYSIS RULES
=========================

1. Use ONLY information explicitly present in the resume.
2. NEVER invent skills, experience, projects, education,
   certifications, companies, technologies, or achievements.
3. Missing skills MUST come only from requirements explicitly
   mentioned in the job description.
4. Do not assume that a similar skill means the exact skill exists.
5. Be honest and critical.
6. ATS score MUST be an integer from 0 to 100.
7. Do not give a high score simply because the resume is good.
8. Compare the resume specifically against THIS job description.

=========================
ATS SCORE CALCULATION
=========================

Calculate the ATS score approximately using:

Skills Match:             40 percent
Job Keywords Match:       25 percent
Experience Relevance:     15 percent
Project Relevance:        10 percent
Resume Structure:         10 percent

The final atsScore must be between 0 and 100.

=========================
ANALYSIS REQUIREMENTS
=========================

SUMMARY:
Give a concise overall assessment.

STRENGTHS:
List genuine strengths found in the resume that are relevant
to the target job.

WEAKNESSES:
Identify genuine weaknesses or areas where the resume does
not sufficiently demonstrate the job requirements.

MISSING SKILLS:
List skills explicitly required by the job description that
are not demonstrated in the resume.

RECOMMENDATIONS:
Provide specific and actionable improvements.
Recommendations should help improve the candidate's chances
for THIS job.

EXPERIENCE ANALYSIS:
Explain how relevant the candidate's actual experience is
to the target job.

PROJECT ANALYSIS:
Explain how relevant the candidate's actual projects are
to the target job.

=========================
JSON RULES
=========================

Return ONLY valid JSON.

Do NOT return Markdown.
Do NOT use markdown code fences.
Do NOT add text before or after the JSON.

The following fields MUST ALWAYS be JSON arrays:

strengths
weaknesses
missingSkills
recommendations

Even if there is only ONE item, return an array.

Correct:
"recommendations": ["Learn Docker"]

Incorrect:
"recommendations": "Learn Docker"

=========================
REQUIRED JSON FORMAT
=========================

{{
  "atsScore": 0,
  "summary": "string",
  "strengths": ["string"],
  "weaknesses": ["string"],
  "missingSkills": ["string"],
  "recommendations": ["string"],
  "experienceAnalysis": "string",
  "projectAnalysis": "string"
}}

=========================
RESUME
=========================

{resume_text}

=========================
JOB DESCRIPTION
=========================

{job_description or ""}
"""


def analyze_resume(resume_text, job_description=""):
    if not resume_text or not resume_text.strip():
        raise ValueError("Resume text is empty.")

    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        raise ValueError(
            "GROQ_API_KEY environment variable is not configured."
        )

    prompt = build_prompt(
        resume_text,
        job_description
    )

    request_body = {
        "model": MODEL,
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are an expert ATS resume analyzer. "
                    "Always follow the user's instructions exactly."
                )
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        "temperature": 0.2,
        "response_format": {
            "type": "json_object"
        }
    }

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    try:
        response = requests.post(
            GROQ_URL,
            json=request_body,
            headers=headers,
            timeout=120
        )

        if not response.ok:
            raise RuntimeError(
                f"Groq request failed with status: "
                f"{response.status_code} - {response.text}"
            )

        body = response.json()

        choices = body.get("choices")

        if not choices:
            raise RuntimeError("Groq returned no choices.")

        message = choices[0].get("message")

        if not message:
            raise RuntimeError(
                "Groq response does not contain a message."
            )

        content = message.get("content")

        if not content or not content.strip():
            raise RuntimeError(
                "Groq returned an empty response."
            )

        cleaned_json = clean_json_response(content)

        return json.loads(cleaned_json)

    except json.JSONDecodeError as e:
        raise RuntimeError(
            f"Groq returned invalid JSON: {str(e)}"
        )

    except requests.RequestException as e:
        raise RuntimeError(
            f"Groq AI analysis failed: {str(e)}"
        )