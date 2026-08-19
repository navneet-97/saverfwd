package com.saverfwd.backend.user.service;

import com.saverfwd.backend.common.mapper.Mapper;
import com.saverfwd.backend.common.response.ApiResponse;
import com.saverfwd.backend.common.response.PageResponse;
import com.saverfwd.backend.user.dto.UserFilterRequest;
import com.saverfwd.backend.user.dto.UserResponse;
import com.saverfwd.backend.user.entity.User;
import com.saverfwd.backend.user.mapper.UserMapper;
import com.saverfwd.backend.user.repository.UserRepository;
import com.saverfwd.backend.user.specification.UserSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Transactional(readOnly = true)
    public PageResponse<UserResponse> getUsers(UserFilterRequest filter, Pageable pageable) {
        Specification<User> spec = UserSpecification.filter(filter);

        Page<UserResponse> page = userRepository.findAll(spec, pageable)
                .map(userMapper::toUserResponse);

        return Mapper.toPageResponse(page);
    }

    public ApiResponse<Void> deleteUser(Long userId) {
        userRepository.deleteById(userId);
        return Mapper.toApiResponse("User Deleted", null);
    }
}
