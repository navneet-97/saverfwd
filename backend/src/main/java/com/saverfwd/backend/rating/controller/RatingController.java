package com.saverfwd.backend.rating.controller;

import com.saverfwd.backend.common.mapper.Mapper;
import com.saverfwd.backend.common.response.ApiResponse;
import com.saverfwd.backend.common.response.PageResponse;
import com.saverfwd.backend.rating.dto.PostRatingRequest;
import com.saverfwd.backend.rating.dto.RatingResponse;
import com.saverfwd.backend.rating.dto.RatingSearchFilter;
import com.saverfwd.backend.rating.dto.UpdateRatingRequest;
import com.saverfwd.backend.rating.service.RatingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<RatingResponse>>> getRatings(
            @Valid @ModelAttribute RatingSearchFilter filter,
            @PageableDefault(page = 0, size = 10) Pageable pageable
    ) {
        PageResponse<RatingResponse> pageResponse = ratingService.getRatings(filter, pageable);
        return ResponseEntity.status(HttpStatus.OK)
                .body(Mapper.toApiResponse("Rating Found!", pageResponse));
    }

    @GetMapping("/{ratingId}")
    public ResponseEntity<ApiResponse<RatingResponse>> getRatingById(@PathVariable("ratingId") Long ratingId) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(Mapper.toApiResponse("Rating Found!", ratingService.getRatingById(ratingId)));
    }

    @PatchMapping("/{ratingId}")
    public ResponseEntity<ApiResponse<RatingResponse>> updateRating(@PathVariable("ratingId") Long ratingId, @Valid @RequestBody UpdateRatingRequest request) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(Mapper.toApiResponse("Rating Updated!", ratingService.updateRating(ratingId, request)));
    }
}
