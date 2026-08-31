package com.jobportal.backend.repository;
import com.jobportal.backend.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ResumeRepository
        extends JpaRepository<Resume, Long> {


    List<Resume> findByUserId(Long userId);

    List<Resume> findByUserEmail(String email);

    Optional<Resume> findTopByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<Resume> findTopByUserIdOrderByUploadedAtDesc(
            Long userId
    );
}