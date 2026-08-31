package com.jobportal.backend.controller;

import com.jobportal.backend.dto.JobRequest;
import com.jobportal.backend.dto.JobResponse;
import com.jobportal.backend.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;


    // ==========================================
    // CREATE JOB - EMPLOYER ONLY
    // ==========================================

    @PostMapping
    @PreAuthorize("hasRole('EMPLOYER')")
    public JobResponse createJob(
            @RequestBody JobRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        return jobService.createJob(
                request,
                email
        );
    }


    // ==========================================
    // GET ALL JOBS - PUBLIC
    // ==========================================

    @GetMapping
    public List<JobResponse> getAllJobs() {

        return jobService.getAllJobs();
    }


    // ==========================================
    // GET EMPLOYER'S JOBS - EMPLOYER ONLY
    // ==========================================

    @GetMapping("/employer")
    @PreAuthorize("hasRole('EMPLOYER')")
    public List<JobResponse> getEmployerJobs(
            Authentication authentication) {

        System.out.println(
                "EMAIL = " + authentication.getName()
        );

        System.out.println(
                "AUTHORITIES = "
                        + authentication.getAuthorities()
        );

        String email = authentication.getName();

        return jobService.getEmployerJobs(email);
    }


    // ==========================================
    // GET EMPLOYER JOB COUNT - EMPLOYER ONLY
    // ==========================================

    @GetMapping("/employer/count")
    @PreAuthorize("hasRole('EMPLOYER')")
    public long getEmployerJobCount(
            Authentication authentication) {

        String email = authentication.getName();

        return jobService.getEmployerJobCount(email);
    }


    // ==========================================
    // GET SINGLE JOB - PUBLIC
    // ==========================================

    @GetMapping("/{id}")
    public JobResponse getJobById(
            @PathVariable Long id) {

        return jobService.getJobById(id);
    }


    // ==========================================
    // UPDATE JOB - EMPLOYER ONLY
    // ==========================================

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('EMPLOYER')")
    public JobResponse updateJob(
            @PathVariable Long id,
            @RequestBody JobRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        return jobService.updateJob(
                id,
                request,
                email
        );
    }
// =========================================================
// ADVANCED JOB SEARCH
// =========================================================

    @GetMapping("/search")
    public List<JobResponse> searchJobs(

            @RequestParam(required = false)
            String keyword,

            @RequestParam(required = false)
            String location,

            @RequestParam(required = false)
            String jobType,

            @RequestParam(required = false)
            String experienceLevel,

            @RequestParam(required = false)
            Boolean remote,

            @RequestParam(required = false)
            Double minSalary,

            @RequestParam(required = false)
            Double maxSalary
    ) {

        return jobService.searchJobs(
                keyword,
                location,
                jobType,
                experienceLevel,
                remote,
                minSalary,
                maxSalary
        );
    }

    // ==========================================
    // DELETE JOB - EMPLOYER ONLY
    // ==========================================

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('EMPLOYER')")
    public String deleteJob(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();

        return jobService.deleteJob(
                id,
                email
        );
    }
        @PutMapping("/{id}/close")
        @PreAuthorize("hasRole('EMPLOYER')")
        public JobResponse closeJob(
                @PathVariable Long id,
                Authentication authentication) {

            return jobService.closeJob(
                    id,
                    authentication.getName()
            );
        }


        @PutMapping("/{id}/reopen")
        @PreAuthorize("hasRole('EMPLOYER')")
        public JobResponse reopenJob(
                @PathVariable Long id,
                Authentication authentication) {

            return jobService.reopenJob(
                    id,
                    authentication.getName()
            );
        }

}