package com.shaan.event.manager.service.repository;

import com.shaan.event.manager.service.entity.Event;
import com.shaan.event.manager.service.entity.EventStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    Page<Event> findByStatus(EventStatus status, Pageable pageable);
    
    Page<Event> findByStatusAndCategory(EventStatus status, String category, Pageable pageable);
    
    Page<Event> findByStatusAndOrganizerId(EventStatus status, Long organizerId, Pageable pageable);
    
    @Query("SELECT e FROM Event e WHERE e.status = :status AND e.startDateTime >= :startDate AND e.startDateTime <= :endDate")
    Page<Event> findByStatusAndDateRange(
            @Param("status") EventStatus status,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable
    );
    
    @Query("SELECT e FROM Event e WHERE e.status = :status AND (LOWER(e.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(e.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Event> searchByKeyword(
            @Param("status") EventStatus status,
            @Param("keyword") String keyword,
            Pageable pageable
    );
    
    List<Event> findByOrganizerId(Long organizerId);
    
    List<Event> findByStartDateTimeAfterAndStatus(LocalDateTime startDateTime, EventStatus status);
}
