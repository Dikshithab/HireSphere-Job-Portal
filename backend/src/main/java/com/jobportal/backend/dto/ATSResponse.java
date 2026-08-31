package com.jobportal.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class ATSResponse {

    private int score;

    private int keywordMatch;

    private int skillsMatch;

    private List<String> matchedSkills;

    private List<String> missingSkills;

    private List<String> recommendations;
}