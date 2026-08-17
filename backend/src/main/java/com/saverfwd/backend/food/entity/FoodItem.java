package com.saverfwd.backend.food.entity;

import com.saverfwd.backend.common.entity.BaseEntity;
import com.saverfwd.backend.food.enums.FoodStatus;
import com.saverfwd.backend.food.enums.FoodType;
import com.saverfwd.backend.food.enums.ListingType;
import com.saverfwd.backend.food.enums.Unit;
import com.saverfwd.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "food_items")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FoodItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User owner;

    @Column(nullable = false, length = 50)
    private String title;

    @Column(length = 400)
    private String description;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal quantity;

    @Column(precision = 12, scale = 2)
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FoodType foodType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ListingType listingType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Unit unit;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FoodStatus status;

    @Column(nullable = false)
    private LocalDateTime expiryTime;

    @Column(nullable = false)
    private LocalDateTime pickupStartTime;

    @Column(nullable = false)
    private LocalDateTime pickupEndTime;

    @Column(nullable = false, length = 400)
    private String pickupAddress;

    @Column(precision = 10, scale = 7)
    private BigDecimal latitude;

    @Column(precision = 10, scale = 7)
    private BigDecimal longitude;}
