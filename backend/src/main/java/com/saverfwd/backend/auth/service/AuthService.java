package com.saverfwd.backend.auth.service;

import com.saverfwd.backend.auth.response.TokenResponse;
import com.saverfwd.backend.auth.dtos.UserLoginRequest;
import com.saverfwd.backend.auth.dtos.UserRegisterRequest;
import com.saverfwd.backend.auth.utils.CustomUserDetails;
import com.saverfwd.backend.common.exception.ResourceAlreadyExists;
import com.saverfwd.backend.user.entity.AccountStatus;
import com.saverfwd.backend.user.entity.Role;
import com.saverfwd.backend.user.entity.User;
import com.saverfwd.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;

    public TokenResponse registerUser(UserRegisterRequest request) {
        userRepository.findByEmail(request.email()).ifPresent(user -> {
            throw new ResourceAlreadyExists(String.format("User with email %s already exists", request.email()));
        });

        User user = User.builder()
                .full_name(request.fullName())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .phone_number(request.phoneNumber())
                .role(Role.USER)
                .account_status(AccountStatus.ACTIVE)
                .build();

        User savedUser = userRepository.save(user);
        return generateTokens(savedUser);
    }

    public TokenResponse loginUser(UserLoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.username(),
                        request.password()
                )
        );

        User user = userRepository.findByEmail(request.username()).get();
        return generateTokens(user);
    }

    private TokenResponse generateTokens(User user) {
        UserDetails userDetails = new CustomUserDetails(user);

        String accessToken = tokenService.accessToken(userDetails);
        String refreshToken = tokenService.refreshToken(user);

        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }
}
