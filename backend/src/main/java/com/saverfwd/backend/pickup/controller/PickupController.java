package com.saverfwd.backend.pickup.controller;

import com.saverfwd.backend.common.mapper.Mapper;
import com.saverfwd.backend.common.response.ApiResponse;
import com.saverfwd.backend.pickup.dto.CreatePickupRequest;
import com.saverfwd.backend.pickup.dto.PickupResponse;
import com.saverfwd.backend.pickup.dto.UpdatePickupRequest;
import com.saverfwd.backend.pickup.service.PickupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PatchMapping("/{pickupId}")
    public ResponseEntity<ApiResponse<PickupResponse>> updatePickup(@PathVariable("pickupId") Long pickupId, @RequestBody UpdatePickupRequest request) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(Mapper.toApiResponse("Pickup updated!", pickupService.updatePickup(pickupId, request)));
    }

    @GetMapping("/{pickupId}")
    public ResponseEntity<ApiResponse<PickupResponse>> getPickup(@PathVariable("pickupId") Long pickupId) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(Mapper.toApiResponse("Pickup found!", pickupService.getPickupById(pickupId)));
    }

    @DeleteMapping("/{pickupId}")
    public ResponseEntity<ApiResponse<Void>> deletePickup(@PathVariable("pickupId") Long pickupId) {
        pickupService.deletePickup(pickupId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(Mapper.toApiResponse("Pickup deleted!", null));
    }
}
