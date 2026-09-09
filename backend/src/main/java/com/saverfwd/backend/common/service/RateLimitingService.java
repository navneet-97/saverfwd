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
                "REGISTER: " + email, key -> rateLimiterConfig.createEmailBucket()
        );

        Bucket ipBucket = rateLimiters.computeIfAbsent(
                "IP: " + ip, key -> rateLimiterConfig.createIpBucket()
        );

        return emailBucket.tryConsume(1) && ipBucket.tryConsume(1);
    }
}
