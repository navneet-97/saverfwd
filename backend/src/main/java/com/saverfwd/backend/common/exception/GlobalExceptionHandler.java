package com.saverfwd.backend.common.exception;

import com.saverfwd.backend.common.response.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ErrorResponse<String>> handleDuplicateResourceException(DuplicateResourceException e, HttpServletRequest req) {
        return errorResponse(
                HttpStatus.CONFLICT,
                "Duplicate resource",
                e.getMessage(),
                req
        );
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse<String>> handleResourceNotFoundException(ResourceNotFoundException e, HttpServletRequest req) {
        return errorResponse(
                HttpStatus.NOT_FOUND,
                "Resource not found.",
                e.getMessage(),
                req
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse<Object>> handleMethodArgumentNotValidException(MethodArgumentNotValidException e, HttpServletRequest req) {
        Map<String, String> errors = new HashMap<>();

        e.getBindingResult().getFieldErrors().forEach((fieldError) -> {
            errors.put(fieldError.getField(), fieldError.getDefaultMessage());
        });

        return errorResponse(
                HttpStatus.BAD_REQUEST,
                "Validation failed.",
                errors,
                req
        );
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse<String>> handleBadCredentialsException(BadCredentialsException e, HttpServletRequest req) {
        return errorResponse(
                HttpStatus.UNAUTHORIZED,
                "Login failed.",
                "Invalid username or password",
                req
        );
    }

//    @ExceptionHandler(ConstraintViolationException.class)

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse<String>> handleException(Exception e, HttpServletRequest req) {
        return errorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "something went wrong",
                e.getMessage(),
                req
        );
    }

    private <T> ResponseEntity<ErrorResponse<T>> errorResponse(HttpStatus status, String msg, T error, HttpServletRequest request) {
        return ResponseEntity.status(status)
                .body(new ErrorResponse<>(
                        false,
                        msg,
                        request.getRequestURI(),
                        LocalDateTime.now(),
                        error
                ));
    }
}
