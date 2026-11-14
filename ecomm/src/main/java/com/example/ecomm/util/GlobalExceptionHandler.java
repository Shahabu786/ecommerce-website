package com.example.ecomm.util;

import java.util.LinkedHashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    private static ResponseEntity<Map<String, String>> message(HttpStatus status, String text) {
        Map<String, String> body = new LinkedHashMap<>();
        body.put("message", text);
        return ResponseEntity.status(status).body(body);
    }

    // @Valid failures (seller registration): { field: "message", ... }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(error -> errors.putIfAbsent(error.getField(), error.getDefaultMessage()));
        return ResponseEntity.badRequest().body(errors);
    }

    // Errors thrown by the services (400 / 401 / 404 / 409 ...) -> { message }
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> handleApiError(ResponseStatusException ex) {
        Map<String, String> error = new LinkedHashMap<>();
        error.put("message", ex.getReason());
        return ResponseEntity.status(ex.getStatusCode()).body(error);
    }

    // Broken / empty JSON body
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, String>> handleUnreadable(HttpMessageNotReadableException ex) {
        return message(HttpStatus.BAD_REQUEST, "Request body is missing or not valid JSON");
    }

    // Unique / foreign key / not-null violations from the database
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleIntegrity(DataIntegrityViolationException ex) {
        log.warn("Database constraint violation: {}", ex.getMostSpecificCause().getMessage());
        return message(HttpStatus.CONFLICT,
                "This data conflicts with existing records (duplicate or still in use).");
    }

    // Everything else. Spring's own web errors (404 unknown URL, 405 wrong method,
    // 415 wrong content type ...) keep their real status instead of becoming a 500,
    // and real server bugs are now written to the console log.
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleOtherErrors(Exception ex) {
        if (ex instanceof ErrorResponse errorResponse) {
            String detail = errorResponse.getBody().getDetail();
            Map<String, String> error = new LinkedHashMap<>();
            error.put("message", detail != null ? detail : "Request failed");
            return ResponseEntity.status(errorResponse.getStatusCode()).body(error);
        }
        log.error("Unexpected server error", ex);
        return message(HttpStatus.INTERNAL_SERVER_ERROR, "Something went wrong on the server");
    }
}
