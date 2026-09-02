package com.saverfwd.backend.chat.dto;

import java.time.LocalDateTime;

public record MessageResponse(
        Long chatId,
        Long senderId,
        String content,
        Boolean read,
        LocalDateTime createdAt
) {
}
