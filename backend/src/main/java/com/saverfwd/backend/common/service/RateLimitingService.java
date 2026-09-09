package com.saverfwd.backend.common.service;

import com.saverfwd.backend.common.config.RateLimiterConfig;
import io.github.bucket4j.Bucket;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class RateLimitingService {

    private final ConcurrentHashMap<String, Bucket> rateLimiters = new ConcurrentHashMap<>();
    private final RateLimiterConfig rateLimiterConfig;

    private Bucket getBucket(String key, int capacity, Duration duration) {
        return rateLimiters.computeIfAbsent(
                key,
                k -> rateLimiterConfig.createBucket(capacity, duration)
        );
    }

    public boolean allowRegisterRequest(String email, HttpServletRequest request) {
        String ip = request.getRemoteAddr();
        Bucket emailBucket = getBucket("REGISTER_EMAIL:"+email,5,Duration.ofHours(1));
        Bucket ipBucket = getBucket("REGISTER_IP:"+ip,20,Duration.ofHours(1));

        boolean emailAllowed = emailBucket.tryConsume(1);
        boolean ipAllowed = ipBucket.tryConsume(1);
        return emailAllowed && ipAllowed;
    }

    public boolean allowLoginRequest(String email, HttpServletRequest httpServletRequest) {
        String ip = httpServletRequest.getRemoteAddr();

        Bucket emailBucket = getBucket("LOGIN_EMAIL:"+email,5,Duration.ofMinutes(15));
        Bucket ipBucket = getBucket("LOGIN_IP:"+ip,20,Duration.ofMinutes(15));

        boolean emailAllowed = emailBucket.tryConsume(1);
        boolean ipAllowed = ipBucket.tryConsume(1);
        return emailAllowed && ipAllowed;
    }

    public boolean allowForgotRequest(String email, HttpServletRequest httpServletRequest) {
        String ip = httpServletRequest.getRemoteAddr();
        Bucket emailBucket = getBucket("FORGOT_EMAIL:"+email,3,Duration.ofHours(1));
        Bucket ipBucket = getBucket("FORGOT_IP:"+ip,10,Duration.ofHours(1));

        boolean emailAllowed = emailBucket.tryConsume(1);
        boolean ipAllowed = ipBucket.tryConsume(1);
        return emailAllowed && ipAllowed;
    }

    public boolean allowResetRequest(String email) {
        Bucket emailBucket = getBucket("RESET_EMAIL:"+email,10,Duration.ofHours(1));
        return emailBucket.tryConsume(1);
    }

    public boolean allowRefreshRequest(String token) {
        Bucket tokenBucket = getBucket("REFRESH_TOKEN:"+token,5,Duration.ofHours(1));
        return tokenBucket.tryConsume(1);
    }
}
