package com.saverfwd.backend.food.service;

import com.saverfwd.backend.auth.service.AuthService;
import com.saverfwd.backend.common.exception.BusinessException;
import com.saverfwd.backend.common.exception.ResourceNotFoundException;
import com.saverfwd.backend.common.mapper.Mapper;
import com.saverfwd.backend.common.response.PageResponse;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class FoodService {

    private final FoodRepository foodRepository;
    private final FoodMapper foodMapper;
    private final AuthService authService;

    @Transactional
    public FoodResponse addFoodItem(CreateFoodRequest request){
        FoodItem foodItem = foodMapper.toFoodItem(request);
        initializeForCreation(foodItem);

        FoodItem savedFoodItem = foodRepository.save(foodItem);
        return foodMapper.toFoodResponse(savedFoodItem);
    }

    @Transactional
    public List<FoodResponse> addBulkFood(List<CreateFoodRequest> requests){

        List<FoodItem> foodItems = requests.stream()
                .map(foodMapper::toFoodItem)
                .map(this::initializeForCreation)
                .toList();

        List<FoodItem> savedFoodItems = foodRepository.saveAll(foodItems);
        return savedFoodItems.stream()
                .map(foodMapper::toFoodResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public FoodResponse getFoodById(Long id){
        FoodItem foodItem = getFoodItemEntity(id);
        return foodMapper.toFoodResponse(foodItem);
    }

    @Transactional(readOnly = true)
    public PageResponse<FoodResponse> getAllFoodItems(FoodFilterRequest filter, Pageable pageable){
        Specification<FoodItem> spec = FoodSpecification.filter(filter);
        Page<FoodResponse> page = foodRepository.findAll(spec, pageable)
                .map(foodMapper::toFoodResponse);

        return Mapper.toPageResponse(page);
    }

    @Transactional
    public FoodResponse updateFoodItem(Long id, CreateFoodRequest request){
        FoodItem foodItem = getFoodItemEntity(id);
        if (!foodItem.getStatus().equals(FoodStatus.AVAILABLE)){
            throw new BusinessException(String.format("Cannot update %s food item", foodItem.getStatus()));
        }
        assertOwner(foodItem);

        foodMapper.updateFoodItem(foodItem, request);
        return foodMapper.toFoodResponse(foodItem);
    }

    @Transactional
    public FoodResponse updateFoodItemStatus(Long id, UpdateFoodStatusRequest request){
        FoodItem foodItem = getFoodItemEntity(id);
        FoodStatus foodStatus = request.foodStatus();
        validateStatusTransition(foodItem.getStatus(), foodStatus);

        if(foodStatus.equals(FoodStatus.CANCELLED)){
            assertOwner(foodItem);
        }

        foodItem.setStatus(foodStatus);
        return foodMapper.toFoodResponse(foodItem);
    }

    @Transactional(readOnly = true)
    public PageResponse<FoodResponse> getMyListings(Pageable pageable) {
        User currentUser = getCurrentUser();
        FoodFilterRequest foodFilterRequest = FoodFilterRequest.builder()
                .ownerId(currentUser.getId())
                .build();

        return getAllFoodItems(foodFilterRequest, pageable);
    }

    private static final Map<FoodStatus, Set<FoodStatus>> ALLOWED_TRANSITIONS = Map.of(
            FoodStatus.AVAILABLE, Set.of(FoodStatus.RESERVED, FoodStatus.CANCELLED),
            FoodStatus.RESERVED, Set.of(FoodStatus.SOLD, FoodStatus.CLAIMED)
    );

    private static final Set<FoodStatus> TERMINAL_STATUSES = Set.of(
            FoodStatus.SOLD,
            FoodStatus.CLAIMED,
            FoodStatus.CANCELLED,
            FoodStatus.EXPIRED
    );

    private void validateStatusTransition(FoodStatus current, FoodStatus target){
        if (TERMINAL_STATUSES.contains(current)) {
            throw new BusinessException(String.format("%s food status cannot be modified!", current));
        }

        Set<FoodStatus> allowed = ALLOWED_TRANSITIONS.getOrDefault(current, Set.of());
        if (!allowed.contains(target)) {
            throw new BusinessException(String.format("Cannot change food from status %s to %s",current, target));
        }
    }

    private User getCurrentUser(){
        return authService.getUser();
    }

    private FoodItem getFoodItemEntity(Long id){
        return foodRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Food Item Not Found with id: %s",id)));
    }

    private void assertOwner(FoodItem foodItem){
        User currentUser = getCurrentUser();
        if (!Objects.equals(foodItem.getOwner().getId(), currentUser.getId())){
            throw new BusinessException("You are not authorized to modify this food item.");
        }
    }
    private FoodItem initializeForCreation(FoodItem foodItem){
        User currentUser = getCurrentUser();
        foodItem.setOwner(currentUser);
        foodItem.setStatus(FoodStatus.AVAILABLE);
        return foodItem;
    }
}
