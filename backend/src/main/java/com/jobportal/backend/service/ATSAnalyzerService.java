package com.jobportal.backend.service;

import com.jobportal.backend.dto.ATSResponse;
import com.jobportal.backend.entity.Resume;
import com.jobportal.backend.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ATSAnalyzerService {

    private final ResumeRepository resumeRepository;

    private static final List<String> TECHNICAL_SKILLS = List.of(
            "java",
            "python",
            "c",
            "c++",
            "javascript",
            "typescript",
            "react",
            "angular",
            "vue",
            "html",
            "css",
            "spring",
            "spring boot",
            "hibernate",
            "mysql",
            "postgresql",
            "mongodb",
            "sql",
            "git",
            "github",
            "docker",
            "kubernetes",
            "aws",
            "azure",
            "gcp",
            "rest api",
            "microservices",
            "machine learning",
            "deep learning",
            "artificial intelligence",
            "tensorflow",
            "pytorch"
    );

    public ATSResponse analyze(
            Long resumeId,
            String jobDescription) {

        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() ->
                        new RuntimeException("Resume not found"));

        String resumeText =
                resume.getExtractedText().toLowerCase();

        String jobText =
                jobDescription.toLowerCase();

        List<String> matchedSkills = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>();

        // Find skills required by the job description
        for (String skill : TECHNICAL_SKILLS) {

            if (jobText.contains(skill)) {

                if (resumeText.contains(skill)) {
                    matchedSkills.add(skill);
                } else {
                    missingSkills.add(skill);
                }
            }
        }

        // Calculate keyword match
        int totalRequiredSkills =
                matchedSkills.size() + missingSkills.size();

        int keywordMatch = 0;

        if (totalRequiredSkills > 0) {

            keywordMatch =
                    (matchedSkills.size() * 100)
                            / totalRequiredSkills;
        }

        // Skills score
        int skillsMatch = keywordMatch;

        // Calculate final ATS score
        int score = calculateScore(
                keywordMatch,
                resumeText
        );

        // Recommendations
        List<String> recommendations =
                generateRecommendations(
                        resumeText,
                        missingSkills,
                        score
                );

        return new ATSResponse(
                score,
                keywordMatch,
                skillsMatch,
                matchedSkills,
                missingSkills,
                recommendations
        );
    }

    private int calculateScore(
            int keywordMatch,
            String resumeText) {

        int score = 0;

        // Keywords = 60%
        score += (keywordMatch * 60) / 100;

        // Resume content = 40%
        int contentScore = 0;

        if (resumeText.contains("experience")) {
            contentScore += 10;
        }

        if (resumeText.contains("education")) {
            contentScore += 10;
        }

        if (resumeText.contains("skills")) {
            contentScore += 10;
        }

        if (resumeText.contains("project")) {
            contentScore += 10;
        }

        score += contentScore;

        return Math.min(score, 100);
    }

    private List<String> generateRecommendations(
            String resumeText,
            List<String> missingSkills,
            int score) {

        List<String> recommendations =
                new ArrayList<>();

        if (score < 50) {
            recommendations.add(
                    "Your resume has a low match with the job description."
            );
        } else if (score < 75) {
            recommendations.add(
                    "Your resume has a moderate match. Consider adding missing skills."
            );
        } else {
            recommendations.add(
                    "Your resume has a strong match with the job description."
            );
        }

        if (!missingSkills.isEmpty()) {

            recommendations.add(
                    "Consider adding relevant skills: "
                            + String.join(
                            ", ",
                            missingSkills
                    )
            );
        }

        if (!resumeText.contains("experience")) {
            recommendations.add(
                    "Add an Experience section."
            );
        }

        if (!resumeText.contains("project")) {
            recommendations.add(
                    "Add relevant projects to your resume."
            );
        }

        if (!resumeText.contains("education")) {
            recommendations.add(
                    "Add an Education section."
            );
        }

        if (!resumeText.contains("skills")) {
            recommendations.add(
                    "Add a dedicated Skills section."
            );
        }

        return recommendations;
    }
}