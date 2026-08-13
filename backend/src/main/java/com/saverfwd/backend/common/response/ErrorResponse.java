package com.saverfwd.backend.common.response;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public class ErrorResponse<T> {
    private LocalDateTime timestamp;
    private int status;
    private T error;
    private String path;
}
