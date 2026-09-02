package com.saverfwd.backend.pickup.controller;

import com.saverfwd.backend.common.mapper.Mapper;
import com.saverfwd.backend.common.response.ApiResponse;
import com.saverfwd.backend.pickup.dto.CreatePickupRequest;
import com.saverfwd.backend.pickup.dto.PickupResponse;
import com.saverfwd.backend.pickup.service.PickupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pickup")
@RequiredArgsConstructor
public class PickupController {

    private final PickupService pickupService;

    @PostMapping
    public ResponseEntity<ApiResponse<PickupResponse>> createPickup(@Valid @RequestBody CreatePickupRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Mapper.toApiResponse("Pickup created!", pickupService.createPickup(request)));
    }
}
