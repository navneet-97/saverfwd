package com.saverfwd.backend.order.service;

import com.saverfwd.backend.common.constant.StatusUpdateConstants;
import com.saverfwd.backend.common.exception.BusinessException;
import com.saverfwd.backend.common.exception.ResourceNotFoundException;
import com.saverfwd.backend.common.mapper.Mapper;
import com.saverfwd.backend.common.response.PageResponse;
import com.saverfwd.backend.common.util.Common;
import com.saverfwd.backend.food.enums.ListingType;
import com.saverfwd.backend.food.repository.FoodRepository;
import com.saverfwd.backend.order.dto.OrderFoodRequest;
import com.saverfwd.backend.order.dto.OrderSearchFilter;
import com.saverfwd.backend.order.entity.Order;
import com.saverfwd.backend.order.enums.OrderStatus;
import com.saverfwd.backend.order.mapper.OrderMapper;
import com.saverfwd.backend.order.repository.OrderRepository;
import com.saverfwd.backend.order.response.OrderResponse;
import com.saverfwd.backend.order.specification.OrderSpecification;
import com.saverfwd.backend.user.entity.User;
import com.saverfwd.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Objects;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final FoodRepository foodRepository;
    private final OrderMapper orderMapper;

    @Transactional
    public OrderResponse orderFood(OrderFoodRequest request) {
        User currentUser = Common.getCurrentUser();

        return foodRepository.findById(request.foodItemId()).map(
                foodItem -> {
                    if (request.quantity().compareTo(foodItem.getQuantity())>0){
                        throw new BusinessException("Such quantity is not available");
                    }
                    BigDecimal unitPrice;
                    BigDecimal totalAmount;
                    if(foodItem.getListingType().equals(ListingType.DONATION)){
                        unitPrice=BigDecimal.ZERO;
                        totalAmount=BigDecimal.ZERO;
                    }else{
                        unitPrice=foodItem.getPrice().divide(foodItem.getQuantity(), 2, RoundingMode.HALF_UP);
                        totalAmount=unitPrice.multiply(request.quantity()).setScale(2, RoundingMode.HALF_UP);
                    }

                    Order newOrder = orderMapper.toOrder(request);
                    newOrder.setFoodItem(foodItem);
                    newOrder.setCustomer(currentUser);
                    newOrder.setStatus(OrderStatus.PENDING);
                    newOrder.setTotalAmount(totalAmount);
                    newOrder.setUnitPrice(unitPrice);
                    Order savedOrder = orderRepository.save(newOrder);

                    foodItem.setQuantity(foodItem.getQuantity().subtract(request.quantity()));
                    return orderMapper.toOrderResponse(savedOrder);
                }
        ).orElseThrow(() -> new ResourceNotFoundException(String.format("FoodItem with id: %s not found", request.foodItemId())));
    }

    @Transactional(readOnly = true)
    public PageResponse<OrderResponse> getOrders(OrderSearchFilter filter, Pageable pageable){
        Specification<Order> spec = OrderSpecification.filter(filter);

        Pageable pageableWithoutSort = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize());
        Page<OrderResponse> page = orderRepository.findAll(spec, pageableWithoutSort)
                .map(orderMapper::toOrderResponse);

        return Mapper.toPageResponse(page);
    }

    public OrderResponse getOrderByOrderId(Long orderId){
        return orderRepository.findById(orderId)
                .map(orderMapper::toOrderResponse)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Order with id: %s not found",orderId)));
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus status) {
        return orderRepository.findById(orderId).map(order -> {
            validateStatusTransition(order.getStatus(), status);
            if (status.equals(OrderStatus.CANCELLED)){
                assertOwner(order);
            }

            order.setStatus(status);
            return orderMapper.toOrderResponse(order);
        }).orElseThrow(()->new ResourceNotFoundException(String.format("Order with id: %s not found", orderId)));
    }

    private void validateStatusTransition(OrderStatus current, OrderStatus target){
        if (StatusUpdateConstants.TERMINAL_ORDER_STATUSES.contains(current)) {
            throw new BusinessException(String.format("Order status: %s cannot be modified", current));
        }

        Set<OrderStatus> allowed = StatusUpdateConstants.ALLOWED_ORDER_TRANSITIONS.getOrDefault(current, Set.of());
        if (!allowed.contains(target)) {
            throw new BusinessException(String.format("Cannot change order status from %s to %s", current, target));
        }
    }

    private void assertOwner(Order order){
        User currentUser = Common.getCurrentUser();
        if (!Objects.equals(currentUser.getId(), order.getCustomer().getId())) {
            throw new BusinessException("You are not authorized to modify this order");
        }
    }
}
