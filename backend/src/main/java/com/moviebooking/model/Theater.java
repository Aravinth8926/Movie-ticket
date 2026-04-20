package com.moviebooking.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "theaters")
public class Theater {
    @Id
    private String id;
    private String name;
    private String location;
    private Integer totalSeats;
    private SeatLayout seatLayout;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SeatLayout {
        private Integer rows;
        private Integer seatsPerRow;
        private List<SeatCategory> categories;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SeatCategory {
        private String name; // GOLD, SILVER, PLATINUM
        private List<String> rows; // ["A", "B", "C"]
        private Double price;
    }
}
