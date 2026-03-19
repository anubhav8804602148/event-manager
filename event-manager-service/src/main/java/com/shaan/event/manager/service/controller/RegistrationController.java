package com.shaan.event.manager.service.controller;

import com.shaan.event.manager.service.dto.ApiResponse;
import com.shaan.event.manager.service.entity.AttendanceStatus;
import com.shaan.event.manager.service.entity.Registration;
import com.shaan.event.manager.service.entity.User;
import com.shaan.event.manager.service.service.RegistrationService;
import com.shaan.event.manager.service.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/registrations")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class RegistrationController {
    private final RegistrationService registrationService;
    private final UserService userService;

    public RegistrationController(RegistrationService registrationService, UserService userService) {
        this.registrationService = registrationService;
        this.userService = userService;
    }

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Object>> registerForEvent(
            @RequestParam Long eventId,
            Authentication authentication) {
        String studentEmail = authentication.getName();
        Registration registration = registrationService.registerForEvent(eventId, studentEmail);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Registered for event successfully", registrationService.convertToDTO(registration), 201));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> getRegistrationById(@PathVariable Long id) {
        Registration registration = registrationService.getRegistrationById(id);
        return ResponseEntity.ok(ApiResponse.success("Registration fetched successfully", registrationService.convertToDTO(registration), 200));
    }

    @GetMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Object>> getMyRegistrations(Authentication authentication, Pageable pageable) {
        String studentEmail = authentication.getName();
        User student = userService.getUserByEmail(studentEmail);
        Page<Registration> registrations = registrationService.getStudentRegistrations(student.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.success("My registrations fetched successfully", 
                registrations.map(registrationService::convertToDTO), 200));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Object>> cancelRegistration(
            @PathVariable Long id,
            Authentication authentication) {
        String studentEmail = authentication.getName();
        registrationService.cancelRegistration(id, studentEmail);
        return ResponseEntity.ok(ApiResponse.success("Registration cancelled successfully", null, 200));
    }

    @GetMapping("/event/{eventId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Object>> getEventRegistrations(
            @PathVariable Long eventId,
            Pageable pageable) {
        Page<Registration> registrations = registrationService.getEventRegistrations(eventId, pageable);
        return ResponseEntity.ok(ApiResponse.success("Event registrations fetched", registrations.map(registrationService::convertToDTO), 200));
    }

    @PostMapping("/{id}/attendance")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Object>> markAttendance(
            @PathVariable Long id,
            @RequestParam AttendanceStatus status) {
        Registration registration = registrationService.markAttendance(id, status);
        return ResponseEntity.ok(ApiResponse.success("Attendance marked successfully", registrationService.convertToDTO(registration), 200));
    }

    @GetMapping("/event/{eventId}/count")
    public ResponseEntity<ApiResponse<Object>> getRegistrationCount(@PathVariable Long eventId) {
        Long count = registrationService.getRegistrationCount(eventId);
        return ResponseEntity.ok(ApiResponse.success("Registration count fetched", count, 200));
    }

    @GetMapping("/event/{eventId}/check/{studentId}")
    public ResponseEntity<ApiResponse<Object>> checkIfRegistered(
            @PathVariable Long studentId,
            @PathVariable Long eventId) {
        boolean isRegistered = registrationService.isRegisteredForEvent(studentId, eventId);
        return ResponseEntity.ok(ApiResponse.success("Registration status checked", isRegistered, 200));
    }
}
