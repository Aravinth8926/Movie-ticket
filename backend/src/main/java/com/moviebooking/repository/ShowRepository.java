package com.moviebooking.repository;

import com.moviebooking.model.Show;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface ShowRepository extends MongoRepository<Show, String> {
    List<Show> findByMovieId(String movieId);
    List<Show> findByTheaterId(String theaterId);
    List<Show> findByMovieIdAndShowDateGreaterThanEqual(String movieId, Date date);
    List<Show> findByShowDateBetween(Date startDate, Date endDate);
    List<Show> findByStatus(String status);
}
