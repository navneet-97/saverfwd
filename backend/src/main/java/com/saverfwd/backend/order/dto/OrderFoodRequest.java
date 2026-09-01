package com.saverfwd.backend.order.dto;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record OrderFoodRequest(

        @NotNull(message = "Food Item is required")
        Long foodItemId,

        @NotNull(message = "Quantity is required")
        @Positive(message = "Quantity must be greater than 0")
        @Digits(integer = 10, fraction = 2, message = "Invalid quantity")
        BigDecimal quantity
) {
}
