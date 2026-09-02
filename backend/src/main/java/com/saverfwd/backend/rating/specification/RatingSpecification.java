package com.saverfwd.backend.rating.specification;

import com.saverfwd.backend.rating.dto.RatingSearchFilter;
import com.saverfwd.backend.rating.entity.Rating;
import jakarta.persistence.criteria.Order;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public final class RatingSpecification {
    private RatingSpecification() {}

    public static Specification<Rating> filter(RatingSearchFilter filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            List<Order> orders = new ArrayList<>();

            if (filter.orderId() != null) {
                predicates.add(cb.equal(root.get("order").get("id"), filter.orderId()));
            }

            if (filter.reviewerId() != null) {
                predicates.add(cb.equal(root.get("reviewer").get("id"), filter.reviewerId()));
            }

            if (filter.reviewedUserId() != null) {
                predicates.add(cb.equal(root.get("reviewedUser").get("id"), filter.reviewedUserId()));
            }

            if (filter.ratingValue() != null) {
                predicates.add(cb.equal(root.get("ratingValue"), filter.ratingValue()));
            }

            if (filter.sort() != null && !filter.sort().isBlank() && filter.sort().equals("ratingValue")) {
                if (Boolean.TRUE.equals(filter.asc())) {
                    orders.add(cb.asc(root.get("ratingValue")));
                } else {
                    orders.add(cb.desc(root.get("ratingValue")));
                }
            }

            query.orderBy(orders);
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
