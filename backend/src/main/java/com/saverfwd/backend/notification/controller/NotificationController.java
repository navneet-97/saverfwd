package com.saverfwd.backend.notification.controller;

import com.saverfwd.backend.common.mapper.Mapper;
import com.saverfwd.backend.common.response.ApiResponse;
import com.saverfwd.backend.notification.dto.CreateNotificationRequest;
import com.saverfwd.backend.notification.dto.NotificationResponse;
import com.saverfwd.backend.notification.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
