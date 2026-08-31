package com.jobportal.backend.service;

import com.jobportal.backend.dto.JobRequest;
import com.jobportal.backend.dto.JobResponse;
import com.jobportal.backend.entity.Company;
import com.jobportal.backend.entity.Job;
import com.jobportal.backend.entity.JobStatus;
import com.jobportal.backend.entity.User;
import com.jobportal.backend.repository.CompanyRepository;
import com.jobportal.backend.repository.JobApplicationRepository;
import com.jobportal.backend.repository.JobRepository;
import com.jobportal.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.jobportal.backend.entity.JobStatus;
import java.util.Comparator;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final JobApplicationRepository applicationRepository;
    private boolean contains(
            String value,
            String search) {

        return value != null &&
                value.toLowerCase()
                        .contains(search);
    }

    // =========================================================
    // CREATE JOB
    // =========================================================

    public JobResponse createJob(
            JobRequest request,
            String email) {

        validateJobRequest(request);

        if (request.getCompanyId() == null) {
            throw new RuntimeException("Company is required.");
        }

        Company company = companyRepository
                .findById(request.getCompanyId())
                .orElseThrow(() ->
                        new RuntimeException("Company not found!")
                );

        // Check company ownership
        if (company.getEmployer() == null ||
                !company.getEmployer()
                        .getEmail()
                        .equalsIgnoreCase(email)) {

            throw new RuntimeException(
                    "You are not authorized to create a job for this company!"
            );
        }

        Job job = new Job();

        job.setTitle(request.getTitle().trim());
        job.setDescription(request.getDescription().trim());
        job.setRequirements(
                request.getRequirements() != null
                        ? request.getRequirements().trim()
                        : null
        );

        job.setSkills(
                request.getSkills() != null
                        ? request.getSkills().trim()
                        : null
        );

        job.setLocation(request.getLocation().trim());
        job.setJobType(request.getJobType().trim());
        job.setSalary(request.getSalary());
        job.setExperienceLevel(
                request.getExperienceLevel().trim()
        );

        job.setVacancies(
                request.getVacancies() != null
                        ? request.getVacancies()
                        : 1
        );

        job.setApplicationDeadline(
                request.getApplicationDeadline()
        );

        job.setRemote(
                request.getRemote() != null
                        ? request.getRemote()
                        : false
        );

        job.setStatus(JobStatus.ACTIVE);
        job.setCompany(company);

        Job savedJob = jobRepository.save(job);

        return toResponse(savedJob);
    }


    // =========================================================
    // GET ALL JOBS
    // =========================================================

    public List<JobResponse> getAllJobs() {

        return jobRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }


    // =========================================================
    // GET JOB BY ID
    // =========================================================

    public JobResponse getJobById(Long id) {

        Job job = jobRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Job not found!")
                );

        return toResponse(job);
    }


    // =========================================================
    // GET EMPLOYER JOBS
    // =========================================================

    public List<JobResponse> getEmployerJobs(
            String email) {

        User employer = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found!")
                );

        return jobRepository
                .findByCompanyEmployerId(employer.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }


    // =========================================================
    // GET EMPLOYER JOB COUNT
    // =========================================================

    public long getEmployerJobCount(
            String email) {

        User employer = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found!")
                );

        return jobRepository.countByCompanyEmployerId(
                employer.getId()
        );
    }


    // =========================================================
    // UPDATE JOB
    // =========================================================

    public JobResponse updateJob(
            Long jobId,
            JobRequest request,
            String email) {

        validateJobRequest(request);

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException("Job not found!")
                );

        // Check ownership
        if (job.getCompany() == null ||
                job.getCompany().getEmployer() == null ||
                !job.getCompany()
                        .getEmployer()
                        .getEmail()
                        .equalsIgnoreCase(email)) {

            throw new RuntimeException(
                    "You are not authorized to update this job!"
            );
        }

        job.setTitle(request.getTitle().trim());

        job.setDescription(
                request.getDescription().trim()
        );

        job.setRequirements(
                request.getRequirements() != null
                        ? request.getRequirements().trim()
                        : null
        );

        job.setSkills(
                request.getSkills() != null
                        ? request.getSkills().trim()
                        : null
        );

        job.setLocation(
                request.getLocation().trim()
        );

        job.setJobType(
                request.getJobType().trim()
        );

        job.setSalary(
                request.getSalary()
        );

        job.setExperienceLevel(
                request.getExperienceLevel().trim()
        );

        job.setVacancies(
                request.getVacancies() != null
                        ? request.getVacancies()
                        : 1
        );

        job.setApplicationDeadline(
                request.getApplicationDeadline()
        );

        job.setRemote(
                request.getRemote() != null
                        ? request.getRemote()
                        : false
        );

        Job updatedJob = jobRepository.save(job);

        return toResponse(updatedJob);
    }


    // =========================================================
    // CLOSE JOB
    // =========================================================

    public JobResponse closeJob(
            Long jobId,
            String email) {

        Job job = getOwnedJob(jobId, email);

        job.setStatus(JobStatus.CLOSED);

        Job savedJob = jobRepository.save(job);

        return toResponse(savedJob);
    }


    // =========================================================
    // REOPEN JOB
    // =========================================================

    public JobResponse reopenJob(
            Long jobId,
            String email) {

        Job job = getOwnedJob(jobId, email);

        if (job.getApplicationDeadline() != null &&
                job.getApplicationDeadline()
                        .isBefore(LocalDate.now())) {

            throw new RuntimeException(
                    "Cannot reopen a job with an expired application deadline."
            );
        }

        job.setStatus(JobStatus.ACTIVE);

        Job savedJob = jobRepository.save(job);

        return toResponse(savedJob);
    }


    // =========================================================
    // DELETE JOB
    // =========================================================

    @Transactional
    public String deleteJob(
            Long jobId,
            String email) {

        Job job = getOwnedJob(jobId, email);

        // Delete applications first
        applicationRepository.deleteByJobId(jobId);

        // Delete job
        jobRepository.delete(job);

        return "Job deleted successfully!";
    }


    // =========================================================
    // GET OWNED JOB
    // =========================================================

    private Job getOwnedJob(
            Long jobId,
            String email) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException("Job not found!")
                );

        if (job.getCompany() == null ||
                job.getCompany().getEmployer() == null ||
                !job.getCompany()
                        .getEmployer()
                        .getEmail()
                        .equalsIgnoreCase(email)) {

            throw new RuntimeException(
                    "You are not authorized to modify this job!"
            );
        }

        return job;
    }


    // =========================================================
    // VALIDATE JOB REQUEST
    // =========================================================

    private void validateJobRequest(
            JobRequest request) {

        if (request == null) {
            throw new RuntimeException(
                    "Job data is required."
            );
        }

        if (request.getTitle() == null ||
                request.getTitle().trim().isEmpty()) {

            throw new RuntimeException(
                    "Job title is required."
            );
        }

        if (request.getDescription() == null ||
                request.getDescription().trim().isEmpty()) {

            throw new RuntimeException(
                    "Job description is required."
            );
        }

        if (request.getLocation() == null ||
                request.getLocation().trim().isEmpty()) {

            throw new RuntimeException(
                    "Job location is required."
            );
        }

        if (request.getJobType() == null ||
                request.getJobType().trim().isEmpty()) {

            throw new RuntimeException(
                    "Job type is required."
            );
        }

        if (request.getExperienceLevel() == null ||
                request.getExperienceLevel().trim().isEmpty()) {

            throw new RuntimeException(
                    "Experience level is required."
            );
        }

        if (request.getSalary() != null &&
                request.getSalary() < 0) {

            throw new RuntimeException(
                    "Salary cannot be negative."
            );
        }

        if (request.getVacancies() != null &&
                request.getVacancies() <= 0) {

            throw new RuntimeException(
                    "Vacancies must be greater than zero."
            );
        }

        if (request.getApplicationDeadline() != null &&
                request.getApplicationDeadline()
                        .isBefore(LocalDate.now())) {

            throw new RuntimeException(
                    "Application deadline cannot be in the past."
            );
        }
    }


    // =========================================================
    // CONVERT ENTITY → RESPONSE
    // =========================================================

    private JobResponse toResponse(
            Job job) {

        String companyName = "Unknown Company";
        Long companyId = null;

        if (job.getCompany() != null) {

            companyId = job.getCompany().getId();

            if (job.getCompany().getName() != null) {
                companyName =
                        job.getCompany().getName();
            }
        }

        return new JobResponse(
                job.getId(),
                job.getTitle(),
                job.getDescription(),
                job.getRequirements(),
                job.getSkills(),
                job.getLocation(),
                job.getJobType(),
                job.getSalary(),
                job.getExperienceLevel(),
                job.getVacancies(),
                job.getApplicationDeadline(),
                job.getRemote(),
                job.getStatus() != null
                        ? job.getStatus().name()
                        : "ACTIVE",
                job.getCreatedAt(),
                companyId,
                companyName
        );
    }
    // =========================================================
