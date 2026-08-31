package com.jobportal.backend.controller;
import com.jobportal.backend.dto.ResumeBuilderRequest;
import com.jobportal.backend.dto.ResumeBuilderResponse;
import com.jobportal.backend.dto.ResumeDetailsResponse;
import com.jobportal.backend.entity.Resume;
import com.jobportal.backend.repository.ResumeCertificationRepository;
import com.jobportal.backend.repository.ResumeEducationRepository;
import com.jobportal.backend.repository.ResumeExperienceRepository;
import com.jobportal.backend.repository.ResumeProjectRepository;
import com.jobportal.backend.repository.ResumeRepository;
import com.jobportal.backend.repository.ResumeSkillRepository;
import com.jobportal.backend.service.ResumeBuilderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.jobportal.backend.entity.ResumeCertification;
import com.jobportal.backend.entity.ResumeEducation;
import com.jobportal.backend.entity.ResumeExperience;
import com.jobportal.backend.entity.ResumeProject;
import com.jobportal.backend.entity.ResumeSkill;
import java.util.List;

@RestController
@RequestMapping("/api/resume-builder")
@RequiredArgsConstructor
public class ResumeBuilderController {

    private final ResumeBuilderService resumeBuilderService;

    private final ResumeRepository resumeRepository;

    private final ResumeEducationRepository educationRepository;
    private final ResumeExperienceRepository experienceRepository;
    private final ResumeProjectRepository projectRepository;
    private final ResumeCertificationRepository certificationRepository;
    private final ResumeSkillRepository skillRepository;


    // =====================================================
    // CREATE RESUME
    // =====================================================

    @PostMapping
    public ResponseEntity<?> createResume(
            @RequestBody ResumeBuilderRequest request,
            Authentication authentication) {

        try {

            String email = authentication.getName();

            ResumeBuilderResponse response =
                    resumeBuilderService.createResume(
                            request,
                            email
                    );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // GET MY RESUMES
    // =====================================================

    @GetMapping
    public ResponseEntity<?> getMyResumes(
            Authentication authentication) {

        try {

            String email = authentication.getName();

            List<Resume> resumes =
                    resumeRepository.findByUserEmail(email);

            return ResponseEntity.ok(resumes);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // GET SINGLE RESUME
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getResume(
            @PathVariable Long id,
            Authentication authentication) {

        try {

            String email = authentication.getName();

            Resume resume =
                    resumeRepository.findById(id)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Resume not found!"
                                    )
                            );

            // Ownership check
            if (!resume.getUser()
                    .getEmail()
                    .equals(email)) {

                return ResponseEntity
                        .status(403)
                        .body(
                                "You are not authorized to access this resume!"
                        );
            }

            // Get all resume sections
            List<ResumeEducation> education =
                    educationRepository.findByResumeId(id);

            List<ResumeExperience> experience =
                    experienceRepository.findByResumeId(id);

            List<ResumeProject> projects =
                    projectRepository.findByResumeId(id);

            List<ResumeCertification> certifications =
                    certificationRepository.findByResumeId(id);

            List<ResumeSkill> skills =
                    skillRepository.findByResumeId(id);

            // Build complete response
            ResumeDetailsResponse response =
                    new ResumeDetailsResponse(
                            resume,
                            education,
                            experience,
                            projects,
                            certifications,
                            skills
                    );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // UPDATE RESUME
    // =====================================================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateResume(
            @PathVariable Long id,
            @RequestBody ResumeBuilderRequest request,
            Authentication authentication) {

        try {

            String email = authentication.getName();

            ResumeBuilderResponse response =
                    resumeBuilderService.updateResume(
                            id,
                            request,
                            email
                    );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // DELETE RESUME
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteResume(
            @PathVariable Long id,
            Authentication authentication) {

        try {

            String email = authentication.getName();

            resumeBuilderService.deleteResume(
                    id,
                    email
            );

            return ResponseEntity.ok(
                    "Resume deleted successfully!"
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}