package com.saverfwd.backend.chat.service;

import com.saverfwd.backend.chat.entity.Chat;
import com.saverfwd.backend.chat.repository.ChatRepository;
import com.saverfwd.backend.common.exception.ResourceNotFoundException;
import com.saverfwd.backend.common.util.Common;
import com.saverfwd.backend.user.entity.User;
import com.saverfwd.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final UserRepository userRepository;

    public void createChat(Long userId) {
        User userTwo = Common.getCurrentUser();

        userRepository.findById(userId).map(userOne -> {
            Chat chat = Chat.builder()
                    .userOne(userOne)
                    .userTwo(userTwo)
                    .build();
            return chatRepository.save(chat);
        }).orElseThrow(() -> new ResourceNotFoundException(String.format("User with id: %s not found", userId)));
    }
}
