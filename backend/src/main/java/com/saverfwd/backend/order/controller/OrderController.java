package com.saverfwd.backend.order.controller;

import com.saverfwd.backend.common.response.ApiResponse;
import com.saverfwd.backend.order.dto.OrderFoodRequest;
import com.saverfwd.backend.order.response.OrderResponse;
import com.saverfwd.backend.order.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> orderFood(@Valid @RequestBody OrderFoodRequest orderFoodRequest) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(orderService.orderFood(orderFoodRequest));
    }
}
