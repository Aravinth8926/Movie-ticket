package com.moviebooking.repository;

import com.moviebooking.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
    Optional<Booking> findByBookingId(String bookingId);
    List<Booking> findByUserId(String userId);
    List<Booking> findByShowId(String showId);
    List<Booking> findByUserIdOrderByBookingDateDesc(String userId);
    List<Booking> findByBookingStatus(String status);
}
