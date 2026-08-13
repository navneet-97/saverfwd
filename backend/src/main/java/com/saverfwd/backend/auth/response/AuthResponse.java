package com.saverfwd.backend.auth.response;

import lombok.Builder;

@Builder
public record AuthResponse(
        boolean success,
        String message,
        TokenResponse token
) {
}
