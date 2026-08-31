package com.jobportal.backend.repository;

import com.jobportal.backend.entity.ResumeCertification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResumeCertificationRepository
        extends JpaRepository<ResumeCertification, Long> {

    List<ResumeCertification> findByResumeId(Long resumeId);

    void deleteByResumeId(Long resumeId);
}
