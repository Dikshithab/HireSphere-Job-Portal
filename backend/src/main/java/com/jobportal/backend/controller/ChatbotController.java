package com.jobportal.backend.controller;

import com.jobportal.backend.dto.JobResponse;
import com.jobportal.backend.service.ChatbotService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

        ChatbotService.ChatbotResult result =
                chatbotService.ask(request.getMessage());

        return new ChatbotResponse(
                result.getResponse(),
                result.getJobs()
        );
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
        private List<JobResponse> jobs;

        public ChatbotResponse(
                String response,
                List<JobResponse> jobs) {

            this.response = response;
            this.jobs = jobs;
        }

        public String getResponse() {
            return response;
        }

        public List<JobResponse> getJobs() {
            return jobs;
        }
    }
}