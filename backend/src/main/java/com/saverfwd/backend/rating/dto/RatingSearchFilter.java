package com.saverfwd.backend.rating.dto;

public record RatingSearchFilter(
        Long orderId,
        Long reviewerId,
        Long reviewedUserId,
        Integer ratingValue,
        String sort,
        Boolean asc
) {
}
