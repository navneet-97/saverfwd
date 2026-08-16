package com.saverfwd.backend.common.exception;

import com.saverfwd.backend.common.mapper.Mapper;
import com.saverfwd.backend.common.response.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.redis.RedisConnectionFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ErrorResponse<String>> handleDuplicateResourceException(DuplicateResourceException e, HttpServletRequest req) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Mapper.toErrorResponse(
                        "Duplicate resource found",
                        e.getMessage(),
                        req
                ));
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse<String>> handleBusinessException(BusinessException e, HttpServletRequest req) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Mapper.toErrorResponse(
                        "Logic error",
                        e.getMessage(),
                        req
                ));
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse<String>> handleResourceNotFoundException(ResourceNotFoundException e, HttpServletRequest req) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Mapper.toErrorResponse(
                        "Resource not found",
                        e.getMessage(),
                        req
                ));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse<Object>> handleMethodArgumentNotValidException(MethodArgumentNotValidException e, HttpServletRequest req) {
        Map<String, List<String>> errors = new HashMap<>();

        e.getBindingResult().getFieldErrors().forEach((fieldError) -> {
            errors.computeIfAbsent(
                    fieldError.getField(),
                    key -> new ArrayList<>()
            ).add(fieldError.getDefaultMessage());
        });

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Mapper.toErrorResponse(
                        "Validation failed",
                        errors,
                        req
                ));
    }

    @ExceptionHandler(HandlerMethodValidationException.class)
    public ResponseEntity<ErrorResponse<?>> handleHandlerMethodValidationException(HandlerMethodValidationException e, HttpServletRequest req) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Mapper.toErrorResponse(
                        "Validation failed",
                        "Validation error",
                        req
                ));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse<String>> handleBadCredentialsException(BadCredentialsException e, HttpServletRequest req) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Mapper.toErrorResponse(
                        "Login failed",
                        "Invalid username or password",
                        req
                ));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse<String>> handleHttpMessageNotReadableException(HttpMessageNotReadableException e, HttpServletRequest req) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Mapper.toErrorResponse(
                        "Invalid request body",
                        "Request body is missing or malformed",
                        req
                ));
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse<String>> handleMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException e, HttpServletRequest req) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Mapper.toErrorResponse(
                        "Invalid request parameters",
                        String.format("Parameter '%s' should be of type '%s'.", e.getName(), e.getRequiredType().getSimpleName()),
                        req
                ));
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ErrorResponse<String>> handleNoResourceFoundException(NoResourceFoundException e, HttpServletRequest req) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Mapper.toErrorResponse(
                        "Invalid Route",
                        "404 Not Found",
                        req
                ));
    }

    @ExceptionHandler(RedisConnectionFailureException.class)
    public ResponseEntity<ErrorResponse<String>> handleRedisConnectionFailureException(RedisConnectionFailureException e, HttpServletRequest req) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Mapper.toErrorResponse(
                        "Redis Connection Error",
                        "Redis is not connected, Please try connecting redis",
                        req
                ));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse<String>> handleException(Exception e, HttpServletRequest req) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Mapper.toErrorResponse(
                        "Internal server error",
                        "Something went wrong, Please try again later.",
                        req
                ));
    }
}
