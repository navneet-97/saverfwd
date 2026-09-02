package com.saverfwd.backend.pickup.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record CreatePickupRequest(
        @NotNull(message = "Order is required")
        Long orderId,

        @NotNull(message = "Scheduled Time is required")
        LocalDateTime scheduledTime
) {
}
