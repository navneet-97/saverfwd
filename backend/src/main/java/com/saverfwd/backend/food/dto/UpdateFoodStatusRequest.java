package com.saverfwd.backend.food.dto;

import com.saverfwd.backend.food.enums.FoodStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateFoodStatusRequest(
        @NotNull(message = "status is required")
        FoodStatus foodStatus
) {
}
