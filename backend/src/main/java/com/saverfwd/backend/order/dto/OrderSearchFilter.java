package com.saverfwd.backend.order.dto;

import com.saverfwd.backend.order.enums.OrderStatus;

import java.math.BigDecimal;

public record OrderSearchFilter(
        Long createdBy,
        OrderStatus status,
        BigDecimal minAmount,
        BigDecimal maxAmount,
        BigDecimal minQuantity,
        BigDecimal maxQuantity,
        String sort,
        Boolean asc
) {
}
