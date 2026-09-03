package com.saverfwd.backend.user.dto;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record UserResponse(
        Long id,
        String fullName,
        String email,
        String phoneNumber,
        String role,
        String accountStatus,
        LocalDateTime createdAt
) {
}
