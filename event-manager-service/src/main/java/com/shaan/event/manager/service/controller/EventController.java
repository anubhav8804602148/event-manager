package com.shaan.event.manager.service.controller;

import com.shaan.event.manager.service.dto.ApiResponse;
import com.shaan.event.manager.service.dto.EventDTO;
import com.shaan.event.manager.service.entity.Event;
import com.shaan.event.manager.service.entity.EventStatus;
import com.shaan.event.manager.service.service.EventService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/events")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class EventController {
    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Object>> createEvent(@Valid @RequestBody EventDTO eventDTO, Authentication authentication) {
        String organizerEmail = authentication.getName();
        Event event = eventService.createEvent(eventDTO, organizerEmail);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Event created successfully", eventService.convertToDTO(event), 201));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> getEventById(@PathVariable Long id) {
        Event event = eventService.getEventById(id);
        return ResponseEntity.ok(ApiResponse.success("Event fetched successfully", eventService.convertToDTO(event), 200));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Object>> getAllApprovedEvents(Pageable pageable) {
        Page<Event> events = eventService.getAllApprovedEvents(pageable);
        return ResponseEntity.ok(ApiResponse.success("Events fetched successfully", events.map(eventService::convertToDTO), 200));
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Object>> getAllEventsForAdmin(
            @RequestParam(required = false) String status,
            Pageable pageable) {
        EventStatus eventStatus = null;
        if (status != null && !status.isEmpty()) {
            try {
                eventStatus = EventStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Invalid status: " + status, null, 400));
            }
        }
        Page<Event> events = eventService.getAllEventsForAdmin(eventStatus, pageable);
        return ResponseEntity.ok(ApiResponse.success("Events fetched successfully", events.map(eventService::convertToDTO), 200));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Object>> searchEvents(@RequestParam String keyword, Pageable pageable) {
        Page<Event> events = eventService.searchEvents(keyword, pageable);
        return ResponseEntity.ok(ApiResponse.success("Events searched successfully", events.map(eventService::convertToDTO), 200));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<Object>> getEventsByCategory(@PathVariable String category, Pageable pageable) {
        Page<Event> events = eventService.getEventsByCategory(category, pageable);
        return ResponseEntity.ok(ApiResponse.success("Events filtered by category", events.map(eventService::convertToDTO), 200));
    }

    @GetMapping("/date-range")
    public ResponseEntity<ApiResponse<Object>> getEventsByDateRange(
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate,
            Pageable pageable) {
        Page<Event> events = eventService.getEventsByDateRange(startDate, endDate, pageable);
        return ResponseEntity.ok(ApiResponse.success("Events filtered by date range", events.map(eventService::convertToDTO), 200));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<ApiResponse<Object>> getUpcomingEvents() {
        List<Event> events = eventService.getUpcomingEvents();
        return ResponseEntity.ok(ApiResponse.success("Upcoming events fetched", eventService.convertToDTOs(events), 200));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Object>> updateEvent(
            @PathVariable Long id,
            @Valid @RequestBody EventDTO eventDTO,
            Authentication authentication) {
        String organizerEmail = authentication.getName();
        Event event = eventService.updateEvent(id, eventDTO, organizerEmail);
        return ResponseEntity.ok(ApiResponse.success("Event updated successfully", eventService.convertToDTO(event), 200));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Object>> deleteEvent(@PathVariable Long id, Authentication authentication) {
        String organizerEmail = authentication.getName();
        eventService.deleteEvent(id, organizerEmail);
        return ResponseEntity.ok(ApiResponse.success("Event deleted successfully", null, 200));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Object>> approveEvent(@PathVariable Long id) {
        Event event = eventService.approveEvent(id);
        return ResponseEntity.ok(ApiResponse.success("Event approved successfully", eventService.convertToDTO(event), 200));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Object>> rejectEvent(
            @PathVariable Long id,
            @RequestParam String rejectionReason) {
        Event event = eventService.rejectEvent(id, rejectionReason);
        return ResponseEntity.ok(ApiResponse.success("Event rejected successfully", eventService.convertToDTO(event), 200));
    }

    @GetMapping("/organizer/{organizerId}")
    public ResponseEntity<ApiResponse<Object>> getEventsByOrganizer(@PathVariable Long organizerId) {
        List<Event> events = eventService.getEventsByOrganizer(organizerId);
        return ResponseEntity.ok(ApiResponse.success("Organizer's events fetched", eventService.convertToDTOs(events), 200));
    }
}
