package com.saverfwd.backend.food.dto;

import com.saverfwd.backend.food.enums.FoodStatus;
import com.saverfwd.backend.food.enums.FoodType;
import com.saverfwd.backend.food.enums.ListingType;
import jakarta.validation.constraints.Positive;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Builder
public record FoodFilterRequest(
        Long ownerId,
        String title,
        FoodType foodType,
        ListingType listingType,
        FoodStatus status,

        @Positive
        BigDecimal minQuantity,
        @Positive
        BigDecimal maxQuantity,

        @Positive
        BigDecimal minPrice,
        @Positive
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
        @Positive
        Double radiusKm,

        String sort
) {
}
