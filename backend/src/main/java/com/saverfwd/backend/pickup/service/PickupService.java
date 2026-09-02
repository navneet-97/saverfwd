package com.saverfwd.backend.pickup.service;

import com.saverfwd.backend.common.exception.ResourceNotFoundException;
import com.saverfwd.backend.order.repository.OrderRepository;
import com.saverfwd.backend.pickup.dto.CreatePickupRequest;
import com.saverfwd.backend.pickup.dto.PickupResponse;
import com.saverfwd.backend.pickup.entity.Pickup;
import com.saverfwd.backend.pickup.entity.PickupStatus;
import com.saverfwd.backend.pickup.mapper.PickupMapper;
import com.saverfwd.backend.pickup.repository.PickupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PickupService {

    private final PickupRepository pickupRepository;
    private final OrderRepository orderRepository;
    private final PickupMapper pickupMapper;

    @Transactional
    public PickupResponse createPickup(CreatePickupRequest request) {
        return orderRepository.findById(request.orderId()).map(order -> {
            Pickup pickup = pickupMapper.toPickup(request);
            pickup.setOrder(order);
            pickup.setStatus(PickupStatus.SCHEDULED);

            Pickup savedPickup = pickupRepository.save(pickup);
            return pickupMapper.toPickupResponse(savedPickup);
        }).orElseThrow(() -> new ResourceNotFoundException(String.format("Pickup with id %s not found!", request.orderId())));
    }
}
