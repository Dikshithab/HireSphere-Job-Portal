package com.jobportal.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "resume_experience")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResumeExperience {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String jobTitle;

    private String company;

    private String location;

    private String startDate;

    private String endDate;

    private Boolean currentlyWorking;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    private Resume resume;
}
