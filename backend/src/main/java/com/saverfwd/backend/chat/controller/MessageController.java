package com.saverfwd.backend.chat.controller;

import com.saverfwd.backend.chat.dto.CreateMessageRequest;
import com.saverfwd.backend.chat.dto.MessageResponse;
import com.saverfwd.backend.chat.service.MessageService;
import com.saverfwd.backend.common.mapper.Mapper;
import com.saverfwd.backend.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/message")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public ResponseEntity<ApiResponse<MessageResponse>> sendMessage(@Valid @RequestBody CreateMessageRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Mapper.toApiResponse("Message created!", messageService.postMessage(request)));
    }

    @GetMapping("/{messageId}")
    public ResponseEntity<ApiResponse<MessageResponse>> getMessage(@PathVariable("messageId") Long messageId) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(Mapper.toApiResponse("Message found!", messageService.getMessageById(messageId)));
    }

    @PatchMapping("/{messageId}")
    public ResponseEntity<ApiResponse<MessageResponse>> updateMessage(
            @PathVariable("messageId") Long messageId,
            @RequestParam(name = "content", required = false) String content
    ) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(Mapper.toApiResponse("Message updated!", messageService.updateMessage(messageId, content)));
    }

    @PatchMapping("/{messageId}/read")
    public ResponseEntity<ApiResponse<MessageResponse>> readMessage(@PathVariable("messageId") Long messageId) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(Mapper.toApiResponse("Message updated!", messageService.readMessage(messageId)));
    }

    @DeleteMapping("/{messageId}")
    public ResponseEntity<ApiResponse<Void>> deleteMessage(@PathVariable("messageId") Long messageId) {
        messageService.deleteMessage(messageId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(Mapper.toApiResponse("Message deleted!", null));
    }
}
