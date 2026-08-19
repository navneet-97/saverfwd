package com.saverfwd.backend.food.dto;

import com.saverfwd.backend.food.enums.FoodStatus;
import com.saverfwd.backend.food.enums.FoodType;
import com.saverfwd.backend.food.enums.ListingType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record FoodFilterRequest(
        Long ownerId,
        String title,
        FoodType foodType,
        ListingType listingType,
        FoodStatus status,

        BigDecimal minQuantity,
        BigDecimal maxQuantity,

        BigDecimal minPrice,
        BigDecimal maxPrice,

        LocalDateTime expiryFrom,
        LocalDateTime expiryTo,

        LocalDateTime pickupStartFrom,
        LocalDateTime pickupStartTo,

        LocalDateTime pickupEndFrom,
        LocalDateTime pickupEndTo,

        BigDecimal latitude,
        BigDecimal longitude,

        String pickupAddress,
        Double radiusKm
) {
}
