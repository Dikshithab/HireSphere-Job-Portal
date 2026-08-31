package com.jobportal.backend.dto;

import com.jobportal.backend.entity.Resume;
import com.jobportal.backend.entity.ResumeCertification;
import com.jobportal.backend.entity.ResumeEducation;
import com.jobportal.backend.entity.ResumeExperience;
import com.jobportal.backend.entity.ResumeProject;
import com.jobportal.backend.entity.ResumeSkill;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ResumeDetailsResponse {

    private Long id;
    private String title;
    private String fullName;
    private String email;
    private String phone;
    private String location;

    private String linkedin;
    private String github;
    private String portfolio;

    private String summary;

    private String source;
    private String fileName;

    private List<ResumeEducation> education;
    private List<ResumeExperience> experience;
    private List<ResumeProject> projects;
    private List<ResumeCertification> certifications;
    private List<ResumeSkill> skills;

    public ResumeDetailsResponse(
            Resume resume,
            List<ResumeEducation> education,
            List<ResumeExperience> experience,
            List<ResumeProject> projects,
            List<ResumeCertification> certifications,
            List<ResumeSkill> skills) {

        this.id = resume.getId();
        this.title = resume.getTitle();
        this.fullName = resume.getFullName();
        this.email = resume.getEmail();
        this.phone = resume.getPhone();
        this.location = resume.getLocation();

        this.linkedin = resume.getLinkedin();
        this.github = resume.getGithub();
        this.portfolio = resume.getPortfolio();

        this.summary = resume.getSummary();

        this.source = resume.getSource();
        this.fileName = resume.getFileName();

        this.education = education;
        this.experience = experience;
        this.projects = projects;
        this.certifications = certifications;
        this.skills = skills;
    }
}
