package com.saverfwd.backend.food.dto;

import com.saverfwd.backend.food.enums.FoodStatus;
import com.saverfwd.backend.food.enums.FoodType;
import com.saverfwd.backend.food.enums.ListingType;
import com.saverfwd.backend.food.enums.Unit;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record FoodResponse(
        Long id,
        Long ownerId,
        String title,
        String description,
        FoodType foodType,
        ListingType listingType,
        FoodStatus status,
        Unit unit,
        BigDecimal quantity,
        BigDecimal price,
        LocalDateTime expiryTime,
        LocalDateTime pickupStartTime,
        LocalDateTime pickupEndTime,
        String pickupAddress,
        BigDecimal latitude,
        BigDecimal longitude,
        LocalDateTime createdAt
) {
}
