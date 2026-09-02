package com.saverfwd.backend.pickup.mapper;

import com.saverfwd.backend.pickup.dto.CreatePickupRequest;
import com.saverfwd.backend.pickup.dto.PickupResponse;
import com.saverfwd.backend.pickup.entity.Pickup;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PickupMapper {
    Pickup toPickup(CreatePickupRequest request);

    @Mapping(target = "orderId", source = "order.id")
    PickupResponse toPickupResponse(Pickup pickup);
}
