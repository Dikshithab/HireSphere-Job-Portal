package com.jobportal.backend.repository;

import com.jobportal.backend.entity.ResumeSkill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResumeSkillRepository
        extends JpaRepository<ResumeSkill, Long> {

    List<ResumeSkill> findByResumeId(Long resumeId);

    void deleteByResumeId(Long resumeId);
}
