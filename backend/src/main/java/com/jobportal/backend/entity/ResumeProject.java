package com.jobportal.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "resume_projects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResumeProject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String projectName;

    private String technologies;

    private String projectUrl;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    private Resume resume;
}
