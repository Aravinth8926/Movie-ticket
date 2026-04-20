package com.moviebooking.service;

import com.moviebooking.model.Booking;
import com.moviebooking.model.Movie;
import com.moviebooking.model.Show;
import com.moviebooking.model.Theater;
import com.moviebooking.repository.BookingRepository;
import com.moviebooking.repository.MovieRepository;
import com.moviebooking.repository.ShowRepository;
import com.moviebooking.repository.TheaterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ShowRepository showRepository;
    private final MovieRepository movieRepository;
    private final TheaterRepository theaterRepository;
    private final SeatService seatService;

    @Value("${booking.id.prefix}")
    private String bookingIdPrefix;

    @Transactional
    public Booking createBooking(Booking booking, String sessionId) {
        // Generate booking ID
        booking.setBookingId(generateBookingId());
        booking.setBookingDate(new Date());
        booking.setBookingStatus("PENDING");
        booking.setPaymentStatus("PENDING");

        // Get show details
        Show show = showRepository.findById(booking.getShowId())
                .orElseThrow(() -> new RuntimeException("Show not found"));

        // Get movie and theater details
        Movie movie = movieRepository.findById(show.getMovieId())
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        Theater theater = theaterRepository.findById(show.getTheaterId())
                .orElseThrow(() -> new RuntimeException("Theater not found"));

        booking.setMovieName(movie.getTitle());
        booking.setTheaterName(theater.getName());
        booking.setShowDate(show.getShowDate());
        booking.setShowTime(show.getShowTime());

        // Calculate price
        Booking.PriceBreakdown priceBreakdown = calculatePrice(
                booking.getSeatCategory(),
                booking.getSelectedSeats().size(),
                show.getShowDate(),
                show.getShowTime(),
                theater
        );
        booking.setPriceBreakdown(priceBreakdown);
        booking.setTotalAmount(priceBreakdown.getTotal());

        // Save booking
        Booking savedBooking = bookingRepository.save(booking);

        // Confirm seat booking (convert lock to booking)
        seatService.confirmSeatBooking(booking.getShowId(), booking.getSelectedSeats(), sessionId);

        // Update booking status to CONFIRMED
        savedBooking.setBookingStatus("CONFIRMED");
        savedBooking.setPaymentStatus("PAID");
        savedBooking.setPaymentId("PAY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());

        return bookingRepository.save(savedBooking);
    }

    public Optional<Booking> getBookingByBookingId(String bookingId) {
        return bookingRepository.findByBookingId(bookingId);
    }

    public List<Booking> getUserBookingHistory(String userId) {
        return bookingRepository.findByUserIdOrderByBookingDateDesc(userId);
    }

    @Transactional
    public Booking cancelBooking(String bookingId) {
        Booking booking = bookingRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Check if show has already started
        Show show = showRepository.findById(booking.getShowId())
                .orElseThrow(() -> new RuntimeException("Show not found"));

        Date now = new Date();
        if (show.getShowDate().before(now)) {
            throw new IllegalStateException("Cannot cancel show that has already started");
        }

        // Update booking status
        booking.setBookingStatus("CANCELLED");
        booking.setPaymentStatus("REFUNDED");

        // Release seats
        show.getBookedSeats().removeAll(booking.getSelectedSeats());
        show.setAvailableSeats(show.getAvailableSeats() + booking.getSelectedSeats().size());
        
        if (show.getStatus().equals("HOUSEFULL")) {
            show.setStatus("ACTIVE");
        }
        
        showRepository.save(show);

        return bookingRepository.save(booking);
    }

    public Booking.PriceBreakdown calculatePrice(String category, int numberOfSeats, 
                                                  Date showDate, String showTime,
                                                  Theater theater) {
        // Get base price from theater
        double basePrice = getBasePriceForCategory(category, theater);
        double totalBasePrice = basePrice * numberOfSeats;

        // Calculate surcharges
        double weekendSurcharge = 0.0;
        double firstShowSurcharge = 0.0;

        // Weekend surcharge (Friday-Sunday)
        LocalDate localDate = showDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        DayOfWeek dayOfWeek = localDate.getDayOfWeek();
        if (dayOfWeek == DayOfWeek.FRIDAY || dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY) {
            weekendSurcharge = totalBasePrice * 0.20; // 20% weekend surcharge
        }

        // First show surcharge (before 12 PM)
        if (showTime != null && isFirstShow(showTime)) {
            firstShowSurcharge = totalBasePrice * 0.30; // 30% first show surcharge
        }

        double subtotal = totalBasePrice + weekendSurcharge + firstShowSurcharge;
        double gst = subtotal * 0.18; // 18% GST
        double total = subtotal + gst;

        Booking.PriceBreakdown breakdown = new Booking.PriceBreakdown();
        breakdown.setBasePrice(totalBasePrice);
        breakdown.setWeekendSurcharge(weekendSurcharge);
        breakdown.setFirstShowSurcharge(firstShowSurcharge);
        breakdown.setSubtotal(subtotal);
        breakdown.setGst(gst);
        breakdown.setTotal(total);

        return breakdown;
    }

    private double getBasePriceForCategory(String category, Theater theater) {
        return theater.getSeatLayout().getCategories().stream()
                .filter(cat -> cat.getName().equalsIgnoreCase(category))
                .findFirst()
                .map(Theater.SeatCategory::getPrice)
                .orElse(150.0); // Default to SILVER price
    }

    private boolean isFirstShow(String showTime) {
        try {
            String[] parts = showTime.split(":");
            int hour = Integer.parseInt(parts[0]);
            return hour < 12;
        } catch (Exception e) {
            return false;
        }
    }

    private String generateBookingId() {
        Calendar cal = Calendar.getInstance();
        int year = cal.get(Calendar.YEAR);
        String randomPart = UUID.randomUUID().toString()
                .replaceAll("[^A-Z0-9]", "")
                .substring(0, 5)
                .toUpperCase();
        return bookingIdPrefix + "-" + year + "-" + randomPart;
    }
}
