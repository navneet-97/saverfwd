package com.saverfwd.backend.common.constant;

import com.saverfwd.backend.food.enums.FoodStatus;
import com.saverfwd.backend.order.enums.OrderStatus;

import java.util.Map;
import java.util.Set;

public final class StatusUpdateConstants {
    private StatusUpdateConstants() {}

    public static final Map<FoodStatus, Set<FoodStatus>> ALLOWED_TRANSITIONS = Map.of(
            FoodStatus.AVAILABLE, Set.of(FoodStatus.RESERVED, FoodStatus.CANCELLED),
            FoodStatus.RESERVED, Set.of(FoodStatus.SOLD, FoodStatus.CLAIMED)
    );

    public static final Set<FoodStatus> TERMINAL_STATUSES = Set.of(
            FoodStatus.SOLD,
            FoodStatus.CLAIMED,
            FoodStatus.CANCELLED,
            FoodStatus.EXPIRED
    );

    public static final Map<OrderStatus, Set<OrderStatus>> ALLOWED_ORDER_TRANSITIONS = Map.of(
            OrderStatus.PENDING, Set.of(OrderStatus.CONFIRMED),
            OrderStatus.CONFIRMED, Set.of(OrderStatus.READY_FOR_PICKUP, OrderStatus.CANCELLED),
            OrderStatus.READY_FOR_PICKUP, Set.of(OrderStatus.COMPLETED)
    );

    public static final Set<OrderStatus> TERMINAL_ORDER_STATUSES = Set.of(
            OrderStatus.CANCELLED,
            OrderStatus.COMPLETED
    );
}
