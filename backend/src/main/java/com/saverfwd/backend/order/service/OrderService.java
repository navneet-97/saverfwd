package com.saverfwd.backend.order.service;

import com.saverfwd.backend.common.exception.ResourceNotFoundException;
import com.saverfwd.backend.common.mapper.Mapper;
import com.saverfwd.backend.common.response.ApiResponse;
import com.saverfwd.backend.common.response.PageResponse;
import com.saverfwd.backend.common.util.Common;
import com.saverfwd.backend.food.entity.FoodItem;
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
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.MathContext;

@Service
@RequiredArgsConstructor
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final FoodRepository foodRepository;
    private final OrderMapper orderMapper;
    
    @Transactional
    public ApiResponse<OrderResponse> orderFood(OrderFoodRequest request) {
        User currentUser = Common.getCurrentUser();

        return foodRepository.findById(request.foodItem().getId()).map(
                foodItem -> {
                    if (request.quantity().compareTo(foodItem.getQuantity())>0){
                        throw new IllegalArgumentException("Such quantity is not available");
                    }
                    BigDecimal unitPrice = foodItem.getPrice().divide(request.quantity(), MathContext.DECIMAL32);
                    BigDecimal totalAmount = getTotalAmount(foodItem, unitPrice, request);

                    Order newOrder = orderMapper.toOrder(request);
                    newOrder.setCustomer(currentUser);
                    newOrder.setStatus(OrderStatus.PENDING);
                    newOrder.setTotalAmount(totalAmount);
                    newOrder.setUnitPrice(unitPrice);
                    Order savedOrder = orderRepository.save(newOrder);

                    foodItem.setQuantity(foodItem.getQuantity().subtract(request.quantity()));
                    foodRepository.save(foodItem);
                    OrderResponse res = orderMapper.toOrderResponse(savedOrder);
                    return Mapper.toApiResponse("Order created successfully!", res);
                }
        ).orElseThrow(() -> new ResourceNotFoundException(String.format("FoodItem with %s does not exist", request.foodItem().getId())));
    }

    @Transactional(readOnly = true)
    public PageResponse<OrderResponse> getOrders(OrderSearchFilter filter, Pageable pageable){
        Specification<Order> spec = OrderSpecification.filter(filter);

        Pageable pageableWithoutSort = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize());
        Page<OrderResponse> page = orderRepository.findAll(spec, pageableWithoutSort)
                .map(orderMapper::toOrderResponse);

        return Mapper.toPageResponse(page);
    }

    private BigDecimal getTotalAmount(FoodItem foodItem, BigDecimal unitPrice, OrderFoodRequest request) {
        if (foodItem.getListingType() == ListingType.SALE) {
            return request.quantity().multiply(unitPrice);
        } else {
            return BigDecimal.ZERO;
        }
    }
}
