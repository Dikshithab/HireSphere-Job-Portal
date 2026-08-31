package com.jobportal.backend.controller;

import com.jobportal.backend.dto.ATSRequest;
import com.jobportal.backend.dto.ATSResponse;
import com.jobportal.backend.service.ATSAnalyzerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ats")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ATSController {

    private final ATSAnalyzerService atsAnalyzerService;

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeResume(
            @RequestBody ATSRequest request) {

        try {

            ATSResponse response =
                    atsAnalyzerService.analyze(
                            request.getResumeId(),
                            request.getJobDescription()
                    );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }
}