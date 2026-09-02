package com.saverfwd.backend.notification.service;

import com.saverfwd.backend.common.exception.ResourceNotFoundException;
import com.saverfwd.backend.common.mapper.Mapper;
import com.saverfwd.backend.common.response.PageResponse;
import com.saverfwd.backend.notification.dto.CreateNotificationRequest;
import com.saverfwd.backend.notification.dto.NotificationResponse;
import com.saverfwd.backend.notification.dto.NotificationSearchFilter;
import com.saverfwd.backend.notification.entity.Notification;
import com.saverfwd.backend.notification.mapper.NotificationMapper;
import com.saverfwd.backend.notification.repository.NotificationRepository;
import com.saverfwd.backend.notification.specification.NotificationSpecification;
import com.saverfwd.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final NotificationMapper notificationMapper;

    @Transactional
    public NotificationResponse sendNotification(CreateNotificationRequest request){
        return userRepository.findById(request.userId()).map(user -> {
            Notification notification = notificationMapper.toNotification(request);
            notification.setUser(user);
            notification.setRead(false);

            Notification savedNotification = notificationRepository.save(notification);
            return notificationMapper.toNotificationResponse(savedNotification);
        }).orElseThrow(() -> new ResourceNotFoundException(String.format("User with id: %s not found", request.userId())));
    }

    public NotificationResponse getNotificationById(Long notificationId){
        return notificationRepository.findById(notificationId)
                .map(notificationMapper::toNotificationResponse)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Notification with id: %s not found", notificationId)));
    }

    @Transactional(readOnly = true)
    public PageResponse<NotificationResponse> getNotifications(NotificationSearchFilter filter, Pageable pageable){
        Specification<Notification> spec = NotificationSpecification.filter(filter);

        Page<NotificationResponse> page = notificationRepository.findAll(spec, pageable)
                .map(notificationMapper::toNotificationResponse);

        return Mapper.toPageResponse(page);
    }
}
