package com.moviebooking.repository;

import com.moviebooking.model.Theater;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TheaterRepository extends MongoRepository<Theater, String> {
    List<Theater> findByLocationContainingIgnoreCase(String location);
    List<Theater> findByNameContainingIgnoreCase(String name);
}
