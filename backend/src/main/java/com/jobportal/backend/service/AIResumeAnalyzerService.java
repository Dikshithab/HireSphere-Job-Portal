package com.jobportal.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobportal.backend.dto.AIResumeAnalysisResponse;
import com.jobportal.backend.entity.Resume;
import com.jobportal.backend.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AIResumeAnalyzerService {

    private final ResumeRepository resumeRepository;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String OLLAMA_URL =
            "http://localhost:11434/api/generate";

    private static final String MODEL =
            "llama3.2:latest";

    public AIResumeAnalysisResponse analyze(
            Long resumeId,
            String jobDescription) {

        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() ->
                        new RuntimeException("Resume not found"));

        String resumeText = resume.getExtractedText();

        if (resumeText == null || resumeText.trim().isEmpty()) {
            throw new RuntimeException("Resume text is empty.");
        }

        String prompt = buildPrompt(
                resumeText,
                jobDescription
        );

        Map<String, Object> requestBody = Map.of(
                "model", MODEL,
                "prompt", prompt,
                "stream", false
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response =
                restTemplate.postForEntity(
                        OLLAMA_URL,
                        request,
                        Map.class
                );

        if (!response.getStatusCode().is2xxSuccessful()
                || response.getBody() == null) {

            throw new RuntimeException(
                    "Ollama request failed."
            );
        }

        Object responseText =
                response.getBody().get("response");

        if (responseText == null) {
            throw new RuntimeException(
                    "Ollama returned an empty response."
            );
        }

        try {
            String json =
                    cleanJsonResponse(responseText.toString());

            return objectMapper.readValue(
                    json,
                    AIResumeAnalysisResponse.class
            );

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to parse Ollama AI response: "
                            + e.getMessage(),
                    e
            );
        }
    }

    private String buildPrompt(
            String resumeText,
            String jobDescription) {

        return """
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

        {
          "atsScore": 0,
          "summary": "string",
          "strengths": ["string"],
          "weaknesses": ["string"],
          "missingSkills": ["string"],
          "recommendations": ["string"],
          "experienceAnalysis": "string",
          "projectAnalysis": "string"
        }

        =========================
        RESUME
        =========================

        """
                + resumeText
                + """

        =========================
        JOB DESCRIPTION
        =========================

        """
                + (jobDescription == null ? "" : jobDescription);
    }






    private String cleanJsonResponse(String response) {

        response = response.trim();

        if (response.startsWith("```json")) {
            response = response.substring(7);
        }

        if (response.startsWith("```")) {
            response = response.substring(3);
        }

        if (response.endsWith("```")) {
            response = response.substring(
                    0,
                    response.length() - 3
            );
        }

        return response.trim();
    }
}