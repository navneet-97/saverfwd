package com.saverfwd.backend.pickup.dto;

import com.saverfwd.backend.pickup.entity.PickupStatus;

import java.time.LocalDateTime;

public record UpdatePickupRequest(
        LocalDateTime pickedUpAt,
        PickupStatus status,
        String pickupNotes
) {
}
