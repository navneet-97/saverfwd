package com.saverfwd.backend.food.controller;

import com.saverfwd.backend.common.mapper.Mapper;
import com.saverfwd.backend.common.response.ApiResponse;
import com.saverfwd.backend.common.response.PageResponse;
import com.saverfwd.backend.food.dto.CreateFoodRequest;
import com.saverfwd.backend.food.dto.FoodFilterRequest;
import com.saverfwd.backend.food.dto.FoodResponse;
import com.saverfwd.backend.food.dto.UpdateFoodStatusRequest;
import com.saverfwd.backend.food.service.FoodService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/food")
@RequiredArgsConstructor
public class FoodController {

    private final FoodService foodService;

    @PostMapping
    public ResponseEntity<ApiResponse<FoodResponse>> addFood(@Valid @RequestBody CreateFoodRequest request) {
        log.info("Received adding food request {}", request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Mapper.toApiResponse("Food created!",foodService.addFoodItem(request)));
    }

    @PostMapping("/bulk")
    public ResponseEntity<ApiResponse<List<FoodResponse>>> addBulkFood(@RequestBody List<@Valid CreateFoodRequest> request) {
        log.info("Received adding multiple food request {}", request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Mapper.toApiResponse("Bulk Food Added!", foodService.addBulkFood(request)));

    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FoodResponse>> getFoodById(@PathVariable Long id) {
        log.info("Received getting food by id {}", id);
        return ResponseEntity.status(HttpStatus.OK)
                .body(Mapper.toApiResponse("Requested Food Item", foodService.getFoodById(id)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<FoodResponse>>> getAllFood(
            @Valid @ModelAttribute FoodFilterRequest filter,
            @PageableDefault(page = 0, size = 10)
            Pageable pageable
            ) {
        log.info("Received getting all food items by filter {}", filter);
        PageResponse<FoodResponse> response = foodService.getAllFoodItems(filter, pageable);
        return ResponseEntity.status(HttpStatus.OK)
                .body(Mapper.toApiResponse("Page Response", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FoodResponse>> updateFood(@PathVariable Long id, @Valid @RequestBody CreateFoodRequest request) {
        log.info("Received update food request {}", request);
        return ResponseEntity.status(HttpStatus.OK)
                .body(Mapper.toApiResponse("Updated Food Item", foodService.updateFoodItem(id, request)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<FoodResponse>> updateFoodStatus(@PathVariable Long id, @Valid @RequestBody UpdateFoodStatusRequest request) {
        log.info("Received update food status request {}", request);
        return ResponseEntity.status(HttpStatus.OK)
                .body(Mapper.toApiResponse("Food Item with updated status", foodService.updateFoodItemStatus(id, request)));
    }

    @GetMapping("/my-listings")
    public ResponseEntity<ApiResponse<PageResponse<FoodResponse>>> getMyListings(Pageable pageable) {
        log.info("Received getting self-listings request");
        return ResponseEntity.ok(Mapper.toApiResponse("My listings",foodService.getMyListings(pageable)));
    }
}
