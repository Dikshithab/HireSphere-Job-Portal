package com.jobportal.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ResumeAnalysisResponse {

    private ATSResponse ats;

    private AIResumeAnalysisResponse ai;
}