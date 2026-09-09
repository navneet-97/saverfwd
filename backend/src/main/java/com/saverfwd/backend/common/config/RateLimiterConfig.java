package com.saverfwd.backend.common.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.BandwidthBuilder;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;
import java.time.Instant;

@Configuration
public class RateLimiterConfig {

    @Bean
    public Bucket bucket() {
        Refill refill = Refill.intervally(10, Duration.ofMinutes(1));
        Bandwidth bandwidth = Bandwidth.classic(10, refill);

        return Bucket.builder()
                .addLimit(bandwidth)
                .build();
    }
}
