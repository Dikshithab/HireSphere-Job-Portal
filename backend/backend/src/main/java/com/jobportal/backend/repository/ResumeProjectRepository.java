package com.jobportal.backend.repository;

import com.jobportal.backend.entity.ResumeProject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResumeProjectRepository
        extends JpaRepository<ResumeProject, Long> {

    List<ResumeProject> findByResumeId(Long resumeId);

    void deleteByResumeId(Long resumeId);
}