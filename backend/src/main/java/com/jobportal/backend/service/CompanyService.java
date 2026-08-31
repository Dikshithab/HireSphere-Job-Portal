package com.jobportal.backend.service;

import com.jobportal.backend.dto.CompanyRequest;
import com.jobportal.backend.dto.CompanyResponse;
import com.jobportal.backend.entity.Company;
import com.jobportal.backend.entity.User;
import com.jobportal.backend.repository.CompanyRepository;
import com.jobportal.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;


    // =========================================================
    // CREATE COMPANY
    // =========================================================

    public CompanyResponse createCompany(
            CompanyRequest request,
            String email) {

        User employer = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Employer not found!"
                        )
                );

        if (companyRepository.existsByEmployerId(
                employer.getId())) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Employer already has a company!"
            );
        }

        Company company = new Company();

        company.setName(request.getName());
        company.setDescription(request.getDescription());
        company.setWebsite(request.getWebsite());
        company.setLocation(request.getLocation());
        company.setLogoUrl(request.getLogoUrl());
        company.setCreatedAt(LocalDateTime.now());
        company.setEmployer(employer);

        Company savedCompany =
                companyRepository.save(company);

        return toResponse(savedCompany);
    }


    // =========================================================
    // GET ALL COMPANIES
    // =========================================================

    public List<CompanyResponse> getAllCompanies() {

        return companyRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }


    // =========================================================
    // GET MY COMPANY
    // =========================================================

    public CompanyResponse getMyCompany(
            String email) {

        User employer = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found!"
                        )
                );

        Company company =
                companyRepository
                        .findByEmployerId(employer.getId())
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Company not found."
                                )
                        );

        return toResponse(company);
    }


    // =========================================================
    // UPDATE COMPANY
    // =========================================================

    public CompanyResponse updateCompany(
            CompanyRequest request,
            String email) {

        Company company =
                companyRepository
                        .findByEmployerEmail(email)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Company not found!"
                                )
                        );

        company.setName(request.getName());
        company.setDescription(request.getDescription());
        company.setWebsite(request.getWebsite());
        company.setLocation(request.getLocation());
        company.setLogoUrl(request.getLogoUrl());

        Company updatedCompany =
                companyRepository.save(company);

        return toResponse(updatedCompany);
    }


    // =========================================================
    // DELETE COMPANY
    // =========================================================

    public String deleteCompany(
            String email) {

        Company company =
                companyRepository
                        .findByEmployerEmail(email)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Company not found!"
                                )
                        );

        companyRepository.delete(company);

        return "Company deleted successfully!";
    }


    // =========================================================
    // CONVERT ENTITY → DTO
    // =========================================================

    private CompanyResponse toResponse(
            Company company) {

        return new CompanyResponse(
                company.getId(),
                company.getName(),
                company.getDescription(),
                company.getWebsite(),
                company.getLocation(),
                company.getLogoUrl(),
                company.getEmployer().getFullName()
        );
    }
}