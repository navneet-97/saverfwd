package com.saverfwd.backend.auth.response;

import com.saverfwd.backend.user.dto.UserResponse;
import lombok.Builder;

@Builder
public record AuthResponse(
        boolean success,
        String message,
        UserResponse data,
        TokenResponse tokens
) {
}
