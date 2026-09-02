package com.saverfwd.backend.chat.service;

import com.saverfwd.backend.chat.dto.CreateMessageRequest;
import com.saverfwd.backend.chat.dto.MessageResponse;
import com.saverfwd.backend.chat.entity.Message;
import com.saverfwd.backend.chat.mapper.MessageMapper;
import com.saverfwd.backend.chat.repository.ChatRepository;
import com.saverfwd.backend.chat.repository.MessageRepository;
import com.saverfwd.backend.common.exception.ResourceNotFoundException;
import com.saverfwd.backend.common.util.Common;
import com.saverfwd.backend.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;
    private final ChatRepository chatRepository;
    private final MessageMapper messageMapper;

    public MessageResponse postMessage(CreateMessageRequest request) {
        User user = Common.getCurrentUser();
        return chatRepository.findById(request.chatId()).map(chat -> {
            Message message = messageMapper.toMessage(request);
            message.setChat(chat);
            message.setSender(user);
            message.setRead(false);

            Message savedMessage = messageRepository.save(message);
            return messageMapper.toMessageResponse(savedMessage);
        }).orElseThrow(() -> new ResourceNotFoundException(String.format("Chat with id: %s not found", request.chatId())));
    }

    public MessageResponse getMessageById(Long messageId) {
        return messageRepository.findById(messageId)
                .map(messageMapper::toMessageResponse)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Message with id: %s not found", messageId)));
    }
}
