package com.jobportal.backend.controller;

import com.jobportal.backend.dto.ATSResponse;
import com.jobportal.backend.dto.AIResumeAnalysisResponse;
import com.jobportal.backend.dto.ResumeAnalysisResponse;
import com.jobportal.backend.service.ATSAnalyzerService;
import com.jobportal.backend.service.AIResumeAnalyzerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/resume-analysis")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ResumeAnalysisController {

    private final ATSAnalyzerService atsAnalyzerService;
    private final AIResumeAnalyzerService aiResumeAnalyzerService;

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeResume(
            @RequestParam Long resumeId,
            @RequestParam String jobDescription) {

        try {

            // ATS analysis
            ATSResponse atsResult =
                    atsAnalyzerService.analyze(
                            resumeId,
                            jobDescription
                    );

            // AI analysis
            AIResumeAnalysisResponse aiResult =
                    aiResumeAnalyzerService.analyze(
                            resumeId,
                            jobDescription
                    );

            // Combined response
            ResumeAnalysisResponse response =
                    new ResumeAnalysisResponse(
                            atsResult,
                            aiResult
                    );

            return ResponseEntity.ok(response);

        } catch (Exception e) {

            return ResponseEntity.internalServerError()
                    .body(
                            "Resume analysis failed: "
                                    + e.getMessage()
                    );
        }
    }
}