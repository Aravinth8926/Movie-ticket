package com.moviebooking.controller;

import com.moviebooking.model.Show;
import com.moviebooking.service.SeatService;
import com.moviebooking.service.ShowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/shows")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ShowController {

    private final ShowService showService;
    private final SeatService seatService;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllShows() {
        return ResponseEntity.ok(showService.getAllShows());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getShowById(@PathVariable String id) {
        return showService.getShowById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<Map<String, Object>>> getShowsByMovie(@PathVariable String movieId) {
        return ResponseEntity.ok(showService.getShowsByMovie(movieId));
    }

    @GetMapping("/{id}/seats")
    public ResponseEntity<Map<String, Object>> getSeatAvailability(@PathVariable String id) {
        return ResponseEntity.ok(seatService.getSeatAvailability(id));
    }

    @PostMapping
    public ResponseEntity<Show> createShow(@RequestBody Show show) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(showService.createShow(show));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Show> updateShow(@PathVariable String id, @RequestBody Show show) {
        return ResponseEntity.ok(showService.updateShow(id, show));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelShow(@PathVariable String id) {
        showService.cancelShow(id);
        return ResponseEntity.noContent().build();
    }
}
