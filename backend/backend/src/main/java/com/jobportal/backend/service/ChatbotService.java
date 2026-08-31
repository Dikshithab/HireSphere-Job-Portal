package com.jobportal.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Service
public class ChatbotService {

    private final RestClient restClient;

    public ChatbotService() {
        this.restClient = RestClient.builder()
                .baseUrl("http://localhost:11434")
                .build();
    }

    public String ask(String userMessage) {

        String prompt =
                "You are HireSphere AI, an assistant for a job portal. " +
                        "Help users with finding jobs, applications, resumes, " +
                        "employer questions, and using the HireSphere website.\n\n" +
                        "User question: " + userMessage;

        Map<String, Object> request = Map.of(
                "model", "llama3.2",
                "prompt", prompt,
                "stream", false
        );

        Map response = restClient.post()
                .uri("/api/generate")
                .body(request)
                .retrieve()
                .body(Map.class);

        if (response != null && response.get("response") != null) {
            return response.get("response").toString();
        }

        return "Sorry, I couldn't generate a response.";
    }
}