package com.jobportal.backend.repository;

import com.jobportal.backend.entity.ApplicationStatus;
import com.jobportal.backend.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface JobApplicationRepository
        extends JpaRepository<JobApplication, Long> {

    // =====================================================
    // CHECK IF APPLICANT ALREADY APPLIED
    // =====================================================

    boolean existsByJobIdAndApplicantId(
            Long jobId,
            Long applicantId
    );


    // =====================================================
    // GET APPLICATIONS OF JOB SEEKER
    // =====================================================

    List<JobApplication> findByApplicantId(
            Long applicantId
    );


    // =====================================================
    // GET ALL APPLICATIONS FOR EMPLOYER
    // =====================================================

    List<JobApplication> findByJobCompanyEmployerId(
            Long employerId
    );


    // =====================================================
    // FIND SPECIFIC APPLICATION FOR EMPLOYER
    // =====================================================

    Optional<JobApplication> findByIdAndJobCompanyEmployerId(
            Long applicationId,
            Long employerId
    );


    // =====================================================
    // DELETE APPLICATIONS FOR A JOB
    // =====================================================

    void deleteByJobId(Long jobId);


    // =====================================================
    // TOTAL APPLICATIONS FOR EMPLOYER
    // =====================================================

    @Query("""
        SELECT COUNT(a)
        FROM JobApplication a
        WHERE a.job.company.employer.id = :employerId
    """)
    long countApplicationsByEmployer(
            @Param("employerId") Long employerId
    );


    // =====================================================
    // APPLICATIONS BY STATUS FOR EMPLOYER
    // =====================================================

    long countByJobCompanyEmployerIdAndStatus(
            Long employerId,
            ApplicationStatus status
    );
}