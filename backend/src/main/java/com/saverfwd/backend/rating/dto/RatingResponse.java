package com.saverfwd.backend.rating.dto;

import java.time.LocalDateTime;

public record RatingResponse(
        Long id,
        Long orderId,
        String reviewerName,
        String reviewedUserName,
        Integer ratingValue,
        String comment,
        LocalDateTime createdAt
) {
}
