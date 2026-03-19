package com.shaan.event.manager.service.service;

import com.shaan.event.manager.service.dto.EventDTO;
import com.shaan.event.manager.service.entity.Event;
import com.shaan.event.manager.service.entity.EventStatus;
import com.shaan.event.manager.service.entity.User;
import com.shaan.event.manager.service.exception.ResourceNotFoundException;
import com.shaan.event.manager.service.exception.UnauthorizedException;
import com.shaan.event.manager.service.repository.EventRepository;
import com.shaan.event.manager.service.repository.RegistrationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class EventService {
    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private final UserService userService;

    public EventService(EventRepository eventRepository, RegistrationRepository registrationRepository, UserService userService) {
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
        this.userService = userService;
    }

    // Create Event (Admin only)
    public Event createEvent(EventDTO eventDTO, String organizerEmail) {
        User organizer = userService.getUserByEmail(organizerEmail);
        
        Event event = Event.builder()
                .title(eventDTO.getTitle())
                .description(eventDTO.getDescription())
                .category(eventDTO.getCategory())
                .startDateTime(eventDTO.getStartDateTime())
                .endDateTime(eventDTO.getEndDateTime())
                .location(eventDTO.getLocation())
                .capacity(eventDTO.getCapacity())
                .registrationDeadline(eventDTO.getRegistrationDeadline())
                .imageUrl(eventDTO.getImageUrl())
                .organizer(organizer)
                .build();

        return eventRepository.save(event);
    }

    // Get Event by ID
    public Event getEventById(Long eventId) {
        return eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
    }

    // Get all approved events with pagination
    public Page<Event> getAllApprovedEvents(Pageable pageable) {
        return eventRepository.findByStatus(EventStatus.APPROVED, pageable);
    }

    // Get all events for admin with optional status filter
    public Page<Event> getAllEventsForAdmin(EventStatus status, Pageable pageable) {
        if (status != null) {
            return eventRepository.findByStatus(status, pageable);
        }
        return eventRepository.findAll(pageable);
    }

    // Get all events by organizer
    public List<Event> getEventsByOrganizer(Long organizerId) {
        return eventRepository.findByOrganizerId(organizerId);
    }

    // Search events by keyword
    public Page<Event> searchEvents(String keyword, Pageable pageable) {
        return eventRepository.searchByKeyword(EventStatus.APPROVED, keyword, pageable);
    }

    // Filter events by category
    public Page<Event> getEventsByCategory(String category, Pageable pageable) {
        return eventRepository.findByStatusAndCategory(EventStatus.APPROVED, category, pageable);
    }

    // Filter events by date range
    public Page<Event> getEventsByDateRange(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        return eventRepository.findByStatusAndDateRange(EventStatus.APPROVED, startDate, endDate, pageable);
    }

    // Update Event (Admin/Organizer only)
    public Event updateEvent(Long eventId, EventDTO eventDTO, String userEmail) {
        Event event = getEventById(eventId);
        
        // Check if user is the organizer
        if (!event.getOrganizer().getEmail().equals(userEmail)) {
            throw new UnauthorizedException("Only event organizer can update this event");
        }

        // Don't allow updates if event is already approved or completed
        if (event.getStatus() == EventStatus.APPROVED || event.getStatus() == EventStatus.COMPLETED) {
            throw new UnauthorizedException("Cannot update approved or completed events");
        }

        event.setTitle(eventDTO.getTitle());
        event.setDescription(eventDTO.getDescription());
        event.setCategory(eventDTO.getCategory());
        event.setStartDateTime(eventDTO.getStartDateTime());
        event.setEndDateTime(eventDTO.getEndDateTime());
        event.setLocation(eventDTO.getLocation());
        event.setCapacity(eventDTO.getCapacity());
        event.setRegistrationDeadline(eventDTO.getRegistrationDeadline());
        event.setImageUrl(eventDTO.getImageUrl());

        return eventRepository.save(event);
    }

    // Delete Event (Admin/Organizer only)
    public void deleteEvent(Long eventId, String userEmail) {
        Event event = getEventById(eventId);
        
        if (!event.getOrganizer().getEmail().equals(userEmail)) {
            throw new UnauthorizedException("Only event organizer can delete this event");
        }

        eventRepository.delete(event);
    }

    // Approve Event (Admin only)
    public Event approveEvent(Long eventId) {
        Event event = getEventById(eventId);
        
        if (event.getStatus() != EventStatus.PENDING) {
            throw new IllegalArgumentException("Only pending events can be approved");
        }

        event.setStatus(EventStatus.APPROVED);
        return eventRepository.save(event);
    }

    // Reject Event (Admin only)
    public Event rejectEvent(Long eventId, String rejectionReason) {
        Event event = getEventById(eventId);
        
        if (event.getStatus() != EventStatus.PENDING) {
            throw new IllegalArgumentException("Only pending events can be rejected");
        }

        event.setStatus(EventStatus.REJECTED);
        event.setRejectionReason(rejectionReason);
        return eventRepository.save(event);
    }

    // Get upcoming events
    public List<Event> getUpcomingEvents() {
        return eventRepository.findByStartDateTimeAfterAndStatus(LocalDateTime.now(), EventStatus.APPROVED);
    }

    // Convert Event to DTO
    public EventDTO convertToDTO(Event event) {
        long registrationCount = registrationRepository.countByEventId(event.getId());
        
        return EventDTO.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .category(event.getCategory())
                .startDateTime(event.getStartDateTime())
                .endDateTime(event.getEndDateTime())
                .location(event.getLocation())
                .capacity(event.getCapacity())
                .registrationDeadline(event.getRegistrationDeadline())
                .imageUrl(event.getImageUrl())
                .status(event.getStatus().toString())
                .rejectionReason(event.getRejectionReason())
                .organizer(userService.convertToDTO(event.getOrganizer()))
                .currentRegistrations(registrationCount)
                .createdAt(event.getCreatedAt())
                .updatedAt(event.getUpdatedAt())
                .build();
    }

    // Convert list of Events to DTOs
    public List<EventDTO> convertToDTOs(List<Event> events) {
        return events.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}
