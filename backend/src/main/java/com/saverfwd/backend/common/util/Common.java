package com.saverfwd.backend.common.util;

import com.saverfwd.backend.auth.security.CustomUserDetails;
import com.saverfwd.backend.common.exception.BusinessException;
import com.saverfwd.backend.user.entity.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.UUID;

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
            throw new BusinessException("Authentication context is not found");
        }

        Object principal = authentication.getPrincipal();
        if(!(principal instanceof CustomUserDetails userDetails)){
            throw new BusinessException("User Details not found in authentication context");
        }
        return userDetails.getUser();
    }
}
