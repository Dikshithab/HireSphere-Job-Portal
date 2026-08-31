package com.jobportal.backend.repository;

import com.jobportal.backend.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Long> {

    Optional<Company> findByEmployerId(Long employerId);

    Optional<Company> findByEmployerEmail(String email);

    boolean existsByEmployerId(Long employerId);
}