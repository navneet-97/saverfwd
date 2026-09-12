package com.saverfwd.backend.common.util;

import com.saverfwd.backend.auth.security.CustomUserDetails;
import com.saverfwd.backend.common.exception.BusinessException;
import com.saverfwd.backend.user.entity.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.UUID;

@Slf4j
public final class Common {
    private Common() {}

    public static Authentication getAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    public static String getSessionId() {
        return UUID.randomUUID().toString();
    }

    public static User getCurrentUser() {
        Authentication authentication = getAuthentication();
        return validateAuthentication(authentication);
    }

    public static User validateAuthentication(Authentication authentication) {
        if(authentication == null || !authentication.isAuthenticated()) {
            log.error("Authentication failed: no user logged in");
            throw new BusinessException("Authentication context is not found");
        }

        Object principal = authentication.getPrincipal();
        if(!(principal instanceof CustomUserDetails userDetails)){
            log.error("Authentication failed: principal is not of type CustomUserDetails");
            throw new BusinessException("User Details not found in authentication context");
        }
        return userDetails.getUser();
    }
}
