package com.saverfwd.backend.auth.service;

import com.saverfwd.backend.auth.response.AuthResponse;
import com.saverfwd.backend.auth.response.TokenResponse;
import com.saverfwd.backend.auth.dtos.UserLoginRequest;
import com.saverfwd.backend.auth.dtos.UserRegisterRequest;
import com.saverfwd.backend.auth.security.CustomUserDetails;
import com.saverfwd.backend.common.exception.DuplicateResourceException;
import com.saverfwd.backend.common.mapper.Mapper;
import com.saverfwd.backend.common.response.ApiResponse;
import com.saverfwd.backend.user.dto.UserResponse;
import com.saverfwd.backend.user.entity.User;
import com.saverfwd.backend.user.mapper.UserMapper;
import com.saverfwd.backend.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;
    private final PasswordEncoder passwordEncoder;
    private final Mapper mapper;
    private final UserMapper userMapper;

    @Transactional
    public AuthResponse registerUser(UserRegisterRequest request) {
        User user = userMapper.toUser(request);
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // trust db constraints for uniqueness
        // will reduce db calls to 1.

        try {
            User savedUser = userRepository.save(user);

            return mapper.toAuthResponse(
                    "User registered successfully!",
                    userMapper.toUserResponse(savedUser),
                    generateTokens(savedUser)
            );
        } catch (DataIntegrityViolationException e) {
            throw new DuplicateResourceException("User with this email or phone number already exists");
        }
    }

    public AuthResponse loginUser(UserLoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.username().trim(),
                        request.password()
                )
        );

        User user = getUser(authentication);

        return mapper.toAuthResponse(
                "User logged in successfully!",
                userMapper.toUserResponse(user),
                generateTokens(user)
        );
    }

    public ApiResponse<UserResponse> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = getUser(authentication);

        return mapper.toApiResponse("Current user", userMapper.toUserResponse(user));
    }

    private User getUser(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return userDetails.getUser();
    }

    private TokenResponse generateTokens(User user) {
        String accessToken = tokenService.accessToken(user);
        String refreshToken = tokenService.refreshToken(user);

        return mapper.toTokenResponse(accessToken, refreshToken);
    }
}
