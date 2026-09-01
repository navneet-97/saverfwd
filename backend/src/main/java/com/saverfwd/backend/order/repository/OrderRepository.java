package com.saverfwd.backend.order.repository;

import com.saverfwd.backend.order.entity.Order;
import com.saverfwd.backend.order.enums.OrderStatus;
import org.jspecify.annotations.NullMarked;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order> {
    @NullMarked Page<Order> findAll(Specification<Order> spec, Pageable pageable);

    List<Order> findByCustomerIdAndStatus(Long userId, OrderStatus status);
}
