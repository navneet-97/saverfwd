package com.saverfwd.backend.user.specification;

import com.saverfwd.backend.user.dto.UserFilterRequest;
import com.saverfwd.backend.user.entity.User;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public final class UserSpecification {

    private UserSpecification() {}

    public static Specification<User> filter(UserFilterRequest request){
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (request.id() != null){
                predicates.add(cb.equal(root.get("id"),request.id()));
            }

            if (request.fullName() != null && !request.fullName().isBlank()){
                predicates.add(cb.like(cb.lower(root.get("fullName")),
                        "%" + request.fullName().trim().toLowerCase() + "%")
                );
            }

            if (request.email() != null && !request.email().isBlank()){
                predicates.add(cb.like(cb.lower(root.get("email")),
                        "%" + request.email().trim().toLowerCase() + "%")
                );
            }

            if (request.phoneNumber() != null && !request.phoneNumber().isBlank()) {
                predicates.add(cb.like(root.get("phoneNumber"),
                        "%" + request.phoneNumber().trim() + "%")
                );
            }

            if (request.role() != null && !request.role().isBlank()){
                predicates.add(cb.equal(root.get("role"),request.role()));
            }

            if (request.accountStatus() != null && !request.accountStatus().isBlank()){
                predicates.add(cb.equal(root.get("accountStatus"),request.accountStatus()));
            }

            if(request.createdFrom() != null){
                predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"),request.createdFrom()));
            }

            if(request.createdTo() != null){
                predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"),request.createdTo()));
            }

            if(request.updatedFrom() != null){
                predicates.add(cb.greaterThanOrEqualTo(root.get("updatedAt"),request.updatedFrom()));
            }

            if(request.updatedTo() != null){
                predicates.add(cb.lessThanOrEqualTo(root.get("updatedAt"),request.updatedTo()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
