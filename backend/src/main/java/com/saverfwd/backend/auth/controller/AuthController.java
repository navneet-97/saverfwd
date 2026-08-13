package com.saverfwd.backend.auth.controller;

import com.saverfwd.backend.auth.response.TokenResponse;
import com.saverfwd.backend.auth.dtos.UserLoginRequest;
import com.saverfwd.backend.auth.dtos.UserRegisterRequest;
import com.saverfwd.backend.auth.response.AuthResponse;
import com.saverfwd.backend.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody UserRegisterRequest request) {
        TokenResponse tokenResponse = authService.registerUser(request);

        AuthResponse authResponse = response("User registered successfully!", tokenResponse);
        return new ResponseEntity<>(authResponse, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody UserLoginRequest request) {
        TokenResponse tokenResponse = authService.loginUser(request);

        AuthResponse authResponse = response("User logged in successfully!", tokenResponse);
        return new ResponseEntity<>(authResponse, HttpStatus.OK);
    }

    private AuthResponse response(String msg, TokenResponse tokenResponse) {
        return AuthResponse.builder()
                .success(true)
                .message(msg)
                .token(tokenResponse)
                .build();
    }
}
