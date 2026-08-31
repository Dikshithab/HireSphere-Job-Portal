package com.jobportal.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ResumeBuilderRequest {

    // =========================
    // BASIC INFORMATION
    // =========================

    private String title;

    private String fullName;

    private String email;

    private String phone;

    private String location;

    private String linkedin;

    private String github;

    private String portfolio;

    // =========================
    // PROFESSIONAL SUMMARY
    // =========================

    private String summary;

    // =========================
    // EDUCATION
    // =========================

    private List<EducationRequest> education;

    // =========================
    // EXPERIENCE
    // =========================

    private List<ExperienceRequest> experience;

    // =========================
    // PROJECTS
    // =========================

    private List<ProjectRequest> projects;

    // =========================
    // CERTIFICATIONS
    // =========================

    private List<CertificationRequest> certifications;

    // =========================
    // SKILLS
    // =========================

    private List<SkillRequest> skills;


    // =====================================================
    // EDUCATION REQUEST
    // =====================================================

    @Getter
    @Setter
    public static class EducationRequest {

        private String degree;

        private String institution;

        private String fieldOfStudy;

        private String startYear;

        private String endYear;

        private String grade;

        private String description;
    }


    // =====================================================
    // EXPERIENCE REQUEST
    // =====================================================

    @Getter
    @Setter
    public static class ExperienceRequest {

        private String jobTitle;

        private String company;

        private String location;

        private String startDate;

        private String endDate;

        private Boolean currentlyWorking;

        private String description;
    }


    // =====================================================
    // PROJECT REQUEST
    // =====================================================

    @Getter
    @Setter
    public static class ProjectRequest {

        private String projectName;

        private String technologies;

        private String projectUrl;

        private String description;
    }


    // =====================================================
    // CERTIFICATION REQUEST
    // =====================================================

    @Getter
    @Setter
    public static class CertificationRequest {

        private String name;

        private String issuingOrganization;

        private String issueDate;

        private String credentialId;

        private String credentialUrl;
    }


    // =====================================================
    // SKILL REQUEST
    // =====================================================

    @Getter
    @Setter
    public static class SkillRequest {

        private String skillName;

        private String category;
    }
}
