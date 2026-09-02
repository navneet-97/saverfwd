package com.saverfwd.backend.chat.mapper;

import com.saverfwd.backend.chat.dto.CreateMessageRequest;
import com.saverfwd.backend.chat.dto.MessageResponse;
import com.saverfwd.backend.chat.entity.Message;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MessageMapper {

    Message toMessage(CreateMessageRequest createMessageRequest);

    @Mapping(target = "chatId", source = "chat.id")
    @Mapping(target = "senderId", source = "sender.id")
    MessageResponse toMessageResponse(Message message);
}
