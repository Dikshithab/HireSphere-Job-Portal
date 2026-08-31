package com.jobportal.backend.service;

import com.jobportal.backend.dto.ResumeBuilderRequest;
import com.jobportal.backend.dto.ResumeBuilderResponse;
import com.jobportal.backend.entity.*;
import com.jobportal.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ResumeBuilderService {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;

    private final ResumeEducationRepository educationRepository;
    private final ResumeExperienceRepository experienceRepository;
    private final ResumeProjectRepository projectRepository;
    private final ResumeCertificationRepository certificationRepository;
    private final ResumeSkillRepository skillRepository;

    // =====================================================
    // CREATE RESUME
    // =====================================================

    @Transactional
    public ResumeBuilderResponse createResume(
            ResumeBuilderRequest request,
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found!")
                );

        Resume resume = new Resume();

        resume.setTitle(
                valueOrDefault(request.getTitle(), "My Resume")
        );

        resume.setFullName(request.getFullName());
        resume.setEmail(request.getEmail());
        resume.setPhone(request.getPhone());
        resume.setLocation(request.getLocation());

        resume.setLinkedin(request.getLinkedin());
        resume.setGithub(request.getGithub());
        resume.setPortfolio(request.getPortfolio());

        resume.setSummary(request.getSummary());

        resume.setSource("BUILDER");
        resume.setFileName(null);

        resume.setUser(user);

        /*
         * Generate searchable resume text.
         * This is important because the existing
         * ATS and AI systems use extractedText.
         */
        resume.setExtractedText(
                generateResumeText(request)
        );

        Resume savedResume =
                resumeRepository.save(resume);

        // Save sections
        saveEducation(request, savedResume);
        saveExperience(request, savedResume);
        saveProjects(request, savedResume);
        saveCertifications(request, savedResume);
        saveSkills(request, savedResume);

        return ResumeBuilderResponse.fromResume(
                savedResume,
                "Resume created successfully!"
        );
    }

    // =====================================================
    // UPDATE RESUME
    // =====================================================

    @Transactional
    public ResumeBuilderResponse updateResume(
            Long resumeId,
            ResumeBuilderRequest request,
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found!")
                );

        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() ->
                        new RuntimeException("Resume not found!")
                );

        if (!resume.getUser().getId()
                .equals(user.getId())) {

            throw new RuntimeException(
                    "You are not authorized to update this resume!"
            );
        }

        resume.setTitle(
                valueOrDefault(request.getTitle(), "My Resume")
        );

        resume.setFullName(request.getFullName());
        resume.setEmail(request.getEmail());
        resume.setPhone(request.getPhone());
        resume.setLocation(request.getLocation());

        resume.setLinkedin(request.getLinkedin());
        resume.setGithub(request.getGithub());
        resume.setPortfolio(request.getPortfolio());

        resume.setSummary(request.getSummary());

        resume.setExtractedText(
                generateResumeText(request)
        );

        Resume updatedResume =
                resumeRepository.save(resume);

        // Remove old sections
        educationRepository.deleteByResumeId(resumeId);
        experienceRepository.deleteByResumeId(resumeId);
        projectRepository.deleteByResumeId(resumeId);
        certificationRepository.deleteByResumeId(resumeId);
        skillRepository.deleteByResumeId(resumeId);

        // Save new sections
        saveEducation(request, updatedResume);
        saveExperience(request, updatedResume);
        saveProjects(request, updatedResume);
        saveCertifications(request, updatedResume);
        saveSkills(request, updatedResume);

        return ResumeBuilderResponse.fromResume(
                updatedResume,
                "Resume updated successfully!"
        );
    }

    // =====================================================
    // DELETE RESUME
    // =====================================================

    @Transactional
    public void deleteResume(
            Long resumeId,
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found!")
                );

        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() ->
                        new RuntimeException("Resume not found!")
                );

        if (!resume.getUser().getId()
                .equals(user.getId())) {

            throw new RuntimeException(
                    "You are not authorized to delete this resume!"
            );
        }

        educationRepository.deleteByResumeId(resumeId);
        experienceRepository.deleteByResumeId(resumeId);
        projectRepository.deleteByResumeId(resumeId);
        certificationRepository.deleteByResumeId(resumeId);
        skillRepository.deleteByResumeId(resumeId);

        resumeRepository.delete(resume);
    }

    // =====================================================
    // SAVE EDUCATION
    // =====================================================

    private void saveEducation(
            ResumeBuilderRequest request,
            Resume resume) {

        if (request.getEducation() == null) {
            return;
        }

        for (ResumeBuilderRequest.EducationRequest item
                : request.getEducation()) {

            ResumeEducation education =
                    new ResumeEducation();

            education.setDegree(item.getDegree());
            education.setInstitution(
                    item.getInstitution()
            );
            education.setFieldOfStudy(
                    item.getFieldOfStudy()
            );
            education.setStartYear(
                    item.getStartYear()
            );
            education.setEndYear(
                    item.getEndYear()
            );
            education.setGrade(
                    item.getGrade()
            );
            education.setDescription(
                    item.getDescription()
            );

            education.setResume(resume);

            educationRepository.save(education);
        }
    }

    // =====================================================
    // SAVE EXPERIENCE
    // =====================================================

    private void saveExperience(
            ResumeBuilderRequest request,
            Resume resume) {

        if (request.getExperience() == null) {
            return;
        }

        for (ResumeBuilderRequest.ExperienceRequest item
                : request.getExperience()) {

            ResumeExperience experience =
                    new ResumeExperience();

            experience.setJobTitle(
                    item.getJobTitle()
            );

            experience.setCompany(
                    item.getCompany()
            );

            experience.setLocation(
                    item.getLocation()
            );

            experience.setStartDate(
                    item.getStartDate()
            );

            experience.setEndDate(
                    item.getEndDate()
            );

            experience.setCurrentlyWorking(
                    item.getCurrentlyWorking()
            );

            experience.setDescription(
                    item.getDescription()
            );

            experience.setResume(resume);

            experienceRepository.save(experience);
        }
    }

    // =====================================================
    // SAVE PROJECTS
    // =====================================================

    private void saveProjects(
            ResumeBuilderRequest request,
            Resume resume) {

        if (request.getProjects() == null) {
            return;
        }

        for (ResumeBuilderRequest.ProjectRequest item
                : request.getProjects()) {

            ResumeProject project =
                    new ResumeProject();

            project.setProjectName(
                    item.getProjectName()
            );

            project.setTechnologies(
                    item.getTechnologies()
            );

            project.setProjectUrl(
                    item.getProjectUrl()
            );

            project.setDescription(
                    item.getDescription()
            );

            project.setResume(resume);

            projectRepository.save(project);
        }
    }

    // =====================================================
    // SAVE CERTIFICATIONS
    // =====================================================

    private void saveCertifications(
            ResumeBuilderRequest request,
            Resume resume) {

        if (request.getCertifications() == null) {
            return;
        }

        for (ResumeBuilderRequest.CertificationRequest item
                : request.getCertifications()) {

            ResumeCertification certification =
                    new ResumeCertification();

            certification.setName(
                    item.getName()
            );

            certification.setIssuingOrganization(
                    item.getIssuingOrganization()
            );

            certification.setIssueDate(
                    item.getIssueDate()
            );

            certification.setCredentialId(
                    item.getCredentialId()
            );

            certification.setCredentialUrl(
                    item.getCredentialUrl()
            );

            certification.setResume(resume);

            certificationRepository.save(certification);
        }
    }

    // =====================================================
    // SAVE SKILLS
    // =====================================================

    private void saveSkills(
            ResumeBuilderRequest request,
            Resume resume) {

        if (request.getSkills() == null) {
            return;
        }

        for (ResumeBuilderRequest.SkillRequest item
                : request.getSkills()) {

            ResumeSkill skill =
                    new ResumeSkill();

            skill.setSkillName(
                    item.getSkillName()
            );

            skill.setCategory(
                    item.getCategory()
            );

            skill.setResume(resume);

            skillRepository.save(skill);
        }
    }

    // =====================================================
    // GENERATE RESUME TEXT
    // =====================================================

    private String generateResumeText(
            ResumeBuilderRequest request) {

        StringBuilder text = new StringBuilder();

        append(text, request.getFullName());
        append(text, request.getEmail());
        append(text, request.getPhone());
        append(text, request.getLocation());

        append(text, request.getLinkedin());
        append(text, request.getGithub());
        append(text, request.getPortfolio());

        append(text, request.getSummary());

        // Education
        if (request.getEducation() != null) {

            text.append("\nEDUCATION\n");

            for (ResumeBuilderRequest.EducationRequest item
                    : request.getEducation()) {

                append(text, item.getDegree());
                append(text, item.getInstitution());
                append(text, item.getFieldOfStudy());
                append(text, item.getStartYear());
                append(text, item.getEndYear());
                append(text, item.getGrade());
                append(text, item.getDescription());
            }
        }

        // Experience
        if (request.getExperience() != null) {

            text.append("\nEXPERIENCE\n");

            for (ResumeBuilderRequest.ExperienceRequest item
                    : request.getExperience()) {

                append(text, item.getJobTitle());
                append(text, item.getCompany());
                append(text, item.getLocation());
                append(text, item.getStartDate());
                append(text, item.getEndDate());
                append(text, item.getDescription());
            }
        }

        // Projects
        if (request.getProjects() != null) {

            text.append("\nPROJECTS\n");

            for (ResumeBuilderRequest.ProjectRequest item
                    : request.getProjects()) {

                append(text, item.getProjectName());
                append(text, item.getTechnologies());
                append(text, item.getProjectUrl());
                append(text, item.getDescription());
            }
        }

        // Certifications
        if (request.getCertifications() != null) {

            text.append("\nCERTIFICATIONS\n");

            for (ResumeBuilderRequest.CertificationRequest item
                    : request.getCertifications()) {

                append(text, item.getName());
                append(text, item.getIssuingOrganization());
                append(text, item.getIssueDate());
                append(text, item.getCredentialId());
                append(text, item.getCredentialUrl());
            }
        }

        // Skills
        if (request.getSkills() != null) {

            text.append("\nSKILLS\n");

            for (ResumeBuilderRequest.SkillRequest item
                    : request.getSkills()) {

                append(text, item.getSkillName());
                append(text, item.getCategory());
            }
        }

        return text.toString().trim();
    }

    // =====================================================
    // HELPER
    // =====================================================

    private void append(
            StringBuilder text,
            String value) {

        if (value != null &&
                !value.trim().isEmpty()) {

            text.append(value.trim())
                    .append("\n");
        }
    }

    private String valueOrDefault(
            String value,
            String defaultValue) {

        if (value == null ||
                value.trim().isEmpty()) {

            return defaultValue;
        }

        return value.trim();
    }
}