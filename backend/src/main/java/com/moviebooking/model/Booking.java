package com.moviebooking.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "bookings")
public class Booking {
    @Id
    private String id;
    private String bookingId; // BK-2024-XXXXX
    private String userId;
    private String showId;
    private String movieName;
    private String theaterName;
    private Date showDate;
    private String showTime;
    private List<String> selectedSeats;
    private String seatCategory;
    private Double pricePerSeat;
    private Double totalAmount;
    private String bookingStatus; // CONFIRMED, CANCELLED, PENDING
    private Date bookingDate;
    private String paymentId;
    private String paymentStatus; // PAID, REFUNDED, PENDING
    private PriceBreakdown priceBreakdown;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PriceBreakdown {
        private Double basePrice;
        private Double weekendSurcharge;
        private Double firstShowSurcharge;
        private Double subtotal;
        private Double gst;
        private Double total;
    }
}
