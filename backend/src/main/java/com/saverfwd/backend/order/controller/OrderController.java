package com.saverfwd.backend.order.controller;

import com.saverfwd.backend.order.dto.OrderFoodRequest;
import com.saverfwd.backend.order.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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
    public void orderFood(@Valid @RequestBody OrderFoodRequest orderFoodRequest) {
        orderService.orderFood(orderFoodRequest);
    }
}
