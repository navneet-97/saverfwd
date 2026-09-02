package com.saverfwd.backend.rating.dto;

import jakarta.validation.constraints.Size;

public record UpdateRatingRequest(
        @Size(min = 1, max = 5, message = "Rating should be between 1-5")
        Integer ratingValue,

        @Size(max = 500, message = "Comment cannot exceed 500 characters")
        String comment
) {
}
