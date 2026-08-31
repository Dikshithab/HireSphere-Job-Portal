package com.jobportal.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class JobResponse {

    private Long id;

    private String title;

    private String description;

    private String requirements;

    private String skills;

    private String location;

    private String jobType;

    private Double salary;

    private String experienceLevel;

    private Integer vacancies;

    private LocalDate applicationDeadline;

    private Boolean remote;

    private String status;

    private LocalDateTime createdAt;

    private Long companyId;

    private String companyName;
}