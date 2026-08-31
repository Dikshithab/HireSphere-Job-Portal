package com.jobportal.backend.controller;

import com.jobportal.backend.entity.Resume;
import com.jobportal.backend.entity.User;
import com.jobportal.backend.repository.UserRepository;
import com.jobportal.backend.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ResumeController {

    private final ResumeService resumeService;
    private final UserRepository userRepository;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadResume(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {

        try {

            if (authentication == null ||
                    !authentication.isAuthenticated()) {

                return ResponseEntity.status(401)
                        .body("User is not authenticated.");
            }

            String email = authentication.getName();

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() ->
                            new RuntimeException("User not found")
                    );

            Resume resume = resumeService.uploadResume(
                    file,
                    user.getId()
            );

            return ResponseEntity.ok(resume);

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.internalServerError()
                    .body("Failed to upload resume: " + e.getMessage());
        }
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyResumes(
            Authentication authentication) {

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            return ResponseEntity.status(401)
                    .body("User is not authenticated.");
        }

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        return ResponseEntity.ok(
                resumeService.getUserResumes(user.getId())
        );
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserResumes(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                resumeService.getUserResumes(userId)
        );
    }

    @GetMapping("/user/{userId}/latest")
    public ResponseEntity<?> getLatestResume(
            @PathVariable Long userId) {

        try {

            return ResponseEntity.ok(
                    resumeService.getLatestResume(userId)
            );

        } catch (RuntimeException e) {

            return ResponseEntity.notFound().build();
        }
    }
}