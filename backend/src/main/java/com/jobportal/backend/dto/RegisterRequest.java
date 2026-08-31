package com.jobportal.backend.dto;

import com.jobportal.backend.entity.Role;
import lombok.Data;

@Data
public class RegisterRequest {

    private String fullName;
    private String email;
    private String password;
    private String phone;
    private Role role;
}