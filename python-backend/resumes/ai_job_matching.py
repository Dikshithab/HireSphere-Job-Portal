from jobs.models import Job
from .models import Resume


TECHNICAL_SKILLS = [
    "java", "python", "c", "c++", "c#", "javascript", "typescript",
    "react", "angular", "vue", "html", "css", "spring", "spring boot",
    "hibernate", "mysql", "postgresql", "mongodb", "redis", "oracle",
    "sql", "git", "github", "docker", "kubernetes", "aws", "azure",
    "gcp", "rest api", "microservices", "machine learning", "deep learning",
    "artificial intelligence", "tensorflow", "pytorch", "node", "node.js",
    "express", "next.js", "django", "flask", "fastapi", "kafka", "rabbitmq",
    "graphql", "ci/cd", "jenkins", "linux", "agile", "scrum"
]


def capitalize_skill(text):
    if not text:
        return ""

    if (
        len(text) <= 3
        or text.lower() in ["aws", "gcp", "sql", "api"]
    ):
        return text.upper()

    return text[0].upper() + text[1:]


def calculate_match_score(
    job,
    lower_resume,
    matched_skills,
    missing_skills
):
    total_skills = len(matched_skills) + len(missing_skills)

    if total_skills > 0:
        skill_score = (
            len(matched_skills) * 100
        ) // total_skills
    else:
        skill_score = 50

    # Skill match = 50%
    score = (skill_score * 50) // 100

    # Title relevance = 20%
    if job.title:
        title_words = job.title.lower().split()

        title_matches = 0

        for word in title_words:
            if len(word) > 2 and word in lower_resume:
                title_matches += 1

        if title_words:
            score += min(
                20,
                (title_matches * 20) // len(title_words)
            )

    # Experience + Projects + Education = 20%
    content_score = 0

    if (
        "experience" in lower_resume
        or "work history" in lower_resume
    ):
        content_score += 7

    if (
        "project" in lower_resume
        or "projects" in lower_resume
    ):
        content_score += 7

    if (
        "education" in lower_resume
        or "degree" in lower_resume
        or "bachelor" in lower_resume
        or "master" in lower_resume
    ):
        content_score += 6

    score += content_score

    # Location + Job Type = 10%
    if (
        job.location
        and job.location.lower() in lower_resume
    ):
        score += 5

    if (
        job.job_type
        and job.job_type.lower() in lower_resume
    ):
        score += 5

    return min(100, max(10, score))


def generate_match_reason(
    job,
    score,
    matched_skills,
    missing_skills
):
    if score >= 80:

        if matched_skills:
            skills = ", ".join(
                matched_skills[:3]
            )

            return (
                f"Strong match! Your resume demonstrates "
                f"core proficiencies in {skills}, closely "
                f"matching the requirements for {job.title}."
            )

        return (
            f"Excellent compatibility with the required "
            f"qualifications and experience for {job.title}."
        )

    if score >= 60:

        if matched_skills:
            skills = ", ".join(
                matched_skills[:3]
            )

            missing_part = ""

            if missing_skills:
                missing_part = (
                    f" Adding experience with "
                    f"{missing_skills[0]} would further "
                    f"boost your alignment."
                )

            return (
                f"Good match with skills in "
                f"{skills}.{missing_part}"
            )

        return (
            "Solid foundation for this role, matching "
            "several core responsibilities."
        )

    if score >= 40:

        if missing_skills:
            skills = ", ".join(
                missing_skills[:3]
            )

            return (
                f"Moderate match. Key required technologies "
                f"missing include {skills}."
            )

        return (
            "Partial match. Consider highlighting relevant "
            "projects and domain skills."
        )

    return (
        "Low match. This role requires specific technical "
        "stack and experience not currently highlighted "
        "in your resume."
    )


def find_matching_jobs(resume_id, user):
    # ------------------------------------------
    # USER SECURITY
    # ------------------------------------------

    if user.role != "JOB_SEEKER":
        raise PermissionError(
            "Only Job Seekers can access AI Job Matching."
        )

    # ------------------------------------------
    # GET RESUME
    # ------------------------------------------

    try:
        resume = Resume.objects.get(id=resume_id)
    except Resume.DoesNotExist:
        raise ValueError(
            f"Resume not found with ID: {resume_id}"
        )

    # ------------------------------------------
    # SECURITY CHECK
    # ------------------------------------------

    if resume.user_id != user.id:
        raise PermissionError(
            "Access denied: This resume does not "
            "belong to your account."
        )

    # ------------------------------------------
    # RESUME TEXT
    # ------------------------------------------

    resume_text = resume.extracted_text

    if not resume_text or not resume_text.strip():
        raise ValueError(
            "Resume text is empty or could not be extracted."
        )

    lower_resume = resume_text.lower()

    # ------------------------------------------
    # GET JOBS
    # ------------------------------------------

    jobs = (
        Job.objects
        .select_related("company")
        .all()
    )

    if not jobs.exists():
        return []

    matches = []

    # ------------------------------------------
    # MATCH EACH JOB
    # ------------------------------------------

    for job in jobs:

        job_text = (
            f"{job.title or ''} "
            f"{job.description or ''} "
            f"{job.requirements or ''}"
        ).lower()

        matched_skills = []
        missing_skills = []

        # Skill extraction and comparison
        for skill in TECHNICAL_SKILLS:

            if skill in job_text:

                if skill in lower_resume:
                    matched_skills.append(
                        capitalize_skill(skill)
                    )
                else:
                    missing_skills.append(
                        capitalize_skill(skill)
                    )

        # Score
        score = calculate_match_score(
            job,
            lower_resume,
            matched_skills,
            missing_skills
        )

        # Reason
        match_reason = generate_match_reason(
            job,
            score,
            matched_skills,
            missing_skills
        )

        matches.append({
            "jobId": job.id,
            "jobTitle": job.title,
            "companyName": (
                job.company.name
                if job.company
                else "Company"
            ),
            "location": job.location,
            "jobType": job.job_type,
            "salary": float(job.salary)
            if job.salary is not None
            else None,
            "experienceLevel": job.experience_level,
            "matchScore": score,
            "matchedSkills": matched_skills,
            "missingSkills": missing_skills,
            "matchReason": match_reason,
        })

    # ------------------------------------------
    # SORT BY SCORE DESCENDING
    # ------------------------------------------

    matches.sort(
        key=lambda item: item["matchScore"],
        reverse=True
    )

    return matches