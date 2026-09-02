package com.saverfwd.backend.rating.repository;

import com.saverfwd.backend.rating.entity.Rating;
import org.jspecify.annotations.NullMarked;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long>, JpaSpecificationExecutor<Rating> {
    @NullMarked
    Page<Rating> findAll(Specification<Rating> spec, Pageable pageable);
}
