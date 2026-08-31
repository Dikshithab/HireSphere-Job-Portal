package com.jobportal.backend.repository;

import com.jobportal.backend.entity.Job;
import com.jobportal.backend.entity.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {

    // Employer's jobs
    List<Job> findByCompanyEmployerId(Long employerId);

    // Employer job count
    long countByCompanyEmployerId(Long employerId);

    // Active jobs
    List<Job> findByStatus(JobStatus status);

    // Active jobs sorted by newest
    List<Job> findByStatusOrderByCreatedAtDesc(JobStatus status);

    // Search jobs by title
    List<Job> findByTitleContainingIgnoreCase(String title);

    // Search by location
    List<Job> findByLocationContainingIgnoreCase(String location);

    // Search title OR location
    List<Job> findByTitleContainingIgnoreCaseOrLocationContainingIgnoreCase(
            String title,
            String location
    );

    // Jobs by type
    List<Job> findByJobTypeIgnoreCase(String jobType);

    // Jobs by experience
    List<Job> findByExperienceLevelIgnoreCase(
            String experienceLevel
    );

    // Remote jobs
    List<Job> findByRemoteTrue();

    // Active remote jobs
    List<Job> findByStatusAndRemoteTrue(
            JobStatus status
    );
}