package com.saverfwd.backend.common.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
public class RateLimiterConfig {

    public Bucket createBucket(int capacity, Duration duration) {
        Refill refill = Refill.greedy(capacity, duration);
        Bandwidth bandwidth = Bandwidth.classic(capacity, refill);

        return Bucket.builder()
                .addLimit(bandwidth)
                .build();
    }
}
