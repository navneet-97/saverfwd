package com.saverfwd.backend.common.mapper;

import com.saverfwd.backend.auth.response.AuthResponse;
import com.saverfwd.backend.auth.response.TokenResponse;
import com.saverfwd.backend.common.response.ApiResponse;
import com.saverfwd.backend.common.response.ErrorResponse;
import com.saverfwd.backend.common.response.PageResponse;
import com.saverfwd.backend.user.dto.UserResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;

import java.time.LocalDateTime;

public final class Mapper {

    private Mapper() {}

    public static AuthResponse toAuthResponse(String msg, UserResponse userResponse, TokenResponse tokenResponse) {
        return AuthResponse.builder()
                .success(true)
                .message(msg)
                .data(userResponse)
                .tokens(tokenResponse)
                .build();
    }

    public static TokenResponse toTokenResponse(String accessToken, String refreshToken) {
        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    public static  <T> ApiResponse<T> toApiResponse(String msg, T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(msg)
                .data(data)
                .build();
    }

    public static <T> ErrorResponse<T> toErrorResponse(String msg, T error, HttpServletRequest req) {
        return ErrorResponse.<T>builder()
                .success(false)
                .message(msg)
                .path(req.getRequestURI())
                .timestamp(LocalDateTime.now())
                .error(error)
                .build();
    }

    public static <T>PageResponse<T> toPageResponse(Page<T> page) {
        return PageResponse.<T>builder()
                .content(page.getContent())
                .page(page.getNumber())
                .size(page.getSize())
                .totalPages(page.getTotalPages())
                .totalElements(page.getTotalElements())
                .first(page.isFirst())
                .last(page.isLast())
                .build();
    }
}
