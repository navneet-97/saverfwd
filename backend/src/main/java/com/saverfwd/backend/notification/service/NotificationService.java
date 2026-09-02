package com.saverfwd.backend.notification.service;

import com.saverfwd.backend.common.exception.ResourceNotFoundException;
import com.saverfwd.backend.notification.dto.CreateNotificationRequest;
import com.saverfwd.backend.notification.dto.NotificationResponse;
import com.saverfwd.backend.notification.entity.Notification;
import com.saverfwd.backend.notification.mapper.NotificationMapper;
import com.saverfwd.backend.notification.repository.NotificationRepository;
import com.saverfwd.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final NotificationMapper notificationMapper;

    public NotificationResponse sendNotification(CreateNotificationRequest request){
        return userRepository.findById(request.userId()).map(user -> {
            Notification notification = notificationMapper.toNotification(request);
            notification.setUser(user);
            notification.setRead(false);

            Notification savedNotification = notificationRepository.save(notification);
            return notificationMapper.toNotificationResponse(savedNotification);
        }).orElseThrow(() -> new ResourceNotFoundException(String.format("User with id: %s not found", request.userId())));
    }
}
