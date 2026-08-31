package com.jobportal.backend.controller;

import com.jobportal.backend.dto.ApplicationRequest;
import com.jobportal.backend.dto.ApplicationResponse;
import com.jobportal.backend.entity.ApplicationStatus;
import com.jobportal.backend.service.JobApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.jobportal.backend.dto.EmployerDashboardResponse;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class JobApplicationController {

    private final JobApplicationService applicationService;

    @PostMapping
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public ApplicationResponse applyForJob(
            @RequestBody ApplicationRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        return applicationService.applyForJob(request, email);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public List<ApplicationResponse> getMyApplications(
            Authentication authentication) {

        String email = authentication.getName();

        return applicationService.getMyApplications(email);
    }

    @GetMapping("/employer")
    @PreAuthorize("hasRole('EMPLOYER')")
    public List<ApplicationResponse> getEmployerApplications(
            Authentication authentication) {

        String email = authentication.getName();

        return applicationService.getEmployerApplications(email);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ApplicationResponse updateStatus(
            @PathVariable Long id,
            @RequestParam ApplicationStatus status,
            Authentication authentication) {

        String email = authentication.getName();

        return applicationService.updateStatus(
                id,
                status,
                email
        );
    }
    @GetMapping("/employer/dashboard")
    @PreAuthorize("hasRole('EMPLOYER')")
    public EmployerDashboardResponse getEmployerDashboard(
            Authentication authentication) {

        String email = authentication.getName();

        return applicationService.getEmployerDashboard(email);
    }
    @GetMapping("/employer/count")
    @PreAuthorize("hasRole('EMPLOYER')")
    public long getEmployerApplicationCount(
            Authentication authentication) {

        String email = authentication.getName();

        return applicationService.getEmployerApplicationCount(email);
    }
}

