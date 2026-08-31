
        package com.jobportal.backend.service;

import com.jobportal.backend.dto.JobRecommendationResponse;
import com.jobportal.backend.entity.Job;
import com.jobportal.backend.entity.Resume;
import com.jobportal.backend.repository.JobRepository;
import com.jobportal.backend.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobRecommendationService {

    private final JobRepository jobRepository;
    private final ResumeRepository resumeRepository;

    public List<JobRecommendationResponse> getRecommendations(Long userId) {

        // Get the user's latest resume
        Resume resume = resumeRepository
                .findTopByUserIdOrderByUploadedAtDesc(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Please upload a resume before requesting job recommendations."
                        ));

        String resumeText = resume.getExtractedText();

        if (resumeText == null || resumeText.trim().isEmpty()) {
            throw new RuntimeException("Resume text is empty.");
        }

        // Normalize resume text
        String normalizedResume = normalize(resumeText);

        // Get all available jobs
        List<Job> jobs = jobRepository.findAll();

        // Calculate recommendation score for every job
        return jobs.stream()
                .map(job -> calculateRecommendation(job, normalizedResume))
                .sorted(
                        Comparator.comparingInt(
                                JobRecommendationResponse::getMatchScore
                        ).reversed()
                )
                .limit(10)
                .collect(Collectors.toList());
    }

    private JobRecommendationResponse calculateRecommendation(
            Job job,
            String resumeText) {

        // Combine job information
        String jobContent = normalize(
                (job.getTitle() == null ? "" : job.getTitle()) + " " +
                        (job.getDescription() == null ? "" : job.getDescription()) + " " +
                        (job.getRequirements() == null ? "" : job.getRequirements())
        );

        // Extract technical keywords
        Set<String> jobKeywords = extractKeywords(jobContent);

        List<String> matchingSkills = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>();

        // Compare job skills with resume
        for (String keyword : jobKeywords) {

            if (resumeText.contains(keyword)) {
                matchingSkills.add(formatKeyword(keyword));
            } else {
                missingSkills.add(formatKeyword(keyword));
            }
        }

        // Limit displayed skills
        matchingSkills = matchingSkills.stream()
                .distinct()
                .limit(10)
                .collect(Collectors.toList());

        missingSkills = missingSkills.stream()
                .distinct()
                .limit(10)
                .collect(Collectors.toList());

        // Calculate match score
        int matchScore = calculateScore(
                matchingSkills.size(),
                jobKeywords.size()
        );

        // Generate explanation
        String explanation = buildExplanation(
                matchScore,
                matchingSkills,
                missingSkills
        );

        // Get company name safely
        String companyName = "Unknown Company";

        if (job.getCompany() != null &&
                job.getCompany().getName() != null) {

            companyName = job.getCompany().getName();
        }

        return new JobRecommendationResponse(
                job.getId(),
                job.getTitle(),
                companyName,
                job.getLocation(),
                job.getJobType(),
                job.getSalary(),
                job.getExperienceLevel(),
                matchScore,
                matchingSkills,
                missingSkills,
                explanation
        );
    }

    private int calculateScore(
            int matchingCount,
            int totalKeywords) {

        if (totalKeywords == 0) {
            return 0;
        }

        double score =
                ((double) matchingCount / totalKeywords) * 100;

        return Math.min(
                100,
                Math.max(
                        0,
                        (int) Math.round(score)
                )
        );
    }

    private Set<String> extractKeywords(String text) {

        Set<String> keywords = new LinkedHashSet<>();

        /*
         * Common technical skills.
         * This list can be expanded later.
         */
        String[] skills = {
                "java",
                "python",
                "javascript",
                "typescript",
                "react",
                "angular",
                "vue",
                "spring",
                "spring boot",
                "node.js",
                "node",
                "express",
                "mysql",
                "postgresql",
                "mongodb",
                "sql",
                "html",
                "css",
                "tailwind",
                "docker",
                "kubernetes",
                "aws",
                "azure",
                "gcp",
                "git",
                "github",
                "rest api",
                "microservices",
                "hibernate",
                "jpa",
                "redis",
                "kafka",
                "linux",
                "c++",
                "c",
                "machine learning",
                "deep learning",
                "tensorflow",
                "pytorch",
                "artificial intelligence",
                "ai",
                "data structures",
                "algorithms",
                "problem solving"
        };

        for (String skill : skills) {

            if (text.contains(skill)) {
                keywords.add(skill);
            }
        }

        return keywords;
    }

    private String normalize(String text) {

        if (text == null) {
            return "";
        }

        return text
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9+#. ]", " ")
                .replaceAll("\\s+", " ")
                .trim();
    }

    private String formatKeyword(String keyword) {

        return Arrays.stream(keyword.split(" "))
                .filter(word -> !word.isEmpty())
                .map(word ->
                        word.substring(0, 1).toUpperCase()
                                + word.substring(1)
                )
                .collect(Collectors.joining(" "));
    }

    private String buildExplanation(
            int score,
            List<String> matchingSkills,
            List<String> missingSkills) {

        if (score >= 80) {

            return "Excellent match. Your resume contains many of the "
                    + "technical skills mentioned in this job.";
        }

        if (score >= 60) {

            return "Good match. Your resume matches several important "
                    + "requirements, but some skills could be strengthened.";
        }

        if (score >= 40) {

            return "Moderate match. Consider improving your resume with "
                    + "skills and experience relevant to this position.";
        }

        return "Low match. This position contains several requirements "
                + "that are not currently demonstrated in your resume.";
    }
}

