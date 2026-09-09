package com.saverfwd.backend.food.service;

import com.saverfwd.backend.common.constant.StatusUpdateConstants;
import com.saverfwd.backend.common.exception.BusinessException;
import com.saverfwd.backend.common.exception.ResourceNotFoundException;
import com.saverfwd.backend.common.mapper.Mapper;
import com.saverfwd.backend.common.response.PageResponse;
import com.saverfwd.backend.common.util.Common;
import com.saverfwd.backend.food.dto.FoodFilterRequest;
import com.saverfwd.backend.food.dto.FoodResponse;
import com.saverfwd.backend.food.dto.CreateFoodRequest;
import com.saverfwd.backend.food.dto.UpdateFoodStatusRequest;
import com.saverfwd.backend.food.entity.FoodItem;
import com.saverfwd.backend.food.enums.FoodStatus;
import com.saverfwd.backend.food.mapper.FoodMapper;
import com.saverfwd.backend.food.repository.FoodRepository;
import com.saverfwd.backend.food.specification.FoodSpecification;
import com.saverfwd.backend.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class FoodService {

    private final FoodRepository foodRepository;
    private final FoodMapper foodMapper;

    @Transactional
    public FoodResponse addFoodItem(CreateFoodRequest request){
        log.info("Adding food item service starts here");
        FoodItem foodItem = foodMapper.toFoodItem(request);
        initializeForCreation(foodItem);

        FoodItem savedFoodItem = foodRepository.save(foodItem);
        log.info("Successfully added food item {}", savedFoodItem);
        return foodMapper.toFoodResponse(savedFoodItem);
    }

    @Transactional
    public List<FoodResponse> addBulkFood(List<CreateFoodRequest> requests){
        log.info("Adding bulk food service starts here");

        List<FoodItem> foodItems = requests.stream()
                .map(foodMapper::toFoodItem)
                .map(this::initializeForCreation)
                .toList();

        List<FoodItem> savedFoodItems = foodRepository.saveAll(foodItems);
        log.info("Successfully added food items {}", savedFoodItems);
        return savedFoodItems.stream()
                .map(foodMapper::toFoodResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public FoodResponse getFoodById(Long id){
        log.info("Getting food service starts here");
        FoodItem foodItem = getFoodItemEntity(id);
        log.info("Successfully found food item {}", foodItem);
        return foodMapper.toFoodResponse(foodItem);
    }

    @Transactional(readOnly = true)
    public PageResponse<FoodResponse> getAllFoodItems(FoodFilterRequest filter, Pageable pageable){
        log.info("Getting all food with filter service starts here");
        Specification<FoodItem> spec = FoodSpecification.filter(filter);

        Pageable pageableWithoutSort = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize());
        Page<FoodResponse> page = foodRepository.findAll(spec, pageableWithoutSort)
                .map(foodMapper::toFoodResponse);

        log.info("Successfully found food items {}", page.getContent());
        return Mapper.toPageResponse(page);
    }

    @Transactional
    public FoodResponse updateFoodItem(Long id, CreateFoodRequest request){
        log.info("Updating food item service starts here");
        FoodItem foodItem = getFoodItemEntity(id);
        if (!foodItem.getStatus().equals(FoodStatus.AVAILABLE)){
            log.error("Failed to update food item {}, status is {}", id, foodItem.getStatus());
            throw new BusinessException(String.format("Cannot update %s food item", foodItem.getStatus()));
        }
        assertOwner(foodItem);

        foodMapper.updateFoodItem(foodItem, request);
        log.info("Successfully updated food item {}", foodItem);
        return foodMapper.toFoodResponse(foodItem);
    }

    @Transactional
    public FoodResponse updateFoodItemStatus(Long id, UpdateFoodStatusRequest request){
        log.info("Updating food item status service starts here");
        FoodItem foodItem = getFoodItemEntity(id);
        FoodStatus foodStatus = request.foodStatus();
        validateStatusTransition(foodItem.getStatus(), foodStatus);

        if(foodStatus.equals(FoodStatus.CANCELLED)){
            assertOwner(foodItem);
        }

        foodItem.setStatus(foodStatus);
        log.info("Successfully updated food item status from {}: {}", foodItem.getStatus(), request.foodStatus());
        return foodMapper.toFoodResponse(foodItem);
    }

    @Transactional(readOnly = true)
    public PageResponse<FoodResponse> getMyListings(Pageable pageable) {
        User currentUser = Common.getCurrentUser();
        FoodFilterRequest foodFilterRequest = FoodFilterRequest.builder()
                .ownerId(currentUser.getId())
                .build();

        return getAllFoodItems(foodFilterRequest, pageable);
    }

    private void validateStatusTransition(FoodStatus current, FoodStatus target){
        log.info("Validating status transition from {} to {}", current, target);
        if (StatusUpdateConstants.TERMINAL_STATUSES.contains(current)) {
            log.error("food status transition terminal error");
            throw new BusinessException(String.format("%s food status cannot be modified!", current));
        }

        Set<FoodStatus> allowed = StatusUpdateConstants.ALLOWED_TRANSITIONS.getOrDefault(current, Set.of());
        if (!allowed.contains(target)) {
            log.error("Order status transition allowed error");
            throw new BusinessException(String.format("Cannot change food from status %s to %s",current, target));
        }
    }

    private FoodItem getFoodItemEntity(Long id){
        return foodRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Food item entity not found with id {}", id);
                    return new ResourceNotFoundException(String.format("Food Item Not Found with id: %s",id));
                });
    }

    private void assertOwner(FoodItem foodItem){
        User currentUser = Common.getCurrentUser();
        if (!Objects.equals(foodItem.getOwner().getId(), currentUser.getId())){
            log.error("Order status transition owner error");
            throw new BusinessException("You are not authorized to modify this food item.");
        }
    }
    private FoodItem initializeForCreation(FoodItem foodItem){
        User currentUser = Common.getCurrentUser();
        foodItem.setOwner(currentUser);
        foodItem.setStatus(FoodStatus.AVAILABLE);
        return foodItem;
    }
}
