package com.saverfwd.backend.auth.dtos;

import com.saverfwd.backend.auth.validation.EmailOrPhone;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
public record UserLoginRequest(

        @NotBlank(message = "Email or Phone Number is required")
        @EmailOrPhone
        String username,

        @NotBlank(message = "Password is required")
        String password
) {
}
