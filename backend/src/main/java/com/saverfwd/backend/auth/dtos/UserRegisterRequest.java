package com.saverfwd.backend.auth.dtos;

import com.saverfwd.backend.common.constant.RegexConstants;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Builder;

@Builder
public record UserRegisterRequest(

        @NotBlank(message = "Name is required")
        @Min(value = 3, message = "Too short name, enter your full name")
        String fullName,

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid Email format")
        String email,

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
