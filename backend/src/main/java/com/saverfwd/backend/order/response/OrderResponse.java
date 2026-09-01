package com.saverfwd.backend.order.response;

import com.saverfwd.backend.food.dto.FoodResponse;
import com.saverfwd.backend.order.enums.OrderStatus;

import java.math.BigDecimal;

public record OrderResponse(
        Long id,
        FoodResponse foodItem,
        String createdBy,
        BigDecimal quantity,
        BigDecimal unitPrice,
        BigDecimal totalAmount,
        OrderStatus status
) {
}
