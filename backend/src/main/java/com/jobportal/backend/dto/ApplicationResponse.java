package com.jobportal.backend.dto;

import com.jobportal.backend.entity.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ApplicationResponse {

    private Long id;

    private Long jobId;

    private String jobTitle;

    private String companyName;

    private String applicantName;

    private String applicantEmail;

    private ApplicationStatus status;

    private LocalDateTime appliedAt;
}

