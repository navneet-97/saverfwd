package com.saverfwd.backend.order.entity;

import com.saverfwd.backend.common.entity.BaseEntity;
import com.saverfwd.backend.food.entity.FoodItem;
import com.saverfwd.backend.order.enums.OrderStatus;
import com.saverfwd.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "orders")
@Builder
public class Order extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    private FoodItem foodItem;

    @Column(nullable = false)
    private User customer;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal quantity;

    @Column(precision = 12, scale = 2)
    private BigDecimal unitPrice;

    @Column(nullable = false)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    @Column(nullable = false)
    private LocalDateTime cancelledAt;

    @Column(nullable = false)
    private LocalDateTime completedAt;
}
