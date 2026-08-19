package com.saverfwd.backend.food.mapper;

import com.saverfwd.backend.food.dto.FoodResponse;
import com.saverfwd.backend.food.dto.CreateFoodRequest;
import com.saverfwd.backend.food.entity.FoodItem;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface FoodMapper {

    @Mapping(target = "title", expression = "java(request.title().trim())")
    FoodItem toFoodItem(CreateFoodRequest request);

    @Mapping(target = "ownerId", source = "owner.id")
    FoodResponse toFoodResponse(FoodItem foodItem);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateFoodItem(@MappingTarget FoodItem foodItem, CreateFoodRequest request);
}
