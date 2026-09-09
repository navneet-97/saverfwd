package com.saverfwd.backend.common.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
public class RateLimiterConfig {

    public Bucket createEmailBucket() {
        Refill refill = Refill.greedy(5, Duration.ofHours(1));
        Bandwidth bandwidth = Bandwidth.classic(5, refill);

        return Bucket.builder()
                .addLimit(bandwidth)
                .build();
    }

    public Bucket createIpBucket() {
        Refill refill = Refill.greedy(20, Duration.ofHours(1));
        Bandwidth bandwidth = Bandwidth.classic(20, refill);

        return Bucket.builder()
                .addLimit(bandwidth)
                .build();
    }
}
