package com.saverfwd.backend.auth.service;

import com.saverfwd.backend.auth.entity.RefreshToken;
import com.saverfwd.backend.auth.repository.RefreshTokenRepository;
import com.saverfwd.backend.auth.response.AuthResponse;
import com.saverfwd.backend.auth.response.TokenResponse;
import com.saverfwd.backend.auth.dtos.UserLoginRequest;
import com.saverfwd.backend.auth.dtos.UserRegisterRequest;
import com.saverfwd.backend.auth.security.CustomUserDetails;
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

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;
    private final PasswordEncoder passwordEncoder;
    private final Mapper mapper;
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
            return mapper.toAuthResponse(
                    "User registered successfully!",
                    userMapper.toUserResponse(savedUser),
                    generateTokens(savedUser, version)
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

        User user = getAuthenticatedUser(authentication);
        long version = blacklistService.getOrInitializeVersion(user.getEmail());

        return mapper.toAuthResponse(
                "User logged in successfully!",
                userMapper.toUserResponse(user),
                generateTokens(user, version)
        );
    }

    public ApiResponse<UserResponse> getCurrentUser() {
        User user = getUser();

        return mapper.toApiResponse("Current user", userMapper.toUserResponse(user));
    }

    public ApiResponse<Void> logoutCurrentSession(String refreshToken) {
        User user = getUser();
        String accessToken = getAccessToken();
        RefreshToken storedToken = tokenService.validateRefreshToken(refreshToken);

        if(!storedToken.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Invalid refresh token");
        }

        tokenService.logoutCurrentDevice(accessToken, storedToken);
        SecurityContextHolder.clearContext();
        return mapper.toApiResponse("Logged out successfully!", null);
    }

    public ApiResponse<Void> logoutAllSessions() {
        User user = getUser();
        String accessToken = getAccessToken();

        tokenService.logoutAllDevices(user, accessToken);
        SecurityContextHolder.clearContext();

        return mapper.toApiResponse("Logged out from all devices successfully!", null);
    }

    @Transactional
    public AuthResponse refreshAccessToken(String refreshToken) {
        RefreshToken token = tokenService.validateRefreshToken(refreshToken);
        User user = token.getUser();
        refreshTokenRepository.revokeIfActive(token.getToken());

        long version = blacklistService.getOrInitializeVersion(user.getEmail());

        return mapper.toAuthResponse(
                "Access token refreshed successfully!",
                userMapper.toUserResponse(user),
                generateTokens(user, version)
        );
    }

    private User getAuthenticatedUser(Authentication authentication) {
        if(authentication == null || !authentication.isAuthenticated()) {
            throw new BusinessException("Authentication context is not found");
        }

        Object principal = authentication.getPrincipal();
        if(!(principal instanceof CustomUserDetails userDetails)){
            throw new BusinessException("User Details not found in authentication context");
        }
        return userDetails.getUser();
    }

    private User getUser() {
        Authentication authentication = Common.getAuthentication();
        return getAuthenticatedUser(authentication);
    }

    private TokenResponse generateTokens(User user, long version) {
        String accessToken = tokenService.accessToken(user.getEmail(), version);
        String refreshToken = tokenService.refreshToken(user);

        return mapper.toTokenResponse(accessToken, refreshToken);
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
