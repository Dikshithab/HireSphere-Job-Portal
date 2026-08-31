
        package com.jobportal.backend.controller;

import com.jobportal.backend.dto.JobRecommendationResponse;
import com.jobportal.backend.entity.User;
import com.jobportal.backend.repository.UserRepository;
import com.jobportal.backend.service.JobRecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/job-recommendations")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class JobRecommendationController {

    private final JobRecommendationService jobRecommendationService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getRecommendations(
            Authentication authentication) {

        try {

            // Make sure the user is authenticated
            if (authentication == null ||
                    !authentication.isAuthenticated()) {

                return ResponseEntity
                        .status(401)
                        .body(Map.of(
                                "error",
                                "User is not authenticated."
                        ));
            }

            // Get email from JWT
            String email = authentication.getName();

            // Find logged-in user
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "User not found."
                            ));

            // Get job recommendations
            List<JobRecommendationResponse> recommendations =
                    jobRecommendationService
                            .getRecommendations(user.getId());

            return ResponseEntity.ok(recommendations);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "error",
                            e.getMessage() != null
                                    ? e.getMessage()
                                    : "Failed to get job recommendations."
                    ));
        }
    }
}