package com.moviebooking.service;

import com.moviebooking.exception.SeatAlreadyBookedException;
import com.moviebooking.exception.ShowNotFoundException;
import com.moviebooking.model.Show;
import com.moviebooking.model.Theater;
import com.moviebooking.repository.ShowRepository;
import com.moviebooking.repository.TheaterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SeatService {

    private final ShowRepository showRepository;
    private final TheaterRepository theaterRepository;
    private final MongoTemplate mongoTemplate;

    @Value("${seat.lock.duration.minutes}")
    private int lockDurationMinutes;

    /**
     * Get seat availability map for a show
     */
    public Map<String, Object> getSeatAvailability(String showId) {
        Show show = showRepository.findById(showId)
                .orElseThrow(() -> new ShowNotFoundException("Show not found with id: " + showId));

        Theater theater = theaterRepository.findById(show.getTheaterId())
                .orElseThrow(() -> new RuntimeException("Theater not found"));

        // Clean expired locks first
        cleanExpiredLocks(show);

        Map<String, Object> response = new HashMap<>();
        response.put("showId", showId);
        response.put("totalSeats", theater.getTotalSeats());
        response.put("availableSeats", show.getAvailableSeats());
        response.put("bookedSeats", show.getBookedSeats());
        
        // Get currently locked seats
        List<String> lockedSeats = show.getLockedSeats().stream()
                .map(Show.SeatLock::getSeatNumber)
                .collect(Collectors.toList());
        response.put("lockedSeats", lockedSeats);
        
        response.put("seatLayout", generateSeatLayout(theater, show));
        response.put("categories", theater.getSeatLayout().getCategories());

        return response;
    }

    /**
     * Lock seats temporarily (with transaction)
     */
    @Transactional
    public Map<String, Object> lockSeats(String showId, List<String> seatNumbers, String sessionId) {
        Show show = showRepository.findById(showId)
                .orElseThrow(() -> new ShowNotFoundException("Show not found with id: " + showId));

        // Clean expired locks
        cleanExpiredLocks(show);

        // Check if any seat is already booked or locked by another session
        for (String seatNumber : seatNumbers) {
            if (show.getBookedSeats().contains(seatNumber)) {
                throw new SeatAlreadyBookedException("Seat " + seatNumber + " is already booked");
            }
            
            Optional<Show.SeatLock> existingLock = show.getLockedSeats().stream()
                    .filter(lock -> lock.getSeatNumber().equals(seatNumber) 
                            && !lock.getSessionId().equals(sessionId))
                    .findFirst();
            
            if (existingLock.isPresent()) {
                throw new SeatAlreadyBookedException("Seat " + seatNumber + " is currently locked by another user");
            }
        }

        // Remove any existing locks for this session
        show.getLockedSeats().removeIf(lock -> lock.getSessionId().equals(sessionId));

        // Add new locks
        Date now = new Date();
        Date expiresAt = new Date(now.getTime() + (lockDurationMinutes * 60 * 1000));
        
        for (String seatNumber : seatNumbers) {
            Show.SeatLock lock = new Show.SeatLock(seatNumber, sessionId, now, expiresAt);
            show.getLockedSeats().add(lock);
        }

        // Use atomic update with version check (optimistic locking)
        Query query = new Query(Criteria.where("_id").is(showId)
                .and("version").is(show.getVersion()));
        Update update = new Update()
                .set("lockedSeats", show.getLockedSeats())
                .inc("version", 1);

        Show updatedShow = mongoTemplate.findAndModify(query, update, Show.class);
        
        if (updatedShow == null) {
            throw new SeatAlreadyBookedException("Seats were modified by another transaction. Please try again.");
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("sessionId", sessionId);
        response.put("lockedSeats", seatNumbers);
        response.put("expiresAt", expiresAt);
        response.put("message", "Seats locked successfully");

        return response;
    }

    /**
     * Unlock seats (if payment fails or user cancels)
     */
    @Transactional
    public Map<String, Object> unlockSeats(String showId, String sessionId) {
        Show show = showRepository.findById(showId)
                .orElseThrow(() -> new ShowNotFoundException("Show not found with id: " + showId));

        show.getLockedSeats().removeIf(lock -> lock.getSessionId().equals(sessionId));
        showRepository.save(show);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Seats unlocked successfully");

        return response;
    }

    /**
     * Confirm seat booking (convert lock to booking)
     */
    @Transactional
    public void confirmSeatBooking(String showId, List<String> seatNumbers, String sessionId) {
        Show show = showRepository.findById(showId)
                .orElseThrow(() -> new ShowNotFoundException("Show not found with id: " + showId));

        // Verify seats are locked by this session
        for (String seatNumber : seatNumbers) {
            boolean isLockedBySession = show.getLockedSeats().stream()
                    .anyMatch(lock -> lock.getSeatNumber().equals(seatNumber) 
                            && lock.getSessionId().equals(sessionId));
            
            if (!isLockedBySession) {
                throw new IllegalStateException("Seat " + seatNumber + " is not locked by this session");
            }

            if (show.getBookedSeats().contains(seatNumber)) {
                throw new SeatAlreadyBookedException("Seat " + seatNumber + " is already booked");
            }
        }

        // Remove locks and add to booked seats
        show.getLockedSeats().removeIf(lock -> lock.getSessionId().equals(sessionId));
        show.getBookedSeats().addAll(seatNumbers);
        show.setAvailableSeats(show.getAvailableSeats() - seatNumbers.size());

        // Update status if housefull
        if (show.getAvailableSeats() <= 0) {
            show.setStatus("HOUSEFULL");
        }

        showRepository.save(show);
    }

    /**
     * Clean expired locks (scheduled task)
     */
    @Scheduled(fixedRate = 60000) // Run every minute
    public void cleanAllExpiredLocks() {
        List<Show> allShows = showRepository.findAll();
        Date now = new Date();

        for (Show show : allShows) {
            boolean hasExpiredLocks = show.getLockedSeats().stream()
                    .anyMatch(lock -> lock.getExpiresAt().before(now));

            if (hasExpiredLocks) {
                show.getLockedSeats().removeIf(lock -> lock.getExpiresAt().before(now));
                showRepository.save(show);
                log.info("Cleaned expired locks for show: {}", show.getId());
            }
        }
    }

    private void cleanExpiredLocks(Show show) {
        Date now = new Date();
        boolean removed = show.getLockedSeats().removeIf(lock -> lock.getExpiresAt().before(now));
        if (removed) {
            showRepository.save(show);
        }
    }

    private List<Map<String, Object>> generateSeatLayout(Theater theater, Show show) {
        List<Map<String, Object>> layout = new ArrayList<>();
        Theater.SeatLayout seatLayout = theater.getSeatLayout();

        for (int i = 0; i < seatLayout.getRows(); i++) {
            char rowLetter = (char) ('A' + i);
            String rowName = String.valueOf(rowLetter);

            // Determine category for this row
            String category = "SILVER";
            double price = 150.0;
            
            for (Theater.SeatCategory cat : seatLayout.getCategories()) {
                if (cat.getRows().contains(rowName)) {
                    category = cat.getName();
                    price = cat.getPrice();
                    break;
                }
            }

            for (int j = 1; j <= seatLayout.getSeatsPerRow(); j++) {
                String seatNumber = rowName + j;
                Map<String, Object> seat = new HashMap<>();
                seat.put("seatNumber", seatNumber);
                seat.put("row", rowName);
                seat.put("column", j);
                seat.put("category", category);
                seat.put("price", price);

                if (show.getBookedSeats().contains(seatNumber)) {
                    seat.put("status", "BOOKED");
                } else if (show.getLockedSeats().stream()
                        .anyMatch(lock -> lock.getSeatNumber().equals(seatNumber))) {
                    seat.put("status", "LOCKED");
                } else {
                    seat.put("status", "AVAILABLE");
                }

                layout.add(seat);
            }
        }

        return layout;
    }
}
