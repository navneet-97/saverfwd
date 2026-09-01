package com.saverfwd.backend.food.repository;

import com.saverfwd.backend.food.entity.FoodItem;
import org.jspecify.annotations.NullMarked;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface FoodRepository extends JpaRepository<FoodItem, Long>, JpaSpecificationExecutor<FoodItem> {
    @NullMarked Page<FoodItem> findAll(Specification<FoodItem> spec, Pageable pageable);
}
