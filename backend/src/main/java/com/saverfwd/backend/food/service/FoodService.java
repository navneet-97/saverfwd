package com.saverfwd.backend.food.service;

import com.saverfwd.backend.auth.service.AuthService;
import com.saverfwd.backend.common.exception.ResourceNotFoundException;
import com.saverfwd.backend.common.mapper.Mapper;
import com.saverfwd.backend.common.response.PageResponse;
import com.saverfwd.backend.food.dto.FoodFilterRequest;
import com.saverfwd.backend.food.dto.FoodResponse;
import com.saverfwd.backend.food.dto.CreateFoodRequest;
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
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FoodService {

    private final FoodRepository foodRepository;
    private final FoodMapper foodMapper;
    private final AuthService authService;

    @Transactional
    public FoodResponse addFoodItem(CreateFoodRequest request){
        User currentUser = authService.getUser();

        FoodItem foodItem = foodMapper.toFoodItem(request);
        initializeFoodItem(foodItem, currentUser);

        FoodItem savedFoodItem = foodRepository.save(foodItem);
        return foodMapper.toFoodResponse(savedFoodItem);
    }

    @Transactional
    public List<FoodResponse> addBulkFood(List<CreateFoodRequest> requests){
        User currentUser = authService.getUser();

        List<FoodItem> foodItems = requests.stream()
                .map(foodMapper::toFoodItem)
                .map(foodItem -> initializeFoodItem(foodItem, currentUser))
                .toList();

        List<FoodItem> savedFoodItems = foodRepository.saveAll(foodItems);
        return savedFoodItems.stream()
                .map(foodMapper::toFoodResponse)
                .toList();
    }

    @Transactional
    public FoodResponse getFoodById(Long id){
        FoodItem foodItem = foodRepository.findById(id)
                .orElseThrow(()->new ResourceNotFoundException(String.format("Food Item Not Found with id: %s",id)));

        return foodMapper.toFoodResponse(foodItem);
    }

    @Transactional
    public PageResponse<FoodResponse> getAllFoodItems(FoodFilterRequest filter, Pageable pageable){
        Specification<FoodItem> spec = FoodSpecification.filter(filter);
        Page<FoodResponse> page = foodRepository.findAll(spec, pageable)
                .map(foodMapper::toFoodResponse);

        return Mapper.toPageResponse(page);
    }

    private FoodItem initializeFoodItem(FoodItem foodItem, User currentUser){
        foodItem.setOwner(currentUser);
        foodItem.setStatus(FoodStatus.AVAILABLE);
        return foodItem;
    }
}
