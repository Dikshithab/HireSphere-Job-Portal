package com.jobportal.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "companies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 2000)
    private String description;

    private String website;

    private String location;

    private String logoUrl;

    private LocalDateTime createdAt;

    @OneToOne
    @JoinColumn(name = "employer_id", nullable = false, unique = true)
    private User employer;
}