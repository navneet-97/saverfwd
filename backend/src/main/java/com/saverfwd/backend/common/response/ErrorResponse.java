package com.saverfwd.backend.common.response;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record ErrorResponse<T>(
        LocalDateTime timestamp,
        int status,
        T error,
        String path

) {
}
