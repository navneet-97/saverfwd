package com.saverfwd.backend.auth.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Builder;

@Builder
public record UserRegisterRequest(

        @NotBlank(message = "Name is required")
        String fullName,

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid Email format")
        String email,

        @Pattern(regexp = "", message = "")
        String password,

        @NotBlank(message = "Phone No. is required")
        String phoneNumber
) {
}
