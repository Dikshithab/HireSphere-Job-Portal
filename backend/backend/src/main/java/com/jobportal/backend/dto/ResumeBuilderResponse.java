package com.jobportal.backend.dto;

import com.jobportal.backend.entity.Resume;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ResumeBuilderResponse {

    private Long id;

    private String title;

    private String fullName;

    private String email;

    private String message;

    public static ResumeBuilderResponse fromResume(
            Resume resume,
            String message) {

        return new ResumeBuilderResponse(
                resume.getId(),
                resume.getTitle(),
                resume.getFullName(),
                resume.getEmail(),
                message
        );
    }
}