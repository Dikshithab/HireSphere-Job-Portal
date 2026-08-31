package com.jobportal.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompanyRequest {

    private String name;

    private String description;

    private String website;

    private String location;

    private String logoUrl;
}