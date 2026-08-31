
        package com.jobportal.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "resumes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =========================
    // RESUME BASIC INFO
    // =========================

    @Column(nullable = false)
    private String title;

    private String fullName;

    private String email;

    private String phone;

    private String location;

    private String linkedin;

    private String github;

    private String portfolio;

    // =========================
    // PROFESSIONAL SUMMARY
    // =========================

    @Column(columnDefinition = "TEXT")
    private String summary;

    // =========================
    // RESUME CONTENT
    // =========================

    /*
     * For uploaded PDF/DOCX resumes:
     * stores the extracted text.
     *
     * For resumes created using Resume Builder:
     * stores generated searchable resume text.
     */
    @Column(columnDefinition = "LONGTEXT")
    private String extractedText;

    // =========================
    // RESUME SOURCE
    // =========================

    /*
     * BUILDER = created inside our application
     * UPLOAD  = uploaded PDF/DOCX
     */
    @Column(nullable = false)
    private String source;

    /*
     * Original uploaded file name.
     * Will be null for resumes created using Builder.
     */
    private String fileName;

    // =========================
    // TIMESTAMPS
    // =========================

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // =========================
    // USER
    // =========================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // =========================
    // CREATE
    // =========================

    @PrePersist
    protected void onCreate() {

        LocalDateTime now = LocalDateTime.now();

        this.createdAt = now;
        this.updatedAt = now;

        if (this.source == null) {
            this.source = "BUILDER";
        }
    }

    // =========================
    // UPDATE
    // =========================

    @PreUpdate
    protected void onUpdate() {

        this.updatedAt = LocalDateTime.now();
    }

    // =========================
    // BACKWARD COMPATIBILITY
    // =========================

    /*
     * Existing code currently uses uploadedAt.
     *
     * Keep this method temporarily so existing
     * services can still compile.
     */
    @Transient
    public LocalDateTime getUploadedAt() {
        return createdAt;
    }
}