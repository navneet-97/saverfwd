package com.saverfwd.backend.auth.dtos;

import com.saverfwd.backend.common.constant.RegexConstants;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record ResetPasswordRequest(
        @NotBlank(message = "Password is required")
        @Pattern(
                regexp = RegexConstants.PASSWORD,
                message = "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character"
        )
        String password,

        @NotBlank(message = "Otp is required")
        String otp
) {
}
