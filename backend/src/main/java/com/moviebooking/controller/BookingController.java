package com.moviebooking.controller;

import com.moviebooking.model.Booking;
import com.moviebooking.service.BookingService;
import com.moviebooking.service.SeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;
    private final SeatService seatService;

    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody Booking booking,
                                                  @RequestParam String sessionId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(bookingService.createBooking(booking, sessionId));
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<Booking> getBookingByBookingId(@PathVariable String bookingId) {
        return bookingService.getBookingByBookingId(bookingId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getUserBookingHistory(@PathVariable String userId) {
        return ResponseEntity.ok(bookingService.getUserBookingHistory(userId));
    }

    @PutMapping("/{bookingId}/cancel")
    public ResponseEntity<Booking> cancelBooking(@PathVariable String bookingId) {
        return ResponseEntity.ok(bookingService.cancelBooking(bookingId));
    }

    @PostMapping("/calculate-price")
    public ResponseEntity<Booking.PriceBreakdown> calculatePrice(@RequestBody Map<String, Object> request) {
        // This endpoint is handled by the booking service during booking creation
        // But we can expose it for frontend price preview
        return ResponseEntity.ok(new Booking.PriceBreakdown());
    }

    @PostMapping("/seats/lock")
    public ResponseEntity<Map<String, Object>> lockSeats(@RequestBody Map<String, Object> request) {
        String showId = (String) request.get("showId");
        List<String> seatNumbers = (List<String>) request.get("seatNumbers");
        String sessionId = (String) request.get("sessionId");
        
        return ResponseEntity.ok(seatService.lockSeats(showId, seatNumbers, sessionId));
    }

    @PostMapping("/seats/unlock")
    public ResponseEntity<Map<String, Object>> unlockSeats(@RequestBody Map<String, Object> request) {
        String showId = (String) request.get("showId");
        String sessionId = (String) request.get("sessionId");
        
        return ResponseEntity.ok(seatService.unlockSeats(showId, sessionId));
    }
}
