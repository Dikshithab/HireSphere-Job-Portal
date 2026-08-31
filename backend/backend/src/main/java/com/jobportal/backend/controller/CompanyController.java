package com.jobportal.backend.controller;

import com.jobportal.backend.dto.CompanyRequest;
import com.jobportal.backend.dto.CompanyResponse;
import com.jobportal.backend.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;


    // =====================================================
    // CREATE COMPANY
    // EMPLOYER ONLY
    // =====================================================

    @PostMapping
    @PreAuthorize("hasRole('EMPLOYER')")
    public CompanyResponse createCompany(
            @RequestBody CompanyRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        return companyService.createCompany(
                request,
                email
        );
    }


    // =====================================================
    // GET ALL COMPANIES
    // PUBLIC
    // =====================================================

    @GetMapping
    public List<CompanyResponse> getAllCompanies() {

        return companyService.getAllCompanies();
    }


    // =====================================================
    // GET MY COMPANY
    // EMPLOYER ONLY
    // =====================================================

    @GetMapping("/my")
    @PreAuthorize("hasRole('EMPLOYER')")
    public CompanyResponse getMyCompany(
            Authentication authentication) {

        String email = authentication.getName();

        return companyService.getMyCompany(email);
    }


    // =====================================================
    // UPDATE MY COMPANY
    // EMPLOYER ONLY
    // =====================================================

    @PutMapping("/my")
    @PreAuthorize("hasRole('EMPLOYER')")
    public CompanyResponse updateCompany(
            @RequestBody CompanyRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        return companyService.updateCompany(
                request,
                email
        );
    }


    // =====================================================
    // DELETE MY COMPANY
    // EMPLOYER ONLY
    // =====================================================

    @DeleteMapping
    @PreAuthorize("hasRole('EMPLOYER')")
    public String deleteCompany(
            Authentication authentication) {

        String email = authentication.getName();

        return companyService.deleteCompany(email);
    }
}