package com.saverfwd.backend.order.controller;

import com.saverfwd.backend.common.mapper.Mapper;
import com.saverfwd.backend.common.response.ApiResponse;
import com.saverfwd.backend.common.response.PageResponse;
import com.saverfwd.backend.order.dto.OrderFoodRequest;
import com.saverfwd.backend.order.dto.OrderSearchFilter;
import com.saverfwd.backend.order.enums.OrderStatus;
import com.saverfwd.backend.order.response.OrderResponse;
import com.saverfwd.backend.order.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> orderFood(@Valid @RequestBody OrderFoodRequest orderFoodRequest) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Mapper.toApiResponse("Order created successfully!", orderService.orderFood(orderFoodRequest)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<OrderResponse>>> getOrders(
            @Valid @ModelAttribute OrderSearchFilter filter,
            @PageableDefault(page = 0, size = 10)
            Pageable pageable
    ) {
        PageResponse<OrderResponse> pageResponse = orderService.getOrders(filter, pageable);
        return ResponseEntity.status(HttpStatus.OK)
                .body(Mapper.toApiResponse("Page Response", pageResponse));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(@PathVariable Long orderId) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(Mapper.toApiResponse("Request Order: ", orderService.getOrderByOrderId(orderId)));
    }

    /*
        Api to fetch self created orders with status
     */
    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getOrdersByUserId(@PathVariable Long userId, @RequestParam OrderStatus status) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(Mapper.toApiResponse("Your orders:", orderService.getOrdersByUserId(userId, status)));
    }

    @PatchMapping("/{orderId}/status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(@PathVariable Long orderId, @RequestParam OrderStatus status) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(Mapper.toApiResponse("Order Status Updated!", orderService.updateOrderStatus(orderId, status)));
    }
}
