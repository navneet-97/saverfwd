package com.saverfwd.backend.notification.dto;

import com.saverfwd.backend.notification.enums.NotificationType;

import java.time.LocalDateTime;

public record NotificationResponse(
        Long id,
        Long userId,
        NotificationType notificationType,
        String title,
        String message,
        Boolean read,
        Long referenceId,
        LocalDateTime createdAt
) {
}
