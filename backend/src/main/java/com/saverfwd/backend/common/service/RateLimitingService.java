package com.saverfwd.backend.common.service;

import com.saverfwd.backend.common.config.RateLimiterConfig;
import io.github.bucket4j.Bucket;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class RateLimitingService {

    private final ConcurrentHashMap<String, Bucket> rateLimiters = new ConcurrentHashMap<>();
    private final RateLimiterConfig rateLimiterConfig;

    public boolean allowRegisterRequest(String email, HttpServletRequest httpServletRequest) {
        String ip = httpServletRequest.getRemoteAddr();
        Bucket emailBucket = rateLimiters.computeIfAbsent(
                "REGISTER: " + email, key -> rateLimiterConfig.createEmailBucket(5, 1)
        );

        Bucket ipBucket = rateLimiters.computeIfAbsent(
                "IP: " + ip, key -> rateLimiterConfig.createIpBucket(20, 1)
        );

        return emailBucket.tryConsume(1) && ipBucket.tryConsume(1);
    }

    public boolean allowLoginRequest(String email, HttpServletRequest httpServletRequest) {
        String ip = httpServletRequest.getRemoteAddr();

        Bucket emailBucket = rateLimiters.computeIfAbsent(
                "LOGIN: " + email, key -> rateLimiterConfig.createEmailBucket(5, 1/4)
        );

        Bucket ipBucket = rateLimiters.computeIfAbsent(
                "IP: " + ip, key -> rateLimiterConfig.createIpBucket(20, 1/4)
        );

        return emailBucket.tryConsume(1) && ipBucket.tryConsume(1);
    }
}
