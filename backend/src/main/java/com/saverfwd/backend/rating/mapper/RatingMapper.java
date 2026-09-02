package com.saverfwd.backend.rating.mapper;

import com.saverfwd.backend.rating.dto.PostRatingRequest;
import com.saverfwd.backend.rating.dto.RatingResponse;
import com.saverfwd.backend.rating.entity.Rating;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RatingMapper {

    Rating toRating(PostRatingRequest request);

    @Mapping(target = "orderId", source = "order.id")
    @Mapping(target = "reviewerName", source = "reviewer.fullName")
    @Mapping(target = "reviewedUserName", source = "reviewedUser.fullName")
    RatingResponse toRatingResponse(Rating rating);
}
