package com.saverfwd.backend.rating.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record PostRatingRequest(
        @NotNull(message = "Order is required")
        Long orderId,

        @NotNull(message = "Rating is required")
        @Min(value = 1, message = "Rating cannot be less than 1")
        @Max(value = 5, message = "Rating cannot exceed 5")
        Integer ratingValue,

        @Size(max = 500, message = "Comment cannot exceed 500 characters")
        String comment
) {
}
