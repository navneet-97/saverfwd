package com.saverfwd.backend.order.specification;

import com.saverfwd.backend.order.dto.OrderSearchFilter;
import com.saverfwd.backend.order.entity.Order;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public final class OrderSpecification {
    private OrderSpecification() {}

    public static Specification<Order> filter(OrderSearchFilter filter){
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            List<jakarta.persistence.criteria.Order> orders = new ArrayList<>();

            if (filter.createdBy() != null) {
                predicates.add(cb.equal(root.get("customer").get("id"), filter.createdBy()));
            }

            if (filter.status() != null) {
                predicates.add(cb.equal(root.get("status"), filter.status()));
            }

            if (filter.minAmount() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("totalAmount"),filter.minAmount()));
            }

            if (filter.maxAmount() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("totalAmount"), filter.maxAmount()));
            }

            if (filter.minQuantity() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("quantity"), filter.minQuantity()));
            }

            if (filter.maxQuantity() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("quantity"), filter.maxQuantity()));
            }

            if (filter.sort() != null && !filter.sort().isBlank() && ALLOWED_SORTS.contains(filter.sort())) {
                if (Boolean.TRUE.equals(filter.asc())) {
                    orders.add(cb.asc(root.get(filter.sort())));
                }else{
                    orders.add(cb.desc(root.get(filter.sort())));
                }
            }

            query.orderBy(orders);
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private static final Set<String> ALLOWED_SORTS = Set.of(
            "totalAmount",
            "quantity"
    );
}
