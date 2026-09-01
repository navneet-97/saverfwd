package com.saverfwd.backend.order.mapper;

import com.saverfwd.backend.food.dto.FoodResponse;
import com.saverfwd.backend.food.entity.FoodItem;
import com.saverfwd.backend.order.dto.OrderFoodRequest;
import com.saverfwd.backend.order.entity.Order;
import com.saverfwd.backend.order.response.OrderResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OrderMapper {

    Order toOrder(OrderFoodRequest request);

    @Mapping(target = "createdBy", source = "customer.fullName")
    OrderResponse toOrderResponse(Order order);

    @Mapping(target = "ownerId", source = "owner.id")
    FoodResponse toFoodResponse(FoodItem foodItem);
}
