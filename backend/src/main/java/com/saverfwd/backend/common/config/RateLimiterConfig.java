package com.saverfwd.backend.common.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
public class RateLimiterConfig {

    public Bucket createEmailBucket(long tokens, long hours) {
        Refill refill = Refill.greedy(tokens, Duration.ofHours(hours));
        Bandwidth bandwidth = Bandwidth.classic(tokens, refill);

        return Bucket.builder()
                .addLimit(bandwidth)
                .build();
    }

    public Bucket createIpBucket(long tokens, long hours) {
        Refill refill = Refill.greedy(tokens, Duration.ofHours(hours));
        Bandwidth bandwidth = Bandwidth.classic(tokens, refill);

        return Bucket.builder()
                .addLimit(bandwidth)
                .build();
    }
}
