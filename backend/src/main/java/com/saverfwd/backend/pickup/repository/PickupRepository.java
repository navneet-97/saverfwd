package com.saverfwd.backend.pickup.repository;

import com.saverfwd.backend.pickup.entity.Pickup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PickupRepository extends JpaRepository<Pickup, Long> {
}
