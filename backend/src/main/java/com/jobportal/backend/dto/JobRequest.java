package com.jobportal.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class JobRequest {

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

    private Long companyId;
}