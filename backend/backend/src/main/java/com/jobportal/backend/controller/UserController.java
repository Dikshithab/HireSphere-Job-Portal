package com.jobportal.backend.controller;

import com.jobportal.backend.dto.LoginResponse;
import com.jobportal.backend.dto.UserLoginRequest;
import com.jobportal.backend.dto.UserRegistrationRequest;
import com.jobportal.backend.entity.User;
import com.jobportal.backend.repository.UserRepository;
import com.jobportal.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    // ==========================================
    // TEST
    // ==========================================

    @GetMapping("/test")
    public String test() {
        return userService.testService();
    }

    // ==========================================
    // REGISTER
    // ==========================================

    @PostMapping("/register")
    public String registerUser(
            @RequestBody UserRegistrationRequest request) {

        return userService.registerUser(request);
    }

    // ==========================================
    // LOGIN
    // ==========================================

    @PostMapping("/login")
    public LoginResponse login(
            @RequestBody UserLoginRequest request) {

        return userService.login(request);
    }

    // ==========================================
    // GET MY PROFILE
    // ==========================================

    @GetMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getProfile(
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found!")
                );

        return ResponseEntity.ok(
                new ProfileResponse(
                        user.getId(),
                        user.getFullName(),
                        user.getEmail(),
                        user.getPhone(),
                        user.getRole().name()
                )
        );
    }

    // ==========================================
    // UPDATE MY PROFILE
    // ==========================================

    @PutMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateProfile(
            @RequestBody UpdateProfileRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found!")
                );

        if (request.fullName() == null ||
                request.fullName().trim().isEmpty()) {

            return ResponseEntity.badRequest()
                    .body("Full name cannot be empty.");
        }

        if (request.phone() == null ||
                request.phone().trim().isEmpty()) {

            return ResponseEntity.badRequest()
                    .body("Phone number cannot be empty.");
        }

        user.setFullName(request.fullName().trim());
        user.setPhone(request.phone().trim());

        User updatedUser = userRepository.save(user);

        return ResponseEntity.ok(
                new ProfileResponse(
                        updatedUser.getId(),
                        updatedUser.getFullName(),
                        updatedUser.getEmail(),
                        updatedUser.getPhone(),
                        updatedUser.getRole().name()
                )
        );
    }

    // ==========================================
    // DELETE MY ACCOUNT
    // ==========================================

    @DeleteMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deleteAccount(
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found!")
                );

        userRepository.delete(user);

        return ResponseEntity.ok(
                "Account deleted successfully!"
        );
    }

    // ==========================================
    // PROFILE RESPONSE
    // ==========================================

    public record ProfileResponse(
            Long id,
            String fullName,
            String email,
            String phone,
            String role
    ) {}

    // ==========================================
    // UPDATE PROFILE REQUEST
    // ==========================================

    public record UpdateProfileRequest(
            String fullName,
            String phone
    ) {}
}
