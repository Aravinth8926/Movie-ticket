package com.moviebooking.service;

import com.moviebooking.model.Movie;
import com.moviebooking.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MovieService {

    private final MovieRepository movieRepository;

    public List<Movie> getAllActiveMovies() {
        return movieRepository.findByIsActiveTrue();
    }

    public Optional<Movie> getMovieById(String id) {
        return movieRepository.findById(id);
    }

    public List<Movie> searchMovies(String title) {
        return movieRepository.findByTitleContainingIgnoreCase(title);
    }

    public Movie addMovie(Movie movie) {
        if (movie.getIsActive() == null) {
            movie.setIsActive(true);
        }
        return movieRepository.save(movie);
    }

    public Movie updateMovie(String id, Movie movie) {
        Movie existing = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        
        movie.setId(existing.getId());
        return movieRepository.save(movie);
    }

    public void deactivateMovie(String id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        movie.setIsActive(false);
        movieRepository.save(movie);
    }

    public List<Movie> getMoviesByGenre(String genre) {
        return movieRepository.findByGenreContaining(genre);
    }
}
