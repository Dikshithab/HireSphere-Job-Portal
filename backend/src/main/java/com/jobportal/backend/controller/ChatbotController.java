package com.jobportal.backend.controller;

import com.jobportal.backend.service.ChatbotService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ChatbotController {

    private final ChatbotService chatbotService;

    @PostMapping
    public ChatbotResponse chat(
            @RequestBody ChatbotRequest request) {

        String response =
                chatbotService.ask(request.getMessage());

        return new ChatbotResponse(response);
    }

    // ==============================
    // REQUEST
    // ==============================

    public static class ChatbotRequest {

        private String message;

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }

    // ==============================
    // RESPONSE
    // ==============================

    public static class ChatbotResponse {

        private String response;

        public ChatbotResponse(String response) {
            this.response = response;
        }

        public String getResponse() {
            return response;
        }
    }
}