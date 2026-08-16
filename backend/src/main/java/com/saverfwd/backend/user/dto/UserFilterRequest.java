package com.saverfwd.backend.user.dto;

import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

public record UserFilterRequest(
        Long id,
        String fullName,
        String email,
        String phoneNumber,
        String role,
        String accountStatus,

        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
        LocalDateTime createdFrom,

        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
        LocalDateTime createdTo,

        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
        LocalDateTime updatedFrom,

        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
        LocalDateTime updatedTo
) {
}
