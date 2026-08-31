package com.jobportal.backend.service;

import com.jobportal.backend.entity.Resume;
import com.jobportal.backend.entity.User;
import com.jobportal.backend.repository.ResumeRepository;
import com.jobportal.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final ResumeParserService resumeParserService;

    // =====================================================
    // UPLOAD RESUME
    // =====================================================

    public Resume uploadResume(
            MultipartFile file,
            Long userId) throws IOException {

        // -------------------------------------------------
        // Find user
        // -------------------------------------------------

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        // -------------------------------------------------
        // Validate file
        // -------------------------------------------------

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(
                    "Please upload a resume file"
            );
        }

        String fileName = file.getOriginalFilename();

        if (fileName == null || fileName.trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "Invalid file name"
            );
        }

        String lowerCaseFileName =
                fileName.toLowerCase();

        if (!lowerCaseFileName.endsWith(".pdf")
                && !lowerCaseFileName.endsWith(".docx")) {

            throw new IllegalArgumentException(
                    "Only PDF and DOCX files are supported"
            );
        }

        // -------------------------------------------------
        // Extract text
        // -------------------------------------------------

        String extractedText =
                resumeParserService.extractText(file);

        if (extractedText == null
                || extractedText.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Could not extract text from the resume"
            );
        }

        // -------------------------------------------------
        // Create Resume
        // -------------------------------------------------

        Resume resume = new Resume();

        /*
         * New unified Resume model
         */

        resume.setTitle(
                removeExtension(fileName)
        );

        resume.setFileName(fileName);

        resume.setExtractedText(
                extractedText
        );

        resume.setSource("UPLOAD");

        resume.setUser(user);

        // -------------------------------------------------
        // Save
        // -------------------------------------------------

        return resumeRepository.save(resume);
    }

    // =====================================================
    // GET USER RESUMES
    // =====================================================

    public List<Resume> getUserResumes(Long userId) {

        return resumeRepository.findByUserId(userId);
    }

    // =====================================================
    // GET LATEST RESUME
    // =====================================================

    public Resume getLatestResume(Long userId) {

        return resumeRepository
                .findTopByUserIdOrderByCreatedAtDesc(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "No resume found for this user"
                        )
                );
    }

    // =====================================================
    // REMOVE FILE EXTENSION
    // =====================================================

    private String removeExtension(String fileName) {

        int lastDot =
                fileName.lastIndexOf('.');

        if (lastDot > 0) {
            return fileName.substring(
                    0,
                    lastDot
            );
        }

        return fileName;
    }
}