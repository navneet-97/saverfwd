package com.saverfwd.backend.auth.service;

import com.saverfwd.backend.common.constant.commonConstants;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class BlacklistService {

    private final RedisTemplate<String, String> redisTemplate;

    public void blacklistToken(String jti, long ttl) {
        if(ttl <= 0) {
            return; // No need to store if the token is already expired
        }
        redisTemplate.opsForValue().set(
                commonConstants.BLACKLIST_KEY_PREFIX + jti,
                "1",
                ttl,
                TimeUnit.MILLISECONDS
        );
    }

    public boolean isTokenBlacklisted(String jti) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(commonConstants.BLACKLIST_KEY_PREFIX + jti));
    }

    public long getOrInitializeVersion(String username) {
        String key = commonConstants.VERSION_KEY_PREFIX + username;
        String versionStr = redisTemplate.opsForValue().get(key);

        if (versionStr != null) {
            return Long.parseLong(versionStr);
        }
        Boolean created = redisTemplate.opsForValue().setIfAbsent(key, "0");

        if(Boolean.TRUE.equals(created)) {
            return 0L;
        }

        return Long.parseLong(Objects.requireNonNull(redisTemplate.opsForValue().get(key)));
    }

    public void incrementVersion(String username) {
        redisTemplate.opsForValue().increment(commonConstants.VERSION_KEY_PREFIX + username);
    }
}
