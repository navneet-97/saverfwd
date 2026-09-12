package com.saverfwd.backend.auth.service;

import com.saverfwd.backend.auth.dtos.ResetPasswordRequest;
import com.saverfwd.backend.auth.entity.Otp;
import com.saverfwd.backend.auth.entity.RefreshToken;
import com.saverfwd.backend.auth.repository.OtpRepository;
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
import com.saverfwd.backend.common.util.Common;
import com.saverfwd.backend.user.dto.UserResponse;
import com.saverfwd.backend.user.entity.User;
import com.saverfwd.backend.user.mapper.UserMapper;
import com.saverfwd.backend.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;
    private final OtpRepository otpRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final BlacklistService blacklistService;
    private final RefreshTokenRepository refreshTokenRepository;

    @Transactional
    public AuthResponse registerUser(UserRegisterRequest request) {
        log.info("Service to register user starts here");
        User user = userMapper.toUser(request);
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // trust db constraints for uniqueness
        // will reduce db calls to 1.

        try {
            User savedUser = userRepository.save(user);
            log.info("User saved in db successfully: {}", savedUser);

            long version = blacklistService.getOrInitializeVersion(savedUser.getEmail());
            TokenResponse tokenResponse = generateTokens(savedUser, version);
            log.info("User registration completed successfully");

            return Mapper.toAuthResponse(
                    "User registered successfully!",
                    userMapper.toUserResponse(savedUser),
                    tokenResponse
            );
        } catch (DataIntegrityViolationException e) {
            String message = e.getMostSpecificCause().getMessage();
            String duplicateValue = message.split("'")[1];
            log.error("Duplicate user registration attempt: {}", duplicateValue);
            throw new DuplicateResourceException("User with email or phone number '"+ duplicateValue +"' already exists");
        }
    }

    @Transactional
    public List<UserResponse> registerMany(List<UserRegisterRequest> requests) {
        log.info("Service to register users starts here");
        if(requests == null || requests.isEmpty()) {
            log.error("Registering users requests is empty");
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
            log.info("Users saved in db successfully: {}", savedUsers.size());

            return savedUsers.stream()
                    .map(userMapper::toUserResponse)
                    .toList();

        } catch (DataIntegrityViolationException e) {
            String message = e.getMostSpecificCause().getMessage();
            String duplicateValue = message.split("'")[1];
            log.error("Duplicate users registration attempt: {}", duplicateValue);
            throw new DuplicateResourceException("User with email or phone number '"+ duplicateValue +"' already exists");
        }
    }

    public AuthResponse loginUser(UserLoginRequest request) {
        log.info("Service to login user starts here");
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email().trim(),
                        request.password()
                )
        );
        log.info("Authentication completed successfully");

        User user = Common.validateAuthentication(authentication);
        log.debug("User from Authentication object: {}", user);
        long version = blacklistService.getOrInitializeVersion(user.getEmail());
        TokenResponse tokenResponse = generateTokens(user, version);
        log.info("User login completed successfully");

        return Mapper.toAuthResponse(
                "User logged in successfully!",
                userMapper.toUserResponse(user),
                tokenResponse
        );
    }

    public ApiResponse<UserResponse> getCurrentUser() {
        log.info("Service to get current user starts here");
        User user = Common.getCurrentUser();
        log.info("User from Authentication object: {}", user);

        return Mapper.toApiResponse("Current user", userMapper.toUserResponse(user));
    }

    public ApiResponse<Void> logoutCurrentSession(String refreshToken) {
        log.info("Service to logout user starts here");
        User user = Common.getCurrentUser();
        log.info("User from Authentication object: {}", user);
        String accessToken = getAccessToken();
        RefreshToken storedToken = tokenService.validateRefreshToken(refreshToken);
        log.info("accessToken: {}, refreshToken: {}", accessToken, refreshToken);
        if(!storedToken.getUser().getId().equals(user.getId())) {
            log.error("Invalid refresh token: Tempered the refresh token");
            throw new ResourceNotFoundException("Invalid refresh token");
        }

        tokenService.logoutCurrentDevice(accessToken, storedToken);
        SecurityContextHolder.clearContext();
        log.info("User logged out successfully");
        return Mapper.toApiResponse("Logged out successfully!", null);
    }

    public ApiResponse<Void> logoutAllSessions() {
        log.info("Service to logout all sessions starts here");
        User user = Common.getCurrentUser();
        String accessToken = getAccessToken();

        tokenService.logoutAllDevices(user, accessToken);
        SecurityContextHolder.clearContext();
        log.info("User logged out of all devices successfully");

        return Mapper.toApiResponse("Logged out from all devices successfully!", null);
    }

    @Transactional
    public AuthResponse refreshAccessToken(String refreshToken) {
        log.info("Service to refresh access token starts here");
        RefreshToken token = tokenService.validateRefreshToken(refreshToken);
        User user = token.getUser();
        refreshTokenRepository.revokeIfActive(token.getToken());
        log.info("Revoked current Refresh token successfully");

        long version = blacklistService.getOrInitializeVersion(user.getEmail());
        log.info("Generated new access token and refresh token");
        return Mapper.toAuthResponse(
                "Access token refreshed successfully!",
                userMapper.toUserResponse(user),
                generateTokens(user, version)
        );
    }

    public ApiResponse<String> forgotPassword(String email) {
        log.info("Service to forgot password starts here");
        return userRepository.findByEmail(email).map(user -> {
            String otp = RandomStringUtils.randomNumeric(6);

            Otp code = Otp.builder()
                    .otp(otp)
                    .user(user)
                    .build();
            otpRepository.save(code);
            log.info("Saved otp :{} in db and send to email successfully", otp);
            return Mapper.toApiResponse("Code:", otp);
        }).orElseThrow(() -> {
            log.error("User not found with email {}", email);
            return new ResourceNotFoundException(String.format("User not found with %s", email));
        });
    }

    @Transactional
    public ApiResponse<Object> resetPassword(ResetPasswordRequest request) {
        log.info("Service to reset password starts here");
        return otpRepository.findByOtp(request.otp()).map(otp -> {
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime created = otp.getCreatedAt();
            if (created.plusMinutes(1).isBefore(now)){
                log.error("Reset code has expired: {}", request.otp());
                throw new BusinessException("Code expired");
            }

            User user = otp.getUser();
            if (!user.getEmail().equalsIgnoreCase(request.email())) {
                log.error("Reset code email has tempered: {}", request.email());
                throw new BusinessException("Invalid email");
            }

            user.setPassword(passwordEncoder.encode(request.password()));
            log.info("Reset password successfully: {}", request.password());
            return Mapper.toApiResponse("Password reset successfully!", null);
        }).orElseThrow(() -> {
            log.error("User not found with email {}", request.email());
            return new ResourceNotFoundException("Invalid code");
        });
    }

    private TokenResponse generateTokens(User user, long version) {
        log.debug("Generating tokens for user {}", user.getId());
        String accessToken = tokenService.accessToken(user.getEmail(), version);
        String refreshToken = tokenService.refreshToken(user);

        return Mapper.toTokenResponse(accessToken, refreshToken);
    }

    private String getAccessToken(){
        Authentication authentication = Common.getAuthentication();

        Object credentials = authentication.getCredentials();
        if(!(credentials instanceof String accessToken)) {
            log.error("Authentication failed: credentials is not of type String");
            throw new BusinessException("Access token not found in authentication context");
        }
        return accessToken;
    }
}
