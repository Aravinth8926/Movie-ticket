package com.moviebooking.service;

import com.moviebooking.model.Movie;
import com.moviebooking.model.Show;
import com.moviebooking.model.Theater;
import com.moviebooking.repository.MovieRepository;
import com.moviebooking.repository.ShowRepository;
import com.moviebooking.repository.TheaterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShowService {

    private final ShowRepository showRepository;
    private final MovieRepository movieRepository;
    private final TheaterRepository theaterRepository;

    public List<Map<String, Object>> getAllShows() {
        List<Show> shows = showRepository.findAll();
        return enrichShowsWithDetails(shows);
    }

    public Optional<Map<String, Object>> getShowById(String id) {
        return showRepository.findById(id)
                .map(show -> enrichShowWithDetails(show));
    }

    public List<Map<String, Object>> getShowsByMovie(String movieId) {
        Date now = new Date();
        List<Show> shows = showRepository.findByMovieIdAndShowDateGreaterThanEqual(movieId, now);
        return enrichShowsWithDetails(shows);
    }

    public Show createShow(Show show) {
        Theater theater = theaterRepository.findById(show.getTheaterId())
                .orElseThrow(() -> new RuntimeException("Theater not found"));
        
        if (show.getAvailableSeats() == null) {
            show.setAvailableSeats(theater.getTotalSeats());
        }
        
        if (show.getStatus() == null) {
            show.setStatus("ACTIVE");
        }
        
        if (show.getBookedSeats() == null) {
            show.setBookedSeats(new ArrayList<>());
        }
        
        if (show.getLockedSeats() == null) {
            show.setLockedSeats(new ArrayList<>());
        }

        return showRepository.save(show);
    }

    public Show updateShow(String id, Show show) {
        Show existing = showRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Show not found"));
        
        show.setId(existing.getId());
        return showRepository.save(show);
    }

    public void cancelShow(String id) {
        Show show = showRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Show not found"));
        show.setStatus("CANCELLED");
        showRepository.save(show);
    }

    private List<Map<String, Object>> enrichShowsWithDetails(List<Show> shows) {
        return shows.stream()
                .map(this::enrichShowWithDetails)
                .collect(Collectors.toList());
    }

    private Map<String, Object> enrichShowWithDetails(Show show) {
        Map<String, Object> enriched = new HashMap<>();
        enriched.put("id", show.getId());
        enriched.put("showDate", show.getShowDate());
        enriched.put("showTime", show.getShowTime());
        enriched.put("availableSeats", show.getAvailableSeats());
        enriched.put("status", show.getStatus());

        // Add movie details
        movieRepository.findById(show.getMovieId()).ifPresent(movie -> {
            Map<String, Object> movieDetails = new HashMap<>();
            movieDetails.put("id", movie.getId());
            movieDetails.put("title", movie.getTitle());
            movieDetails.put("genre", movie.getGenre());
            movieDetails.put("duration", movie.getDuration());
            movieDetails.put("rating", movie.getRating());
            movieDetails.put("language", movie.getLanguage());
            movieDetails.put("posterUrl", movie.getPosterUrl());
            enriched.put("movie", movieDetails);
        });

        // Add theater details
        theaterRepository.findById(show.getTheaterId()).ifPresent(theater -> {
            Map<String, Object> theaterDetails = new HashMap<>();
            theaterDetails.put("id", theater.getId());
            theaterDetails.put("name", theater.getName());
            theaterDetails.put("location", theater.getLocation());
            theaterDetails.put("totalSeats", theater.getTotalSeats());
            enriched.put("theater", theaterDetails);
        });

        return enriched;
    }
}
