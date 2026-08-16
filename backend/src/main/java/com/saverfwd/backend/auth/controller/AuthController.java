package com.saverfwd.backend.auth.controller;

import com.saverfwd.backend.auth.dtos.RefreshTokenRequest;
import com.saverfwd.backend.auth.dtos.UserLoginRequest;
import com.saverfwd.backend.auth.dtos.UserRegisterRequest;
import com.saverfwd.backend.auth.response.AuthResponse;
import com.saverfwd.backend.auth.service.AuthService;
import com.saverfwd.backend.common.response.ApiResponse;
import com.saverfwd.backend.user.dto.UserResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody UserRegisterRequest request) {
        return new ResponseEntity<>(authService.registerUser(request), HttpStatus.CREATED);
    }

    @PostMapping("/bulk")
    public ResponseEntity<List<UserResponse>> registerMany(@RequestBody List<@Valid UserRegisterRequest> requests) {
        return new ResponseEntity<>(authService.registerMany(requests), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody UserLoginRequest request) {
        return new ResponseEntity<>(authService.loginUser(request), HttpStatus.OK);
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> me() {
        return new ResponseEntity<>(authService.getCurrentUser(), HttpStatus.OK);
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(@Valid @RequestBody RefreshTokenRequest request) {
        return new ResponseEntity<>(authService.logoutCurrentSession(request.refreshToken()), HttpStatus.OK);
    }

    @PostMapping("/logout-all")
    public ResponseEntity<ApiResponse<Void>> logoutAll() {
        return new ResponseEntity<>(authService.logoutAllSessions(), HttpStatus.OK);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshAccessToken(@Valid @RequestBody RefreshTokenRequest request) {
        return new ResponseEntity<>(authService.refreshAccessToken(request.refreshToken()), HttpStatus.OK);
    }
}
