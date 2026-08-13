package com.saverfwd.backend.auth.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Builder;

@Builder
public record UserLoginRequest(

        @NotBlank(message = "Email/Phone No. is required")
        String username,

        @Pattern(regexp = "", message = "")
        String password
) {
}
