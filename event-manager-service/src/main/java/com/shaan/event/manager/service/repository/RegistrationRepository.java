package com.shaan.event.manager.service.repository;

import com.shaan.event.manager.service.entity.Registration;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    Optional<Registration> findByStudentIdAndEventId(Long studentId, Long eventId);
    
    List<Registration> findByStudentId(Long studentId);
    
    List<Registration> findByEventId(Long eventId);
    
    Page<Registration> findByStudentId(Long studentId, Pageable pageable);
    
    Page<Registration> findByEventId(Long eventId, Pageable pageable);
    
    Long countByEventId(Long eventId);
    
    boolean existsByStudentIdAndEventId(Long studentId, Long eventId);
}