// ADVANCED JOB SEARCH
// =========================================================

    public List<JobResponse> searchJobs(
            String keyword,
            String location,
            String jobType,
            String experienceLevel,
            Boolean remote,
            Double minSalary,
            Double maxSalary
    ) {

        List<Job> jobs = jobRepository.findByStatusOrderByCreatedAtDesc(
                JobStatus.ACTIVE
        );

        return jobs.stream()

                // Keyword filter
                .filter(job -> {

                    if (keyword == null ||
                            keyword.trim().isEmpty()) {
                        return true;
                    }

                    String search = keyword
                            .trim()
                            .toLowerCase();

                    return contains(job.getTitle(), search)
                            || contains(job.getDescription(), search)
                            || contains(job.getRequirements(), search)
                            || contains(job.getSkills(), search);
                })

                // Location filter
                .filter(job -> {

                    if (location == null ||
                            location.trim().isEmpty()) {
                        return true;
                    }

                    return contains(
                            job.getLocation(),
                            location.trim().toLowerCase()
                    );
                })

                // Job type filter
                .filter(job -> {

                    if (jobType == null ||
                            jobType.trim().isEmpty()) {
                        return true;
                    }

                    return job.getJobType() != null &&
                            job.getJobType()
                                    .equalsIgnoreCase(
                                            jobType.trim()
                                    );
                })

                // Experience filter
                .filter(job -> {

                    if (experienceLevel == null ||
                            experienceLevel.trim().isEmpty()) {
                        return true;
                    }

                    return job.getExperienceLevel() != null &&
                            job.getExperienceLevel()
                                    .equalsIgnoreCase(
                                            experienceLevel.trim()
                                    );
                })

                // Remote filter
                .filter(job -> {

                    if (remote == null) {
                        return true;
                    }

                    return job.getRemote() != null &&
                            job.getRemote().equals(remote);
                })

                // Minimum salary
                .filter(job -> {

                    if (minSalary == null) {
                        return true;
                    }

                    return job.getSalary() != null &&
                            job.getSalary() >= minSalary;
                })

                // Maximum salary
                .filter(job -> {

                    if (maxSalary == null) {
                        return true;
                    }

                    return job.getSalary() != null &&
                            job.getSalary() <= maxSalary;
                })

                .map(this::toResponse)

                .toList();
    }
}