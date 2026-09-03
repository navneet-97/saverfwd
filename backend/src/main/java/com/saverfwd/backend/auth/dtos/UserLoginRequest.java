package com.saverfwd.backend.auth.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
public record UserLoginRequest(

        @NotBlank(message = "Email is required")
        @Email(message = "Email is required")
        String email,

        @NotBlank(message = "Password is required")
        String password
) {
}
