package com.edubridge.backend.common;

import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.time.Instant;
import java.util.*;

@RestControllerAdvice
public class GlobalExceptionHandler {
    public record ApiError(Instant timestamp, int status, String error, String message,
            Map<String, String> validationErrors) {
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiError> handleStatus(ResponseStatusException ex) {
        HttpStatusCode code = ex.getStatusCode();
        return ResponseEntity.status(code)
                .body(new ApiError(Instant.now(), code.value(), code.toString(), ex.getReason(), null));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(e -> errors.put(e.getField(), e.getDefaultMessage()));
        return ResponseEntity.badRequest()
                .body(new ApiError(Instant.now(), 400, "Bad Request", "Validation failed", errors));
    }

@ExceptionHandler(Exception.class)
public ResponseEntity<ApiError> handleOther(Exception ex) {

    ex.printStackTrace();   // TEMPORARY: reveal actual error

    return ResponseEntity.status(500).body(
        new ApiError(
            Instant.now(),
            500,
            "Internal Server Error",
            "An unexpected error occurred",
            null
        )
    );
}
}
