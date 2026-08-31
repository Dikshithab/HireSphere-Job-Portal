package com.jobportal.backend.service;

import com.jobportal.backend.dto.JobMatchResponse;
import com.jobportal.backend.entity.Job;
import com.jobportal.backend.entity.Resume;
import com.jobportal.backend.entity.User;
import com.jobportal.backend.exception.InvalidRequestException;
import com.jobportal.backend.repository.JobRepository;
import com.jobportal.backend.repository.ResumeRepository;
import com.jobportal.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AIJobMatchingService {

    private final JobRepository jobRepository;
    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;

    private static final List<String> TECHNICAL_SKILLS = List.of(
            "java", "python", "c", "c++", "c#", "javascript", "typescript",
            "react", "angular", "vue", "html", "css", "spring", "spring boot",
            "hibernate", "mysql", "postgresql", "mongodb", "redis", "oracle",
            "sql", "git", "github", "docker", "kubernetes", "aws", "azure",
            "gcp", "rest api", "microservices", "machine learning", "deep learning",
            "artificial intelligence", "tensorflow", "pytorch", "node", "node.js",
            "express", "next.js", "django", "flask", "fastapi", "kafka", "rabbitmq",
            "graphql", "ci/cd", "jenkins", "linux", "agile", "scrum"
    );

    public List<JobMatchResponse> findMatchingJobs(Long resumeId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new InvalidRequestException("User not found with email: " + userEmail));

        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new InvalidRequestException("Resume not found with ID: " + resumeId));

        // Security check: verify resume belongs to authenticated user
        if (!resume.getUser().getId().equals(user.getId())) {
            throw new InvalidRequestException("Access denied: This resume does not belong to your account.");
        }

        String resumeText = resume.getExtractedText();
        if (resumeText == null || resumeText.isBlank()) {
            throw new InvalidRequestException("Resume text is empty or could not be extracted.");
        }

        String lowerResume = resumeText.toLowerCase();

        List<Job> allJobs = jobRepository.findAll();
        if (allJobs.isEmpty()) {
            return Collections.emptyList();
        }

        List<JobMatchResponse> matches = new ArrayList<>();

        for (Job job : allJobs) {
            String jobText = (
                    (job.getTitle() != null ? job.getTitle() : "") + " " +
                    (job.getDescription() != null ? job.getDescription() : "") + " " +
                    (job.getRequirements() != null ? job.getRequirements() : "")
            ).toLowerCase();

            List<String> matchedSkills = new ArrayList<>();
            List<String> missingSkills = new ArrayList<>();

            // 1. Skill Extraction & Comparison
            for (String skill : TECHNICAL_SKILLS) {
                if (jobText.contains(skill)) {
                    if (lowerResume.contains(skill)) {
                        matchedSkills.add(capitalize(skill));
                    } else {
                        missingSkills.add(capitalize(skill));
                    }
                }
            }

            // 2. Score Calculation
            int score = calculateMatchScore(job, lowerResume, matchedSkills, missingSkills);

            // 3. Generate Match Reason
            String matchReason = generateMatchReason(job, score, matchedSkills, missingSkills);

            JobMatchResponse response = new JobMatchResponse(
                    job.getId(),
                    job.getTitle(),
                    job.getCompany() != null ? job.getCompany().getName() : "Company",
                    job.getLocation(),
                    job.getJobType(),
                    job.getSalary(),
                    job.getExperienceLevel(),
                    score,
                    matchedSkills,
                    missingSkills,
                    matchReason
            );

            matches.add(response);
        }

        // Sort by matchScore DESC
        matches.sort((a, b) -> Integer.compare(b.getMatchScore(), a.getMatchScore()));

        return matches;
    }

    private int calculateMatchScore(
            Job job,
            String lowerResume,
            List<String> matchedSkills,
            List<String> missingSkills
    ) {
        int totalSkills = matchedSkills.size() + missingSkills.size();
        int skillScore = 0;
        if (totalSkills > 0) {
            skillScore = (matchedSkills.size() * 100) / totalSkills;
        } else {
            skillScore = 50; // Neutral if job didn't specify keywords from our list
        }

        // Skill match accounts for 50%
        int score = (skillScore * 50) / 100;

        // Title relevance accounts for 20%
        if (job.getTitle() != null) {
            String[] titleWords = job.getTitle().toLowerCase().split("\\s+");
            int titleMatches = 0;
            for (String word : titleWords) {
                if (word.length() > 2 && lowerResume.contains(word)) {
                    titleMatches++;
                }
            }
            if (titleWords.length > 0) {
                score += Math.min(20, (titleMatches * 20) / titleWords.length);
            }
        }

        // Experience & Project completeness accounts for 20%
        int contentScore = 0;
        if (lowerResume.contains("experience") || lowerResume.contains("work history")) {
            contentScore += 7;
        }
        if (lowerResume.contains("project") || lowerResume.contains("projects")) {
            contentScore += 7;
        }
        if (lowerResume.contains("education") || lowerResume.contains("degree") || lowerResume.contains("bachelor") || lowerResume.contains("master")) {
            contentScore += 6;
        }
        score += contentScore;

        // Location or Job Type bonus accounts for 10%
        if (job.getLocation() != null && lowerResume.contains(job.getLocation().toLowerCase())) {
            score += 5;
        }
        if (job.getJobType() != null && lowerResume.contains(job.getJobType().toLowerCase())) {
            score += 5;
        }

        return Math.min(100, Math.max(10, score));
    }

    private String generateMatchReason(
            Job job,
            int score,
            List<String> matchedSkills,
            List<String> missingSkills
    ) {
        if (score >= 80) {
            if (!matchedSkills.isEmpty()) {
                return "Strong match! Your resume demonstrates core proficiencies in "
                        + String.join(", ", matchedSkills.subList(0, Math.min(3, matchedSkills.size())))
                        + ", closely matching the requirements for " + job.getTitle() + ".";
            }
            return "Excellent compatibility with the required qualifications and experience for " + job.getTitle() + ".";
        }

        if (score >= 60) {
            if (!matchedSkills.isEmpty()) {
                String missingPart = !missingSkills.isEmpty()
                        ? " Adding experience with " + missingSkills.get(0) + " would further boost your alignment."
                        : "";
                return "Good match with skills in "
                        + String.join(", ", matchedSkills.subList(0, Math.min(3, matchedSkills.size())))
                        + "." + missingPart;
            }
            return "Solid foundation for this role, matching several core responsibilities.";
        }

        if (score >= 40) {
            if (!missingSkills.isEmpty()) {
                return "Moderate match. Key required technologies missing include "
                        + String.join(", ", missingSkills.subList(0, Math.min(3, missingSkills.size())))
                        + ".";
            }
            return "Partial match. Consider highlighting relevant projects and domain skills.";
        }

        return "Low match. This role requires specific technical stack and experience not currently highlighted in your resume.";
    }

    private String capitalize(String text) {
        if (text == null || text.isEmpty()) return "";
        if (text.length() <= 3 || text.equalsIgnoreCase("aws") || text.equalsIgnoreCase("gcp") || text.equalsIgnoreCase("sql") || text.equalsIgnoreCase("api")) {
            return text.toUpperCase();
        }
        return Character.toUpperCase(text.charAt(0)) + text.substring(1);
    }
}
