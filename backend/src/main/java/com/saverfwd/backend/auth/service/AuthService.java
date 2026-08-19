package com.saverfwd.backend.auth.service;

import com.saverfwd.backend.auth.entity.RefreshToken;
import com.saverfwd.backend.auth.repository.RefreshTokenRepository;
import com.saverfwd.backend.auth.response.AuthResponse;
import com.saverfwd.backend.auth.response.TokenResponse;
import com.saverfwd.backend.auth.dtos.UserLoginRequest;
import com.saverfwd.backend.auth.dtos.UserRegisterRequest;
import com.saverfwd.backend.common.exception.BusinessException;
import com.saverfwd.backend.common.exception.DuplicateResourceException;
import com.saverfwd.backend.common.exception.ResourceNotFoundException;
import com.saverfwd.backend.common.mapper.Mapper;
import com.saverfwd.backend.common.response.ApiResponse;
import com.saverfwd.backend.common.utils.Common;
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

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final BlacklistService blacklistService;
    private final RefreshTokenRepository refreshTokenRepository;

    @Transactional
    public AuthResponse registerUser(UserRegisterRequest request) {
        User user = userMapper.toUser(request);
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // trust db constraints for uniqueness
        // will reduce db calls to 1.

        try {
            User savedUser = userRepository.save(user);

            long version = blacklistService.getOrInitializeVersion(savedUser.getEmail());
            return Mapper.toAuthResponse(
                    "User registered successfully!",
                    userMapper.toUserResponse(savedUser),
                    generateTokens(savedUser, version)
            );
        } catch (DataIntegrityViolationException e) {
            String message = e.getMostSpecificCause().getMessage();
            String duplicateValue = message.split("'")[1];
            throw new DuplicateResourceException("User with email or phone number '"+ duplicateValue +"' already exists");
        }
    }

    @Transactional
    public List<UserResponse> registerMany(List<UserRegisterRequest> requests) {
        if(requests == null || requests.isEmpty()) {
            throw new BusinessException("Invalid data request");
        }

        // right now, there is no check for duplicates in request and duplicates entries in db
        // but as we are using @Transactional so on duplicates it will revert the changes,
        // but we should definitely put checks before

        List<User> users = requests.stream()
                .map(userMapper::toUser)
                .peek(user -> user.setPassword(passwordEncoder.encode(user.getPassword())))
                .toList();

        try {
            List<User> savedUsers = userRepository.saveAll(users);

            return savedUsers.stream()
                    .map(userMapper::toUserResponse)
                    .toList();

        } catch (DataIntegrityViolationException e) {
            String message = e.getMostSpecificCause().getMessage();
            String duplicateValue = message.split("'")[1];
            throw new DuplicateResourceException("User with email or phone number '"+ duplicateValue +"' already exists");
        }
    }

    public AuthResponse loginUser(UserLoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.username().trim(),
                        request.password()
                )
        );

        User user = Common.validateAuthentication(authentication);
        long version = blacklistService.getOrInitializeVersion(user.getEmail());

        return Mapper.toAuthResponse(
                "User logged in successfully!",
                userMapper.toUserResponse(user),
                generateTokens(user, version)
        );
    }

    public ApiResponse<UserResponse> getCurrentUser() {
        User user = Common.getCurrentUser();

        return Mapper.toApiResponse("Current user", userMapper.toUserResponse(user));
    }

    public ApiResponse<Void> logoutCurrentSession(String refreshToken) {
        User user = Common.getCurrentUser();
        String accessToken = getAccessToken();
        RefreshToken storedToken = tokenService.validateRefreshToken(refreshToken);

        if(!storedToken.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Invalid refresh token");
        }

        tokenService.logoutCurrentDevice(accessToken, storedToken);
        SecurityContextHolder.clearContext();
        return Mapper.toApiResponse("Logged out successfully!", null);
    }

    public ApiResponse<Void> logoutAllSessions() {
        User user = Common.getCurrentUser();
        String accessToken = getAccessToken();

        tokenService.logoutAllDevices(user, accessToken);
        SecurityContextHolder.clearContext();

        return Mapper.toApiResponse("Logged out from all devices successfully!", null);
    }

    @Transactional
    public AuthResponse refreshAccessToken(String refreshToken) {
        RefreshToken token = tokenService.validateRefreshToken(refreshToken);
        User user = token.getUser();
        refreshTokenRepository.revokeIfActive(token.getToken());

        long version = blacklistService.getOrInitializeVersion(user.getEmail());

        return Mapper.toAuthResponse(
                "Access token refreshed successfully!",
                userMapper.toUserResponse(user),
                generateTokens(user, version)
        );
    }

    private TokenResponse generateTokens(User user, long version) {
        String accessToken = tokenService.accessToken(user.getEmail(), version);
        String refreshToken = tokenService.refreshToken(user);

        return Mapper.toTokenResponse(accessToken, refreshToken);
    }

    private String getAccessToken(){
        Authentication authentication = Common.getAuthentication();

        Object credentials = authentication.getCredentials();
        if(!(credentials instanceof String accessToken)) {
            throw new BusinessException("Access token not found in authentication context");
        }
        return accessToken;
    }
}
