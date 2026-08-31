package com.jobportal.backend.controller;

import com.jobportal.backend.dto.AIResumeAnalysisResponse;
import com.jobportal.backend.dto.ATSRequest;
import com.jobportal.backend.exception.InvalidRequestException;
import com.jobportal.backend.service.AIResumeAnalyzerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai-resume")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AIResumeController {

    private final AIResumeAnalyzerService aiResumeAnalyzerService;

    @PostMapping("/analyze")
    public ResponseEntity<?> analyze(
            @RequestBody ATSRequest request) {

        if (request == null || request.getResumeId() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "error",
                            "Required field 'resumeId' is missing."
                    ));
        }

        try {
            String jobDescription = request.getJobDescription();

            if (jobDescription == null) {
                jobDescription = "";
            }

            AIResumeAnalysisResponse response =
                    aiResumeAnalyzerService.analyze(
                            request.getResumeId(),
                            jobDescription
                    );

            return ResponseEntity.ok(response);

        } catch (InvalidRequestException e) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "error",
                            e.getMessage()
                    ));

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error",
                            "AI Resume Analysis failed: " + e.getMessage()
                    ));
        }
    }
}