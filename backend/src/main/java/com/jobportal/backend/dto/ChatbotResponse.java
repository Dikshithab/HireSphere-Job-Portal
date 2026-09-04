package com.jobportal.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class ChatbotResponse {

    private String response;
    private List<JobResponse> jobs;
}