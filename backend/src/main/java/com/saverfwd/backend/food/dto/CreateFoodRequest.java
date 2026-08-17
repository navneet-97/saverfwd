package com.saverfwd.backend.food.dto;

import com.saverfwd.backend.food.enums.FoodType;
import com.saverfwd.backend.food.enums.ListingType;
import com.saverfwd.backend.food.enums.Unit;
import com.saverfwd.backend.food.validation.ValidCreateFoodRequest;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@ValidCreateFoodRequest
public record CreateFoodRequest(

        @NotBlank(message = "Food title is required")
        @Size(min = 3, max = 50, message = "Food title must be between 3 and 50 characters")
        String title,

        @Size(max = 400, message = "Description cannot exceed 400 characters")
        String description,

        @NotNull(message = "Food type is required")
        FoodType foodType,

        @NotNull(message = "Unit is required")
        Unit unit,

        @NotNull(message = "Listing type is required")
        ListingType listingType,

        @NotNull(message = "Quantity is required")
        @Positive(message = "Quantity must be greater than 0")
        @Digits(integer = 10, fraction = 2, message = "Invalid quantity")
        BigDecimal quantity,

        @PositiveOrZero(message = "Price cannot be negative")
        @Digits(integer = 10, fraction = 2, message = "Invalid price")
        BigDecimal price,

        @NotNull(message = "Expiry time is required")
        @Future(message = "Expiry time must be in future")
        LocalDateTime expiryTime,

        @NotNull(message = "Pickup start time is required")
        LocalDateTime pickupStartTime,

        @NotNull(message = "Pickup end time is required")
        LocalDateTime pickupEndTime,

        @NotBlank(message = "Pickup address is required")
        @Size(min = 10, max = 400, message = "Pickup address must be between 10 and 400 characters")
        String pickupAddress,

        @NotNull(message = "Latitude is required")
        @DecimalMin(value = "-90.0", message = "Latitude must be between -90 and 90")
        @DecimalMax(value = "90.0", message = "Latitude must be between -90 and 90")
        BigDecimal latitude,

        @NotNull(message = "Longitude is required")
        @DecimalMin(value = "-180.0", message = "Latitude must be between -180 and 180")
        @DecimalMax(value = "180.0", message = "Latitude must be between -180 and 180")
        BigDecimal longitude
) {
}
