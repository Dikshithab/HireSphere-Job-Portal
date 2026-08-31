package com.jobportal.backend.service;

import com.jobportal.backend.dto.ApplicationRequest;
import com.jobportal.backend.dto.ApplicationResponse;
import com.jobportal.backend.entity.ApplicationStatus;
import com.jobportal.backend.entity.Job;
import com.jobportal.backend.entity.JobApplication;
import com.jobportal.backend.entity.User;
import com.jobportal.backend.repository.JobApplicationRepository;
import com.jobportal.backend.repository.JobRepository;
import com.jobportal.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.jobportal.backend.dto.EmployerDashboardResponse;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobApplicationService {

    private final JobApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;


    // =====================================================
    // APPLY FOR JOB
    // =====================================================

    public ApplicationResponse applyForJob(
            ApplicationRequest request,
            String email) {

        User applicant = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found!")
                );

        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() ->
                        new RuntimeException("Job not found!")
                );

        // Check if applicant already applied
        if (applicationRepository.existsByJobIdAndApplicantId(
                job.getId(),
                applicant.getId())) {

            throw new RuntimeException(
                    "You have already applied for this job!"
            );
        }

        JobApplication application = new JobApplication();

        application.setJob(job);
        application.setApplicant(applicant);
        application.setStatus(ApplicationStatus.PENDING);
        application.setAppliedAt(LocalDateTime.now());

        JobApplication savedApplication =
                applicationRepository.save(application);

        return toResponse(savedApplication);
    }


    // =====================================================
    // GET MY APPLICATIONS - JOB SEEKER
    // =====================================================

    public List<ApplicationResponse> getMyApplications(
            String email) {

        User applicant = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found!")
                );

        return applicationRepository
                .findByApplicantId(applicant.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }


    // =====================================================
    // GET EMPLOYER APPLICATIONS
    // =====================================================

    public List<ApplicationResponse> getEmployerApplications(
            String email) {

        User employer = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found!")
                );

        return applicationRepository
                .findByJobCompanyEmployerId(employer.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }


    // =====================================================
    // UPDATE APPLICATION STATUS
    // =====================================================

    public ApplicationResponse updateStatus(
            Long applicationId,
            ApplicationStatus status,
            String email) {

        User employer = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found!")
                );

        JobApplication application =
                applicationRepository
                        .findByIdAndJobCompanyEmployerId(
                                applicationId,
                                employer.getId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found or not authorized!"
                                )
                        );

        application.setStatus(status);

        JobApplication updatedApplication =
                applicationRepository.save(application);

        return toResponse(updatedApplication);
    }


    // =====================================================
    // GET EMPLOYER APPLICATION COUNT
    // =====================================================

    public long getEmployerApplicationCount(
            String email) {

        User employer = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found!")
                );

        return applicationRepository
                .countApplicationsByEmployer(
                        employer.getId()
                );
    }


    // =====================================================
    // CONVERT ENTITY TO RESPONSE DTO
    // =====================================================

    private ApplicationResponse toResponse(
            JobApplication application) {

        return new ApplicationResponse(
                application.getId(),
                application.getJob().getId(),
                application.getJob().getTitle(),
                application.getJob().getCompany().getName(),
                application.getApplicant().getFullName(),
                application.getApplicant().getEmail(),
                application.getStatus(),
                application.getAppliedAt()
        );
    }
    // =====================================================
// GET EMPLOYER DASHBOARD STATISTICS
// =====================================================

    public EmployerDashboardResponse getEmployerDashboard(
            String email) {

        User employer = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found!")
                );

        Long employerId = employer.getId();

        long totalJobs =
                jobRepository.countByCompanyEmployerId(
                        employerId
                );

        long totalApplications =
                applicationRepository.countApplicationsByEmployer(
                        employerId
                );

        long pendingApplications =
                applicationRepository
                        .countByJobCompanyEmployerIdAndStatus(
                                employerId,
                                ApplicationStatus.PENDING
                        );

        long shortlistedApplications =
                applicationRepository
                        .countByJobCompanyEmployerIdAndStatus(
                                employerId,
                                ApplicationStatus.SHORTLISTED
                        );

        long rejectedApplications =
                applicationRepository
                        .countByJobCompanyEmployerIdAndStatus(
                                employerId,
                                ApplicationStatus.REJECTED
                        );

        long hiredApplications =
                applicationRepository
                        .countByJobCompanyEmployerIdAndStatus(
                                employerId,
                                ApplicationStatus.HIRED
                        );

        return new EmployerDashboardResponse(
                totalJobs,
                totalApplications,
                pendingApplications,
                shortlistedApplications,
                rejectedApplications,
                hiredApplications
        );
    }
}