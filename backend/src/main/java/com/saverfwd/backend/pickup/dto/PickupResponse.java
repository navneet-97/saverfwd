package com.saverfwd.backend.pickup.dto;

import com.saverfwd.backend.pickup.entity.PickupStatus;

import java.time.LocalDateTime;

public record PickupResponse(
        Long id,
        Long orderId,
        LocalDateTime scheduledTime,
        LocalDateTime pickedUpAt,
        PickupStatus status,
        String pickupNotes,
        LocalDateTime createdAt
) {
}
