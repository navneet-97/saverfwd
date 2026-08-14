package com.saverfwd.backend.auth.service;

import com.saverfwd.backend.auth.entity.RefreshToken;
import com.saverfwd.backend.auth.repository.RefreshTokenRepository;
import com.saverfwd.backend.auth.security.CustomUserDetails;
import com.saverfwd.backend.auth.security.JwtService;
import com.saverfwd.backend.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TokenService {

    private final JwtService jwtService;
    private final RefreshTokenRepository refreshTokenRepository;

    public String accessToken(User user) {
        UserDetails userDetails = new CustomUserDetails(user);
        return jwtService.generateToken(userDetails);
    }

    public String refreshToken(User user) {
        RefreshToken token = RefreshToken.builder()
                .expiresAt(LocalDateTime.now().plusDays(30))
                .token(UUID.randomUUID().toString())
                .revoked(false)
                .user(user)
                .build();

        RefreshToken savedToken = refreshTokenRepository.save(token);
        return savedToken.getToken();
    }
}
