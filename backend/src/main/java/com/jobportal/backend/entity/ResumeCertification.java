package com.jobportal.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "resume_certifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResumeCertification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String issuingOrganization;

    private String issueDate;

    private String credentialId;

    private String credentialUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    private Resume resume;
}
