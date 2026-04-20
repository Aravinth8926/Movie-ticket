package com.moviebooking.repository;

import com.moviebooking.model.Movie;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepository extends MongoRepository<Movie, String> {
    List<Movie> findByIsActiveTrue();
    List<Movie> findByGenreContaining(String genre);
    List<Movie> findByTitleContainingIgnoreCase(String title);
}
