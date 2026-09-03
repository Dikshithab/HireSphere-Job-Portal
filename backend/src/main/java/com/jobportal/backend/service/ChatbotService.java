
package com.jobportal.backend.service;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
public class ChatbotService {

    private final RestClient restClient;

    public ChatbotService() {
        this.restClient = RestClient.builder()
                .baseUrl("https://api.groq.com/openai/v1")
                .build();
    }

    public String ask(String userMessage) {

        String apiKey = System.getenv("GROQ_API_KEY");

        if (apiKey == null || apiKey.isBlank()) {
            System.out.println("========== GROQ ERROR ==========");
            System.out.println("GROQ_API_KEY is missing!");
            System.out.println("================================");

            return "Groq API key is not configured.";
        }

        Map<String, Object> request = Map.of(
                "model", "openai/gpt-oss-120b",

                "messages", List.of(
                        Map.of(
                                "role", "system",
                                "content",
                                "You are HireSphere AI, a helpful assistant for a job portal. " +
                                "Help users with jobs, applications, resumes, employers, " +
                                "career guidance, and using the HireSphere website. " +
                                "Keep answers clear, useful, and concise."
                        ),

                        Map.of(
                                "role", "user",
                                "content", userMessage
                        )
                ),

                "temperature", 0.7
        );

        try {

            Map response = restClient.post()
                    .uri("/chat/completions")
                    .header("Authorization", "Bearer " + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(Map.class);

            if (response != null &&
                    response.get("choices") instanceof List<?> choices &&
                    !choices.isEmpty()) {

                Map firstChoice = (Map) choices.get(0);

                if (firstChoice.get("message") instanceof Map message) {

                    Object content = message.get("content");

                    if (content != null) {
                        return content.toString();
                    }
                }
            }

            return "Sorry, I couldn't generate a response.";

        } catch (Exception e) {

            System.out.println("========== GROQ ERROR ==========");
            System.out.println("TYPE: " + e.getClass().getName());
            System.out.println("MESSAGE: " + e.getMessage());
            System.out.println("================================");

            return "Sorry, I'm unable to respond right now.";
        }
    }
}
