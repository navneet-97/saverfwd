package com.saverfwd.backend.auth.service;

import com.saverfwd.backend.common.constant.commonConstants;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class BlacklistService {

    private final RedisTemplate<String, String> redisTemplate;

    public void blacklistToken(String jti, long ttl) {
        log.debug("Blacklist token for jti {}", jti);
        if(ttl <= 0) {
            return; // No need to store if the token is already expired
        }
        redisTemplate.opsForValue().set(
                commonConstants.BLACKLIST_KEY_PREFIX + jti,
                "1",
                ttl,
                TimeUnit.MILLISECONDS
        );
        log.debug("Token blacklisted: {}", jti);
    }

    public boolean isTokenBlacklisted(String jti) {
        log.debug("Checking token for jti {}", jti);
        return Boolean.TRUE.equals(redisTemplate.hasKey(commonConstants.BLACKLIST_KEY_PREFIX + jti));
    }

    public long getOrInitializeVersion(String username) {
        log.debug("Initializing version for user {}", username);
        String key = commonConstants.VERSION_KEY_PREFIX + username;
        String versionStr = redisTemplate.opsForValue().get(key);

        if (versionStr != null) {
            log.debug("Version found for user {}, {}", username, versionStr);
            return Long.parseLong(versionStr);
        }
        log.debug("Version not found for user {}, initializing version: 0 for user {}", username, username);
        Boolean created = redisTemplate.opsForValue().setIfAbsent(key, "0");

        if(Boolean.TRUE.equals(created)) {
            return 0L;
        }

        long initializedVersion = Long.parseLong(Objects.requireNonNull(redisTemplate.opsForValue().get(key)));
        log.debug("Version successfully initialized for user {}, {}", username, initializedVersion);
        return initializedVersion;
    }

    public void incrementVersion(String username) {
        log.debug("Incrementing version for user {}", username);
        redisTemplate.opsForValue().increment(commonConstants.VERSION_KEY_PREFIX + username);
    }
}
