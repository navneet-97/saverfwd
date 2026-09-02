package com.saverfwd.backend.chat.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateMessageRequest(
        @NotNull(message = "Chat is required")
        Long chatId,

        @NotBlank(message = "Content is required")
        @Size(max = 2000, message = "Content cannot exceed 2000 characters")
        String content
) {
}
