package com.saverfwd.backend.chat.controller;

import com.saverfwd.backend.chat.entity.Chat;
import com.saverfwd.backend.chat.service.ChatService;
import com.saverfwd.backend.common.mapper.Mapper;
import com.saverfwd.backend.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/{userId}")
    public ResponseEntity<ApiResponse<Void>> createChat(@PathVariable("userId") Long userId) {
        chatService.createChat(userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Mapper.toApiResponse("Chat created!", null));
    }

    @GetMapping("/{chatId}")
    public ResponseEntity<ApiResponse<Chat>> getChatById(@PathVariable("chatId") Long chatId) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(Mapper.toApiResponse("Chat found!", chatService.getChatById(chatId)));
    }
}
