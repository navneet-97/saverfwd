package com.saverfwd.backend.order.mapper;

import com.saverfwd.backend.order.dto.OrderFoodRequest;
import com.saverfwd.backend.order.entity.Order;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OrderMapper {

    Order toOrder(OrderFoodRequest request);
}
