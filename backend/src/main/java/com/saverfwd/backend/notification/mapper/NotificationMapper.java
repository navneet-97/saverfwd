package com.saverfwd.backend.notification.mapper;

import com.saverfwd.backend.notification.dto.CreateNotificationRequest;
import com.saverfwd.backend.notification.dto.NotificationResponse;
import com.saverfwd.backend.notification.entity.Notification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface NotificationMapper {

    Notification toNotification(CreateNotificationRequest request);

    @Mapping(target = "userId", source = "user.id")
    NotificationResponse toNotificationResponse(Notification notification);
}
