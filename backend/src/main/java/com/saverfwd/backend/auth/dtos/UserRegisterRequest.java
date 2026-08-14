package com.saverfwd.backend.auth.dtos;

import com.saverfwd.backend.common.constant.RegexConstants;
import jakarta.validation.constraints.*;
import lombok.Builder;

@Builder
public record UserRegisterRequest(

        @NotBlank(message = "Name is required")
        @Size(min = 3, message = "Too short name, enter your full name")
        String fullName,

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid Email format")
        String email,

        @NotBlank(message = "Password is required")
        @Pattern(
                regexp = RegexConstants.PASSWORD,
                message = "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character"
        )
        String password,

        @NotBlank(message = "Phone number is required")
        @Pattern(
                regexp = RegexConstants.PHONE_NUMBER,
                message = "Phone number must be a valid 10-digit Indian mobile number"
        )
        String phoneNumber
) {
}
