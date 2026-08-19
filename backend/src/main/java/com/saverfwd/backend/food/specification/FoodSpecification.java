package com.saverfwd.backend.food.specification;

import com.saverfwd.backend.food.dto.FoodFilterRequest;
import com.saverfwd.backend.food.entity.FoodItem;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public final class FoodSpecification {
    private FoodSpecification(){}

    public static Specification<FoodItem> filter(FoodFilterRequest request) {
        return (root, query, cb)->{
            List<Predicate> predicates = new ArrayList<>();

            if (request.ownerId() != null){
                predicates.add(cb.equal(root.get("owner").get("id"), request.ownerId()));
            }

            if (request.title() != null && !request.title().isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("title")),
                        "%" + request.title().trim().toLowerCase() + "%")
                );
            }

            if (request.foodType() != null){
                predicates.add(cb.equal(root.get("foodType"), request.foodType()));
            }

            if (request.listingType() != null){
                predicates.add(cb.equal(root.get("listingType"), request.listingType()));
            }

            if (request.status() != null){
                predicates.add(cb.equal(root.get("status"), request.status()));
            }

            if(request.minQuantity() != null){
                predicates.add(cb.greaterThanOrEqualTo(root.get("quantity"), request.minQuantity()));
            }

            if(request.maxQuantity() != null){
                predicates.add(cb.lessThanOrEqualTo(root.get("quantity"), request.maxQuantity()));
            }

            if (request.minPrice() != null){
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), request.minPrice()));
            }

            if(request.maxPrice() != null){
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), request.maxPrice()));
            }

            if (request.expiryFrom() != null){
                predicates.add(cb.greaterThanOrEqualTo(root.get("expiryTime"), request.expiryFrom()));
            }

            if (request.expiryTo() != null){
                predicates.add(cb.lessThanOrEqualTo(root.get("expiryTime"), request.expiryTo()));
            }

            if(request.pickupStartFrom() != null){
                predicates.add(cb.greaterThanOrEqualTo(root.get("pickupStartTime"), request.pickupStartFrom()));
            }

            if (request.pickupStartTo() != null){
                predicates.add(cb.lessThanOrEqualTo(root.get("pickupStartTime"), request.pickupStartTo()));
            }

            if(request.pickupEndFrom() != null){
                predicates.add(cb.greaterThanOrEqualTo(root.get("pickupEndTime"), request.pickupEndFrom()));
            }

            if(request.pickupEndTo() != null){
                predicates.add(cb.lessThanOrEqualTo(root.get("pickupEndTime"), request.pickupEndTo()));
            }

            if (request.latitude() != null && request.longitude() != null && request.radiusKm() != null){
                double lat = request.latitude().doubleValue();
                double lng = request.longitude().doubleValue();
                double rad = request.radiusKm();

                double latDelta = rad / 111.0;
                double lngDelta = lng / (111.0*Math.cos(Math.toRadians(lat)));

                predicates.add(cb.between(
                        root.get("latitude"),
                        BigDecimal.valueOf(lat-latDelta),
                        BigDecimal.valueOf(lat+latDelta)
                ));

                predicates.add(cb.between(
                        root.get("longitude"),
                        BigDecimal.valueOf(lng-lngDelta),
                        BigDecimal.valueOf(lng+lngDelta)
                ));
            }

            if (request.pickupAddress() != null && !request.pickupAddress().isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("pickupAddress")),
                        "%" + request.pickupAddress().trim().toLowerCase() + "%")
                );
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
