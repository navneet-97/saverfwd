package com.saverfwd.backend.auth.service;

import com.saverfwd.backend.auth.entity.RefreshToken;
import com.saverfwd.backend.auth.repository.RefreshTokenRepository;
import com.saverfwd.backend.auth.security.JwtService;
import com.saverfwd.backend.common.exception.BusinessException;
import com.saverfwd.backend.common.exception.ResourceNotFoundException;
import com.saverfwd.backend.common.util.Common;
import com.saverfwd.backend.user.entity.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TokenService {

    private final JwtService jwtService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final BlacklistService blacklistService;

    public String accessToken(String username, long version) {
        return jwtService.generateToken(username, version);
    }

    public String refreshToken(User user) {
        RefreshToken token = RefreshToken.builder()
                .expiresAt(LocalDateTime.now().plusDays(30))
                .token(Common.getSessionId())
                .revoked(false)
                .user(user)
                .build();

        RefreshToken savedToken = refreshTokenRepository.save(token);
        return savedToken.getToken();
    }

    @Transactional
    public void logoutCurrentDevice(String accessToken, RefreshToken refreshToken) {
        blacklistCurrentAccessToken(accessToken);
        revokeRefreshToken(refreshToken);
    }

    @Transactional
    public void logoutAllDevices(User user, String accessToken) {
        blacklistCurrentAccessToken(accessToken);
        refreshTokenRepository.revokeAllByUserId(user.getId());

        blacklistService.incrementVersion(user.getEmail());
    }

    private void blacklistCurrentAccessToken(String accessToken) {
        String jti = jwtService.extractJti(accessToken);
        long ttl = jwtService.getRemainingTime(accessToken);

        blacklistService.blacklistToken(jti, ttl);
    }

    private void revokeRefreshToken(RefreshToken storedToken) {
        storedToken.setRevoked(true);
        refreshTokenRepository.save(storedToken);
    }

    public RefreshToken validateRefreshToken(String refreshToken) {
        RefreshToken storedToken = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid refresh token"));

        if(storedToken.isRevoked() || storedToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BusinessException("Invalid or expired refresh token");
        }

        return storedToken;
    }
}
