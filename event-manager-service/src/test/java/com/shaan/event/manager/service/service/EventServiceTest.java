package com.shaan.event.manager.service.service;

import com.shaan.event.manager.service.dto.EventDTO;
import com.shaan.event.manager.service.entity.Event;
import com.shaan.event.manager.service.entity.User;
import com.shaan.event.manager.service.entity.AccountStatus;
import com.shaan.event.manager.service.entity.Role;
import com.shaan.event.manager.service.entity.enums.EventStatus;
import com.shaan.event.manager.service.repository.EventRepository;
import com.shaan.event.manager.service.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Unit tests for EventService
 */
@ExtendWith(MockitoExtension.class)
class EventServiceTest {

    @Mock
    private EventRepository eventRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private EventService eventService;

    private Event testEvent;
    private User testUser;
    private EventDTO testEventDTO;
    private Pageable pageable;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("admin@college.edu");
        testUser.setFirstName("Admin");
        testUser.setLastName("User");
        testUser.setRole(Role.ADMIN);
        testUser.setAccountStatus(AccountStatus.ACTIVE);

        testEvent = new Event();
        testEvent.setId(1L);
        testEvent.setTitle("Tech Conference 2026");
        testEvent.setDescription("Annual tech conference");
        testEvent.setCategory("Conference");
        testEvent.setLocation("Auditorium");
        testEvent.setCapacity(100);
        testEvent.setStartDateTime(LocalDateTime.now().plusDays(7));
        testEvent.setEndDateTime(LocalDateTime.now().plusDays(7).plusHours(3));
        testEvent.setRegistrationDeadline(LocalDateTime.now().plusDays(5));
        testEvent.setStatus(EventStatus.APPROVED);
        testEvent.setOrganizer(testUser);

        testEventDTO = new EventDTO();
        testEventDTO.setTitle("Tech Conference 2026");
        testEventDTO.setDescription("Annual tech conference");
        testEventDTO.setCategory("Conference");
        testEventDTO.setLocation("Auditorium");
        testEventDTO.setCapacity(100);

        pageable = PageRequest.of(0, 10);
    }

    @Test
    void testCreateEventSuccess() {
        when(userRepository.findByEmail("admin@college.edu")).thenReturn(Optional.of(testUser));
        when(eventRepository.save(any(Event.class))).thenReturn(testEvent);

        Event result = eventService.createEvent(testEventDTO, "admin@college.edu");

        assertNotNull(result);
        assertEquals(testEvent.getTitle(), result.getTitle());
        assertEquals(EventStatus.PENDING, result.getStatus());
        verify(eventRepository, times(1)).save(any(Event.class));
    }

    @Test
    void testGetEventByIdSuccess() {
        when(eventRepository.findById(1L)).thenReturn(Optional.of(testEvent));

        Event result = eventService.getEventById(1L);

        assertNotNull(result);
        assertEquals(testEvent.getId(), result.getId());
    }

    @Test
    void testGetEventByIdNotFound() {
        when(eventRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> eventService.getEventById(1L));
    }

    @Test
    void testGetAllApprovedEventsSuccess() {
        List<Event> events = new ArrayList<>();
        events.add(testEvent);
        Page<Event> page = new PageImpl<>(events, pageable, events.size());

        when(eventRepository.findByStatus(EventStatus.APPROVED, pageable)).thenReturn(page);

        Page<Event> result = eventService.getAllApprovedEvents(pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
    }

    @Test
    void testApproveEventSuccess() {
        testEvent.setStatus(EventStatus.PENDING);
        when(eventRepository.findById(1L)).thenReturn(Optional.of(testEvent));
        when(eventRepository.save(any(Event.class))).thenReturn(testEvent);

        eventService.approveEvent(1L);

        verify(eventRepository, times(1)).save(any(Event.class));
    }

    @Test
    void testRejectEventSuccess() {
        testEvent.setStatus(EventStatus.PENDING);
        when(eventRepository.findById(1L)).thenReturn(Optional.of(testEvent));
        when(eventRepository.save(any(Event.class))).thenReturn(testEvent);

        eventService.rejectEvent(1L, "Invalid event");

        verify(eventRepository, times(1)).save(any(Event.class));
    }

    @Test
    void testSearchEventsByKeywordSuccess() {
        List<Event> searchResults = new ArrayList<>();
        searchResults.add(testEvent);
        Page<Event> page = new PageImpl<>(searchResults, pageable, searchResults.size());

        when(eventRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnaseAndStatus(
                anyString(), anyString(), any(EventStatus.class), any(Pageable.class)))
                .thenReturn(page);

        Page<Event> result = eventService.searchEvents("Tech", pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
    }

    @Test
    void testGetEventsByCategory() {
        List<Event> events = new ArrayList<>();
        events.add(testEvent);
        Page<Event> page = new PageImpl<>(events, pageable, events.size());

        when(eventRepository.findByCategoryAndStatus(anyString(), any(EventStatus.class), any(Pageable.class)))
                .thenReturn(page);

        Page<Event> result = eventService.filterByCategory("Conference", pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
    }

    @Test
    void testUpdateEventSuccess() {
        testEvent.setTitle("Updated Title");
        when(eventRepository.findById(1L)).thenReturn(Optional.of(testEvent));
        when(eventRepository.save(any(Event.class))).thenReturn(testEvent);

        Event result = eventService.updateEvent(1L, testEventDTO);

        assertNotNull(result);
        assertEquals("Updated Title", result.getTitle());
        verify(eventRepository, times(1)).save(any(Event.class));
    }

    @Test
    void testDeleteEventSuccess() {
        doNothing().when(eventRepository).deleteById(1L);

        assertDoesNotThrow(() -> eventService.deleteEvent(1L));
        verify(eventRepository, times(1)).deleteById(1L);
    }

    @Test
    void testConvertToDTOSuccess() {
        EventDTO result = eventService.convertToDTO(testEvent);

        assertNotNull(result);
        assertEquals(testEvent.getTitle(), result.getTitle());
        assertEquals(testEvent.getCategory(), result.getCategory());
    }

    @Test
    void testGetEventCountSuccess() {
        when(eventRepository.count()).thenReturn(15L);

        long result = eventService.getEventCount();

        assertEquals(15L, result);
    }
}
