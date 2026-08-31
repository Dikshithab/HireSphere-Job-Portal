package com.jobportal.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "resume_skills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResumeSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String skillName;

    private String category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    private Resume resume;
}
