package com.jobportal.backend.repository;

import com.jobportal.backend.entity.ResumeExperience;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResumeExperienceRepository
        extends JpaRepository<ResumeExperience, Long> {

    List<ResumeExperience> findByResumeId(Long resumeId);

    void deleteByResumeId(Long resumeId);
}