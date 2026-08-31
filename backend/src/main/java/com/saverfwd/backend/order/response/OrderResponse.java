package com.saverfwd.backend.order.response;

import com.saverfwd.backend.food.entity.FoodItem;
import com.saverfwd.backend.order.enums.OrderStatus;

import java.math.BigDecimal;

public record OrderResponse(
        FoodItem order,
        String createdBy,
        BigDecimal quantity,
        BigDecimal unitPrice,
        BigDecimal totalAmount,
        OrderStatus orderStatus
) {
}
