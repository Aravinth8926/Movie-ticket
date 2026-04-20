package com.moviebooking.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "shows")
public class Show {
    @Id
    private String id;
    private String movieId;
    private String theaterId;
    private Date showDate;
    private String showTime;
    private Integer availableSeats;
    private List<String> bookedSeats = new ArrayList<>();
    private List<SeatLock> lockedSeats = new ArrayList<>();
    private String status; // ACTIVE, CANCELLED, HOUSEFULL
    
    @Version
    private Long version; // For optimistic locking

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SeatLock {
        private String seatNumber;
        private String sessionId;
        private Date lockedAt;
        private Date expiresAt;
    }
}
