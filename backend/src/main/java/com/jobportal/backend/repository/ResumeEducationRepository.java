package com.jobportal.backend.repository;
import com.jobportal.backend.entity.ResumeEducation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResumeEducationRepository
        extends JpaRepository<ResumeEducation, Long> {

    List<ResumeEducation> findByResumeId(Long resumeId);

    void deleteByResumeId(Long resumeId);
}