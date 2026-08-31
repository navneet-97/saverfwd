package com.saverfwd.backend.order.dto;

import com.saverfwd.backend.food.entity.FoodItem;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record OrderFoodRequest(

        @NotNull(message = "Food Item is required")
        FoodItem foodItem,

        @NotNull(message = "Quantity is required")
        @Positive(message = "Quantity must be greater than 0")
        @Digits(integer = 10, fraction = 2, message = "Invalid quantity")
        BigDecimal quantity
) {
}
