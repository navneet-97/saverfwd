package com.saverfwd.backend.user.mapper;

import com.saverfwd.backend.auth.dtos.UserRegisterRequest;
import com.saverfwd.backend.user.dto.UserResponse;
import com.saverfwd.backend.user.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "role", constant = "USER")
    @Mapping(target = "accountStatus", constant = "ACTIVE")
    @Mapping(target = "email", expression = "java(request.email().toLowerCase())")
    User toUser(UserRegisterRequest request);

    UserResponse toUserResponse(User user);
}
