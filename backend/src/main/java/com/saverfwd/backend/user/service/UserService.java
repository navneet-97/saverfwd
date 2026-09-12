package com.saverfwd.backend.user.service;

import com.saverfwd.backend.common.exception.ResourceNotFoundException;
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
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Transactional(readOnly = true)
    public PageResponse<UserResponse> getUsers(UserFilterRequest filter, Pageable pageable) {
        log.info("Getting users service starts here");
        Specification<User> spec = UserSpecification.filter(filter);

        Page<UserResponse> page = userRepository.findAll(spec, pageable)
                .map(userMapper::toUserResponse);

        log.info("Fetched users: {}", page.getContent());
        return Mapper.toPageResponse(page);
    }

    public ApiResponse<Void> deleteUser(Long userId) {
        log.info("Deleting user service starts here");
        userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.error("User not found with id {}", userId);
                    return new ResourceNotFoundException(String.format("No user exist with id: %s", userId));
                });

        userRepository.deleteById(userId);
        log.info("Deleted user with id {}", userId);
        return Mapper.toApiResponse("User Deleted", null);
    }
}
