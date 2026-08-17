package com.saverfwd.backend.food.service;

import com.saverfwd.backend.auth.service.AuthService;
import com.saverfwd.backend.food.dto.FoodResponse;
import com.saverfwd.backend.food.dto.CreateFoodRequest;
import com.saverfwd.backend.food.entity.FoodItem;
import com.saverfwd.backend.food.enums.FoodStatus;
import com.saverfwd.backend.food.mapper.FoodMapper;
import com.saverfwd.backend.food.repository.FoodRepository;
import com.saverfwd.backend.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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

    private FoodItem initializeFoodItem(FoodItem foodItem, User currentUser){
        foodItem.setOwner(currentUser);
        foodItem.setStatus(FoodStatus.AVAILABLE);
        return foodItem;
    }
}
