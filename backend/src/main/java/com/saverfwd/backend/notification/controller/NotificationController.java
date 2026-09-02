package com.saverfwd.backend.notification.controller;

import com.saverfwd.backend.common.mapper.Mapper;
import com.saverfwd.backend.common.response.ApiResponse;
import com.saverfwd.backend.common.response.PageResponse;
import com.saverfwd.backend.notification.dto.CreateNotificationRequest;
import com.saverfwd.backend.notification.dto.NotificationResponse;
import com.saverfwd.backend.notification.dto.NotificationSearchFilter;
import com.saverfwd.backend.notification.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notification")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping
    public ResponseEntity<ApiResponse<NotificationResponse>> sendNotification(@Valid @RequestBody CreateNotificationRequest request){
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Mapper.toApiResponse("Notification Created!", notificationService.sendNotification(request)));
    }

    @GetMapping("/{notificationId}")
    public ResponseEntity<ApiResponse<NotificationResponse>> getNotificationById(@PathVariable("notificationId") Long notificationId){
        return ResponseEntity.status(HttpStatus.OK)
                .body(Mapper.toApiResponse("Notification found!", notificationService.getNotificationById(notificationId)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<NotificationResponse>>> getNotifications(
            @Valid @ModelAttribute NotificationSearchFilter filter,
            @PageableDefault(page = 0, size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        PageResponse<NotificationResponse> pageResponse = notificationService.getNotifications(filter, pageable);
        return ResponseEntity.status(HttpStatus.OK)
                .body(Mapper.toApiResponse("Notifications found!", pageResponse));
    }

    @PatchMapping("/{notificationId}/read")
    public ResponseEntity<ApiResponse<NotificationResponse>> readNotification(@PathVariable("notificationId") Long notificationId){
        return ResponseEntity.status(HttpStatus.OK)
                .body(Mapper.toApiResponse("Notification updated!", notificationService.readNotificationById(notificationId)));
    }

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<ApiResponse<Void>> deleteNotification(@PathVariable("notificationId") Long notificationId){
        notificationService.deleteNotificationById(notificationId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(Mapper.toApiResponse("Notification deleted!", null));
    }
}
