package com.saverfwd.backend.auth.controller;

import com.saverfwd.backend.auth.dtos.RefreshTokenRequest;
import com.saverfwd.backend.auth.dtos.ResetPasswordRequest;
import com.saverfwd.backend.auth.dtos.UserLoginRequest;
import com.saverfwd.backend.auth.dtos.UserRegisterRequest;
import com.saverfwd.backend.auth.response.AuthResponse;
import com.saverfwd.backend.auth.service.AuthService;
import com.saverfwd.backend.common.exception.TooManyRequestsException;
import com.saverfwd.backend.common.response.ApiResponse;
import com.saverfwd.backend.common.service.RateLimitingService;
import com.saverfwd.backend.user.dto.UserResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Validated
@Slf4j
public class AuthController {

    private final AuthService authService;
    private final RateLimitingService rateLimitingService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody UserRegisterRequest request, HttpServletRequest httpServletRequest) {
        log.info("Received request to register user: {}", request);
        if (!rateLimitingService.allowRegisterRequest(request.email(), httpServletRequest)) {
            log.error("Too many registration requests for email: {}, ip: {}", request.email(), httpServletRequest.getRemoteAddr());
            throw new TooManyRequestsException("Too many registration requests");
        }
        return new ResponseEntity<>(authService.registerUser(request), HttpStatus.CREATED);
    }

    @PostMapping("/bulk")
    public ResponseEntity<List<UserResponse>> registerMany(@RequestBody List<@Valid UserRegisterRequest> requests) {
        log.info("Received request to register users: {}", requests);
        return new ResponseEntity<>(authService.registerMany(requests), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody UserLoginRequest request, HttpServletRequest httpServletRequest) {
        log.info("Received request to login user: {}", request);
        if (!rateLimitingService.allowLoginRequest(request.email(), httpServletRequest)) {
            log.error("Too many login requests for email: {}", request.email());
            throw new TooManyRequestsException("Too many login requests");
        }
        return new ResponseEntity<>(authService.loginUser(request), HttpStatus.OK);
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> me() {
        log.info("Received request to me");
        return new ResponseEntity<>(authService.getCurrentUser(), HttpStatus.OK);
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(@Valid @RequestBody RefreshTokenRequest request) {
        log.info("Received request to logout user: {}", request);
        return new ResponseEntity<>(authService.logoutCurrentSession(request.refreshToken()), HttpStatus.OK);
    }

    @PostMapping("/logout-all")
    public ResponseEntity<ApiResponse<Void>> logoutAll() {
        log.info("Received request to logout all users");
        return new ResponseEntity<>(authService.logoutAllSessions(), HttpStatus.OK);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshAccessToken(@Valid @RequestBody RefreshTokenRequest request) {
        log.info("Received request to refresh access token: {}", request);
        if (!rateLimitingService.allowRefreshRequest(request.refreshToken())) {
            log.error("Too many refresh requests for refresh token: {}", request.refreshToken());
            throw new TooManyRequestsException("Too many refresh requests");
        }
        return new ResponseEntity<>(authService.refreshAccessToken(request.refreshToken()), HttpStatus.OK);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@RequestParam("email") @NotBlank(message = "Email is required") String email, HttpServletRequest httpServletRequest) {
        log.info("Received request to forgot password for email: {}", email);
        if (!rateLimitingService.allowForgotRequest(email, httpServletRequest)) {
            log.error("Too many forgot requests for email: {}", email);
            throw new TooManyRequestsException("Too many requests");
        }
        return new ResponseEntity<>(authService.forgotPassword(email), HttpStatus.CREATED);
    }

    @PatchMapping("/reset-password")
    public ResponseEntity<ApiResponse<Object>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        log.info("Received request to reset password: {}", request);
        if (!rateLimitingService.allowResetRequest(request.email())) {
            log.error("Too many reset requests for email: {}", request.email());
            throw new TooManyRequestsException("Too many requests");
        }
        return new ResponseEntity<>(authService.resetPassword(request), HttpStatus.OK);
    }
}
