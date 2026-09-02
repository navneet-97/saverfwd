package com.saverfwd.backend.notification.dto;

public record NotificationSearchFilter(
        Long userId,
        Boolean isRead
) {
}
