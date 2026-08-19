package com.saverfwd.backend.food.controller;

import com.saverfwd.backend.common.mapper.Mapper;
import com.saverfwd.backend.common.response.ApiResponse;
import com.saverfwd.backend.common.response.PageResponse;
import com.saverfwd.backend.food.dto.CreateFoodRequest;
import com.saverfwd.backend.food.dto.FoodFilterRequest;
import com.saverfwd.backend.food.dto.FoodResponse;
import com.saverfwd.backend.food.service.FoodService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/food")
@RequiredArgsConstructor
public class FoodController {

    private final FoodService foodService;

    @PostMapping
    public ResponseEntity<ApiResponse<FoodResponse>> addFood(@Valid @RequestBody CreateFoodRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Mapper.toApiResponse("Food created!",foodService.addFoodItem(request)));
    }

    @PostMapping("/bulk")
    public ResponseEntity<ApiResponse<List<FoodResponse>>> addBulkFood(@RequestBody List<@Valid CreateFoodRequest> request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Mapper.toApiResponse("Bulk Food Added!", foodService.addBulkFood(request)));

    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FoodResponse>> getFoodById(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(Mapper.toApiResponse("Requested Food Item", foodService.getFoodById(id)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<FoodResponse>>> getAllFood(
            @ModelAttribute FoodFilterRequest filter,
            @PageableDefault(page = 0, size = 10, sort = "createdAt", direction = Sort.Direction.DESC)
            Pageable pageable
            ) {

        PageResponse<FoodResponse> response = foodService.getAllFoodItems(filter, pageable);
        return ResponseEntity.status(HttpStatus.OK)
                .body(Mapper.toApiResponse("Page Response", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FoodResponse>> updateFood(@PathVariable Long id, @Valid @RequestBody CreateFoodRequest request) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(Mapper.toApiResponse("Updated Food Item", foodService.updateFoodItem(id, request)));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<FoodResponse>> cancelFood(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(Mapper.toApiResponse("Cancelled Food Item", foodService.cancelFoodItem(id)));
    }

    // GET /api/food/my-listings
}

