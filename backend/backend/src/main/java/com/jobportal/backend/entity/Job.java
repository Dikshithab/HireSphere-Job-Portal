package com.jobportal.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String requirements;

    @Column(columnDefinition = "TEXT")
    private String skills;

    @Column(nullable = false, length = 100)
    private String location;

    @Column(nullable = false, length = 50)
    private String jobType;

    private Double salary;

    @Column(nullable = false, length = 50)
    private String experienceLevel;

    private Integer vacancies;

    private LocalDate applicationDeadline;

    private Boolean remote;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private JobStatus status;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();

        if (status == null) {
            status = JobStatus.ACTIVE;
        }

        if (remote == null) {
            remote = false;
        }

        if (vacancies == null) {
            vacancies = 1;
        }
    }
}