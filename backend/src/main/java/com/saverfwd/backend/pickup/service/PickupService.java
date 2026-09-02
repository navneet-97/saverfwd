package com.saverfwd.backend.pickup.service;

import com.saverfwd.backend.common.constant.StatusUpdateConstants;
import com.saverfwd.backend.common.exception.BusinessException;
import com.saverfwd.backend.common.exception.ResourceNotFoundException;
import com.saverfwd.backend.order.repository.OrderRepository;
import com.saverfwd.backend.pickup.dto.CreatePickupRequest;
import com.saverfwd.backend.pickup.dto.PickupResponse;
import com.saverfwd.backend.pickup.dto.UpdatePickupRequest;
import com.saverfwd.backend.pickup.entity.Pickup;
import com.saverfwd.backend.pickup.entity.PickupStatus;
import com.saverfwd.backend.pickup.mapper.PickupMapper;
import com.saverfwd.backend.pickup.repository.PickupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

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
        }).orElseThrow(() -> new ResourceNotFoundException(String.format("Order with id: %s not found!", request.orderId())));
    }

    @Transactional
    public PickupResponse updatePickup(Long pickupId, UpdatePickupRequest request) {
        return pickupRepository.findById(pickupId).map(pickup -> {
            if (request.pickedUpAt() != null && request.pickedUpAt().isAfter(pickup.getScheduledTime())) {
                pickup.setPickedUpAt(request.pickedUpAt());
            }

            if (request.pickupNotes() != null && !request.pickupNotes().isBlank()) {
                pickup.setPickupNotes(request.pickupNotes());
            }

            if (request.status() != null){
                validateTransitions(pickup.getStatus(), request.status());
                pickup.setStatus(request.status());
            }
            return pickupMapper.toPickupResponse(pickup);
        }).orElseThrow(() -> new ResourceNotFoundException(String.format("Pickup with id: %s not found", pickupId)));
    }

    private void validateTransitions(PickupStatus current, PickupStatus target) {
        if (StatusUpdateConstants.TERMINAL_PICKUP_STATUSES.contains(current)) {
            throw new BusinessException(String.format("%s Pickup status cannot be changed!", current));
        }

        Set<PickupStatus> allowed = StatusUpdateConstants.ALLOWED_PICKUP_TRANSITIONS.getOrDefault(current, Set.of());
        if (!allowed.contains(target)) {
            throw new BusinessException(String.format("Cannot change Pickup status from %s to %s", current, target));
        }
    }
}
