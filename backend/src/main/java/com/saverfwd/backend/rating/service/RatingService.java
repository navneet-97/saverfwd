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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final OrderRepository orderRepository;
    private final RatingMapper ratingMapper;

    @Transactional
    public RatingResponse postRating(PostRatingRequest request){
        User user = Common.getCurrentUser();

        return orderRepository.findById(request.orderId()).map(order -> {
            Rating rating = ratingMapper.toRating(request);
            rating.setOrder(order);
            rating.setReviewer(user);
            rating.setReviewedUser(order.getFoodItem().getOwner());

            Rating savedRating = ratingRepository.save(rating);
            return ratingMapper.toRatingResponse(savedRating);
        }).orElseThrow(() -> new ResourceNotFoundException(String.format("Order with id: %s not found", request.orderId())));
    }

    @Transactional(readOnly = true)
    public PageResponse<RatingResponse> getRatings(RatingSearchFilter filter, Pageable pageable){
        Specification<Rating> spec = RatingSpecification.filter(filter);

        Pageable pageableWithoutSort = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize());
        Page<RatingResponse> page = ratingRepository.findAll(spec, pageableWithoutSort)
                .map(ratingMapper::toRatingResponse);

        return Mapper.toPageResponse(page);
    }

    public RatingResponse getRatingById(Long id) {
        return ratingRepository.findById(id)
                .map(ratingMapper::toRatingResponse)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Rating with id: %s not found", id)));
    }

    @Transactional
    public RatingResponse updateRating(Long id, UpdateRatingRequest request) {
        return ratingRepository.findById(id).map(rating -> {
            if (request.ratingValue() != null) {
                rating.setRatingValue(request.ratingValue());
            }
            if (request.comment() != null && !request.comment().isBlank()) {
                rating.setComment(request.comment());
            }
            return ratingMapper.toRatingResponse(rating);
        }).orElseThrow(() -> new ResourceNotFoundException(String.format("Rating with id: %s not found", id)));
    }

    public void deleteRating(Long id) {
        ratingRepository.deleteById(id);
    }
}
