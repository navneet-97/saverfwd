package com.saverfwd.backend.rating.controller;

import com.saverfwd.backend.common.mapper.Mapper;
import com.saverfwd.backend.common.response.ApiResponse;
import com.saverfwd.backend.rating.dto.PostRatingRequest;
import com.saverfwd.backend.rating.dto.RatingResponse;
import com.saverfwd.backend.rating.service.RatingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/rating")
public class RatingController {

    private final RatingService ratingService;

    @PostMapping
    public ResponseEntity<ApiResponse<RatingResponse>> postRating(@Valid @RequestBody PostRatingRequest postRatingRequest) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Mapper.toApiResponse("Rating Created!", ratingService.postRating(postRatingRequest)));
    }
}
