package com.saverfwd.backend.rating.entity;

import com.saverfwd.backend.common.entity.BaseEntity;
import com.saverfwd.backend.order.entity.Order;
import com.saverfwd.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(
        name = "ratings",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_rating_order_reviewer",
                        columnNames = {"order_id", "reviewer_id"}
                )
        }
)
public class Rating extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_id", nullable = false)
    private User reviewer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_user_id", nullable = false)
    private User reviewedUser;

    @Column(nullable = false)
    private Integer ratingValue;

    @Column(length = 500)
    private String comment;
}
