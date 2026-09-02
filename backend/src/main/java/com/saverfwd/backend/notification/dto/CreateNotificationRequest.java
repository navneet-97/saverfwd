package com.saverfwd.backend.notification.dto;

import com.saverfwd.backend.notification.enums.NotificationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateNotificationRequest(
        @NotNull(message = "User is required")
        Long userId,

        @NotNull(message = "NotificationType is required")
        NotificationType notificationType,

        @NotBlank(message = "Title is required")
        @Size(max = 150, message = "Title cannot exceed 150 characters")
        String title,

        @NotBlank(message = "Message is required")
        @Size(max = 500, message = "Message cannot exceed 500 characters")
        String message
) {
}
