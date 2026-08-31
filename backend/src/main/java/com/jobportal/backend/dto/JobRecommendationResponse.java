package com.jobportal.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JobRecommendationResponse {

    private Long jobId;

    private String title;

    private String companyName;

    private String location;

    private String jobType;

    private Double salary;

    private String experienceLevel;

    private int matchScore;

    private List<String> matchingSkills;

    private List<String> missingSkills;

    private String explanation;
}