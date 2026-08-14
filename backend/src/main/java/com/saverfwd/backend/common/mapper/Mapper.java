package com.saverfwd.backend.common.mapper;

import com.saverfwd.backend.auth.response.AuthResponse;
import com.saverfwd.backend.auth.response.TokenResponse;
import com.saverfwd.backend.common.response.ApiResponse;
import com.saverfwd.backend.user.dto.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class Mapper {

    public AuthResponse toAuthResponse(String msg, UserResponse userResponse, TokenResponse tokenResponse) {
        return AuthResponse.builder()
                .success(true)
                .message(msg)
                .data(userResponse)
                .tokens(tokenResponse)
                .build();
    }

    public TokenResponse toTokenResponse(String accessToken, String refreshToken) {
        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    public <T> ApiResponse<T> toApiResponse(String msg, T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(msg)
                .data(data)
                .build();
    }
}
