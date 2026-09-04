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

        return chatbotService.ask(
                request.getMessage()
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