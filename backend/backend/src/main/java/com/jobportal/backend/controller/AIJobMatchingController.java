package com.jobportal.backend.controller;

import com.jobportal.backend.dto.JobMatchResponse;
import com.jobportal.backend.service.AIJobMatchingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai-job-matching")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AIJobMatchingController {

    private final AIJobMatchingService aiJobMatchingService;

    @GetMapping("/matches")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public ResponseEntity<List<JobMatchResponse>> getMatchingJobs(
            @RequestParam Long resumeId,
            Authentication authentication) {

        String email = authentication.getName();
        List<JobMatchResponse> matches =
                aiJobMatchingService.findMatchingJobs(resumeId, email);

        return ResponseEntity.ok(matches);
    }
}
