package com.saverfwd.backend.chat.controller;

import com.saverfwd.backend.chat.service.ChatService;
import com.saverfwd.backend.common.mapper.Mapper;
import com.saverfwd.backend.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
