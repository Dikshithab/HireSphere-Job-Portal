package com.jobportal.backend.controller;

import com.jobportal.backend.dto.ChatbotResponse;
import com.jobportal.backend.service.ChatbotService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://hiresphere-job-portal-2.onrender.com"
})
public class ChatbotController {

    private final ChatbotService chatbotService;

    @PostMapping
public ChatbotResponse chat(
        @RequestBody ChatbotRequest request) {

    if (request == null ||
            request.getMessage() == null ||
            request.getMessage().isBlank()) {

        return new ChatbotResponse(
                "Please enter a message.",
                java.util.List.of()
        );
    }

    if (request.getMessage().length() > 2000) {

        return new ChatbotResponse(
                "Please keep your message under 2000 characters.",
                java.util.List.of()
        );
    }

    return chatbotService.ask(
            request.getMessage().trim()
    );
}

    public static class ChatbotRequest {

        private String message;

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}