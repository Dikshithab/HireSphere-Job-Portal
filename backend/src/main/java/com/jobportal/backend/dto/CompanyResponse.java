package com.jobportal.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CompanyResponse {

    private Long id;
    private String name;
    private String description;
    private String website;
    private String location;
    private String logoUrl;
    private String employerName;
}