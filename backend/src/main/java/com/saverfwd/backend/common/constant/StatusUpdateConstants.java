package com.saverfwd.backend.common.constant;

import com.saverfwd.backend.food.enums.FoodStatus;

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
}
