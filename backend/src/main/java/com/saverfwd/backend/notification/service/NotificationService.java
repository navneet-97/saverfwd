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
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final NotificationMapper notificationMapper;

    @Transactional
    public NotificationResponse sendNotification(CreateNotificationRequest request){
        log.debug("Sending notification service starts here");
        return userRepository.findById(request.userId()).map(user -> {
            Notification notification = notificationMapper.toNotification(request);
            notification.setUser(user);
            notification.setIsRead(false);

            Notification savedNotification = notificationRepository.save(notification);
            log.info("Successfully saved notification {}", savedNotification);
            return notificationMapper.toNotificationResponse(savedNotification);
        }).orElseThrow(() -> {
            log.error("Could not save notification: User with id {} not found", request.userId());
            return new ResourceNotFoundException(String.format("User with id: %s not found", request.userId()));
        });
    }

    public NotificationResponse getNotificationById(Long notificationId){
        log.info("Getting notification by id service starts here");
        return notificationRepository.findById(notificationId)
                .map(notificationMapper::toNotificationResponse)
                .orElseThrow(() -> {
                    log.error("Could not get notification: id {} not found", notificationId);
                    return new ResourceNotFoundException(String.format("Notification with id: %s not found", notificationId));
                });
    }

    @Transactional(readOnly = true)
    public PageResponse<NotificationResponse> getNotifications(NotificationSearchFilter filter, Pageable pageable){
        log.info("Getting notifications service starts here");
        Specification<Notification> spec = NotificationSpecification.filter(filter);

        Page<NotificationResponse> page = notificationRepository.findAll(spec, pageable)
                .map(notificationMapper::toNotificationResponse);

        log.info("Fetched {} notifications", page.getTotalElements());
        return Mapper.toPageResponse(page);
    }

    @Transactional
    public NotificationResponse readNotificationById(Long notificationId){
        log.info("Setting read true in notification service starts here");
        return notificationRepository.findById(notificationId).map(notification -> {
            notification.setIsRead(true);
            log.info("Successfully set read true {}", notification);
            return notificationMapper.toNotificationResponse(notification);
        }).orElseThrow(() -> {
            log.error("Could not update notification: id {} not found", notificationId);
            return new ResourceNotFoundException(String.format("Notification with id: %s not found", notificationId));
        });
    }

    @Transactional
    public void deleteNotificationById(Long notificationId){
        log.info("Deleting notification by id service starts here");
        notificationRepository.deleteById(notificationId);
        log.info("Successfully deleted notification {}", notificationId);
    }
}
