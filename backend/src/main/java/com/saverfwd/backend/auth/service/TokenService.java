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
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class TokenService {

    private final JwtService jwtService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final BlacklistService blacklistService;

    public String accessToken(String username, long version) {
        String token = jwtService.generateToken(username, version);
        log.debug("Generated access token for user {}, {}", username, token);
        return token;
    }

    public String refreshToken(User user) {
        RefreshToken token = RefreshToken.builder()
                .expiresAt(LocalDateTime.now().plusDays(30))
                .token(Common.getSessionId())
                .revoked(false)
                .user(user)
                .build();

        RefreshToken savedToken = refreshTokenRepository.save(token);
        log.debug("Saved Refresh token for user {}, {} in db", user, savedToken);
        return savedToken.getToken();
    }

    @Transactional
    public void logoutCurrentDevice(String accessToken, RefreshToken refreshToken) {
        log.debug("Logging out current device for user {}, {}", accessToken, refreshToken);
        blacklistCurrentAccessToken(accessToken);
        revokeRefreshToken(refreshToken);
        log.debug("Logged out current device for user {}, {}", accessToken, refreshToken);
    }

    @Transactional
    public void logoutAllDevices(User user, String accessToken) {
        log.debug("Logging out all devices for user {}, {}", user, accessToken);
        blacklistCurrentAccessToken(accessToken);
        refreshTokenRepository.revokeAllByUserId(user.getId());
        log.debug("Blacklisted access token: {}, Revoked refresh token: {} for user", accessToken, user.getId());

        blacklistService.incrementVersion(user.getEmail());
    }

    private void blacklistCurrentAccessToken(String accessToken) {
        log.debug("Blacklisting access token for user {}", accessToken);
        String jti = jwtService.extractJti(accessToken);
        long ttl = jwtService.getRemainingTime(accessToken);

        blacklistService.blacklistToken(jti, ttl);
    }

    private void revokeRefreshToken(RefreshToken storedToken) {
        log.debug("Revoking refresh token for user {}", storedToken);
        storedToken.setRevoked(true);
        refreshTokenRepository.save(storedToken);
        log.debug("Revoked refresh token for user {}", storedToken);
    }

    public RefreshToken validateRefreshToken(String refreshToken) {
        log.debug("Validating refresh token for user {}", refreshToken);
        RefreshToken storedToken = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> {
                    log.error("Invalid refresh token for user {}", refreshToken);
                    return new ResourceNotFoundException("Invalid refresh token");
                });

        if(storedToken.isRevoked() || storedToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            log.error("Refresh token expired for user {}", refreshToken);
            throw new BusinessException("Invalid or expired refresh token");
        }

        return storedToken;
    }
}
