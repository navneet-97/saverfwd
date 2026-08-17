package com.saverfwd.backend.food.controller;

import com.saverfwd.backend.common.mapper.Mapper;
import com.saverfwd.backend.common.response.ApiResponse;
import com.saverfwd.backend.food.dto.CreateFoodRequest;
import com.saverfwd.backend.food.dto.FoodResponse;
import com.saverfwd.backend.food.service.FoodService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    // GET /api/food/{id}

    // GET /api/food

    // PUT /api/food/{id}
    // PATCH /api/food/{id}/cancel

    // GET /api/food/my-listings
}

