package com.moviebooking.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(SeatAlreadyBookedException.class)
    public ResponseEntity<Map<String, Object>> handleSeatAlreadyBooked(SeatAlreadyBookedException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", "Seat Already Booked");
        response.put("message", ex.getMessage());
        response.put("userMessage", "Oops! Someone just grabbed that seat");
        response.put("status", HttpStatus.CONFLICT.value());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @ExceptionHandler(ShowNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleShowNotFound(ShowNotFoundException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", "Show Not Found");
        response.put("message", ex.getMessage());
        response.put("userMessage", "Show not found");
        response.put("status", HttpStatus.NOT_FOUND.value());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalState(IllegalStateException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", "Invalid Operation");
        response.put("message", ex.getMessage());
        response.put("userMessage", ex.getMessage());
        response.put("status", HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", "Internal Server Error");
        response.put("message", ex.getMessage());
        response.put("userMessage", "Something went wrong. Please try again.");
        response.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
