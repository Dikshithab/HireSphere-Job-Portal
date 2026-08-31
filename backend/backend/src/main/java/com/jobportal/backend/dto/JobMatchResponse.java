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
public class JobMatchResponse {

    private Long jobId;

    private String jobTitle;

    private String companyName;

    private String location;

    private String jobType;

    private Double salary;

    private String experienceLevel;

    private Integer matchScore;

    private List<String> matchedSkills;

    private List<String> missingSkills;

    private String matchReason;
}
