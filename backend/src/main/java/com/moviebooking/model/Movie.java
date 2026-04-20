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
@Document(collection = "movies")
public class Movie {
    @Id
    private String id;
    private String title;
    private List<String> genre;
    private Integer duration; // in minutes
    private String rating; // U, UA, A
    private String language;
    private Date releaseDate;
    private String posterUrl;
    private String description;
    private List<String> cast;
    private String director;
    private Boolean isActive = true;
}
