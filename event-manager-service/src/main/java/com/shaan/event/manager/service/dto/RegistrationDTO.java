package com.shaan.event.manager.service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegistrationDTO {
    private Long id;
    private UserDTO student;
    private EventDTO event;
    private LocalDateTime registrationDate;
    private String attendanceStatus;
    private String cancellationReason;
    private String removalReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
