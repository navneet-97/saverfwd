package com.saverfwd.backend.notification.specification;

import com.saverfwd.backend.notification.dto.NotificationSearchFilter;
import com.saverfwd.backend.notification.entity.Notification;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public final class NotificationSpecification {
    private NotificationSpecification() {}

    public static Specification<Notification> filter(NotificationSearchFilter filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter.userId() != null) {
                predicates.add(cb.equal(root.get("user").get("id"), filter.userId()));
            }

            if (filter.read() != null) {
                predicates.add(cb.equal(root.get("read"), filter.read()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
