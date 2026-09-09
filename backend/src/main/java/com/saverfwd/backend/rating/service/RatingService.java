package com.saverfwd.backend.rating.service;

import com.saverfwd.backend.common.exception.ResourceNotFoundException;
import com.saverfwd.backend.common.mapper.Mapper;
import com.saverfwd.backend.common.response.PageResponse;
import com.saverfwd.backend.common.util.Common;
import com.saverfwd.backend.order.repository.OrderRepository;
import com.saverfwd.backend.rating.dto.PostRatingRequest;
import com.saverfwd.backend.rating.dto.RatingResponse;
import com.saverfwd.backend.rating.dto.RatingSearchFilter;
import com.saverfwd.backend.rating.dto.UpdateRatingRequest;
import com.saverfwd.backend.rating.entity.Rating;
import com.saverfwd.backend.rating.mapper.RatingMapper;
import com.saverfwd.backend.rating.repository.RatingRepository;
import com.saverfwd.backend.rating.specification.RatingSpecification;
import com.saverfwd.backend.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final OrderRepository orderRepository;
    private final RatingMapper ratingMapper;

    @Transactional
    public RatingResponse postRating(PostRatingRequest request){
        log.info("Posting rating service starts here");
        User user = Common.getCurrentUser();

        return orderRepository.findById(request.orderId()).map(order -> {
            Rating rating = ratingMapper.toRating(request);
            rating.setOrder(order);
            rating.setReviewer(user);
            rating.setReviewedUser(order.getFoodItem().getOwner());

            Rating savedRating = ratingRepository.save(rating);
            log.info("Saved rating with id {}", savedRating.getId());
            return ratingMapper.toRatingResponse(savedRating);
        }).orElseThrow(() -> {
            log.error("Posting rating service failed: Order ID {} not found", request.orderId());
            return new ResourceNotFoundException(String.format("Order with id: %s not found", request.orderId()));
        });
    }

    @Transactional(readOnly = true)
    public PageResponse<RatingResponse> getRatings(RatingSearchFilter filter, Pageable pageable){
        log.info("Getting ratings service starts here");
        Specification<Rating> spec = RatingSpecification.filter(filter);

        Pageable pageableWithoutSort = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize());
        Page<RatingResponse> page = ratingRepository.findAll(spec, pageableWithoutSort)
                .map(ratingMapper::toRatingResponse);

        log.info("Fetched ratings with filter {}", filter);
        return Mapper.toPageResponse(page);
    }

    public RatingResponse getRatingById(Long id) {
        log.info("Getting rating service starts here");
        return ratingRepository.findById(id)
                .map(ratingMapper::toRatingResponse)
                .orElseThrow(() -> {
                    log.error("Getting rating service failed: Rating with id {} not found", id);
                    return new ResourceNotFoundException(String.format("Rating with id: %s not found", id));
                });
    }

    @Transactional
    public RatingResponse updateRating(Long id, UpdateRatingRequest request) {
        log.info("Updating rating service starts here");
        return ratingRepository.findById(id).map(rating -> {
            if (request.ratingValue() != null) {
                rating.setRatingValue(request.ratingValue());
            }
            if (request.comment() != null && !request.comment().isBlank()) {
                rating.setComment(request.comment());
            }
            log.info("Updated rating with id {}", rating);
            return ratingMapper.toRatingResponse(rating);
        }).orElseThrow(() -> {
            log.error("Updating rating service failed: Rating ID {} not found", id);
            return new ResourceNotFoundException(String.format("Rating with id: %s not found", id));
        });
    }

    public void deleteRating(Long id) {
        log.info("Deleting rating service starts here");
        ratingRepository.deleteById(id);
        log.info("Deleted rating with id {}", id);
    }
}
