package com.saverfwd.backend.auth.filter;

import com.saverfwd.backend.auth.exception.CustomAuthenticationEntryPoint;
import com.saverfwd.backend.auth.security.CustomUserDetailsService;
import com.saverfwd.backend.auth.security.JwtService;
import com.saverfwd.backend.auth.service.BlacklistService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService customUserDetailsService;
    private final CustomAuthenticationEntryPoint authenticationEntryPoint;
    private final BlacklistService blacklistService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authorizationHeader.substring(7);

        try {
            String email = jwtService.extractUsername(token);
            String jti = jwtService.extractJti(token);
            Long version = jwtService.extractVersion(token);

            if(email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                if(blacklistService.isTokenBlacklisted(jti)) {
                    handleAuthenticationFailure(request, response, "BLACKLISTED_TOKEN", new BadCredentialsException("Token is blacklisted"));

                    return;
                }

                long currentVersion = blacklistService.getOrInitializeVersion(email);
                if(version == null || currentVersion != version) {
                    handleAuthenticationFailure(request, response, "INVALID_TOKEN_VERSION", new BadCredentialsException("Token version mismatch"));

                    return;
                }

                UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);
                if(jwtService.isTokenValid(token, userDetails)) {
                    UsernamePasswordAuthenticationToken authenticationToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    token,
                                    userDetails.getAuthorities()
                            );

                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                }
            }
        } catch (ExpiredJwtException e) {
            handleAuthenticationFailure(request, response, "EXPIRED_TOKEN", e);

            return;
        } catch (JwtException e) {
            handleAuthenticationFailure(request, response, "INVALID_TOKEN", e);
            return;
        }

        filterChain.doFilter(request, response);
    }

    private void handleAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, String message, Exception cause) throws IOException, ServletException {
        authenticationEntryPoint.commence(request, response, new BadCredentialsException(message, cause));
    }
}
