package com.jobportal.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmployerDashboardResponse {

    private long totalJobs;

    private long totalApplications;

    private long pendingApplications;

    private long shortlistedApplications;

    private long rejectedApplications;

    private long hiredApplications;
}