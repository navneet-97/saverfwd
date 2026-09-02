package com.saverfwd.backend.pickup.entity;

import com.saverfwd.backend.common.entity.BaseEntity;
import com.saverfwd.backend.order.entity.Order;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "pickups")
public class Pickup extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(nullable = false)
    private LocalDateTime scheduledTime;

    private LocalDateTime pickedUpAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PickupStatus status;

    private String pickupNotes;
}
