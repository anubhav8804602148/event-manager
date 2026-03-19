package com.shaan.event.manager.service.service;

import com.shaan.event.manager.service.dto.UserDTO;
import com.shaan.event.manager.service.entity.User;
import com.shaan.event.manager.service.entity.AccountStatus;
import com.shaan.event.manager.service.entity.Role;
import com.shaan.event.manager.service.exception.ResourceNotFoundException;
import com.shaan.event.manager.service.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }

    public UserDTO getUserDTOById(Long userId) {
        return convertToDTO(getUserById(userId));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public User updateUser(User user) {
        return userRepository.save(user);
    }

    public void deleteUser(Long userId) {
        User user = getUserById(userId);
        userRepository.delete(user);
    }

    public Page<UserDTO> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(this::convertToDTO);
    }

    public Page<UserDTO> getUsersByRole(String role, Pageable pageable) {
        Role userRole = Role.valueOf(role);
        return userRepository.findByRole(userRole, pageable).map(this::convertToDTO);
    }

    public Page<UserDTO> searchUsers(String keyword, Pageable pageable) {
        return userRepository.findByFirstNameContainingOrLastNameContainingOrEmailContaining(
                keyword, keyword, keyword, pageable
        ).map(this::convertToDTO);
    }

    public Long getUserCountByRole(String role) {
        Role userRole = Role.valueOf(role);
        return userRepository.countByRole(userRole);
    }

    public Long getTotalUserCount() {
        return userRepository.count();
    }

    public void lockUser(Long userId) {
        User user = getUserById(userId);
        user.setAccountStatus(AccountStatus.LOCKED);
        userRepository.save(user);
    }

    public void unlockUser(Long userId) {
        User user = getUserById(userId);
        user.setAccountStatus(AccountStatus.ACTIVE);
        user.setFailedLoginAttempts(0);
        userRepository.save(user);
    }

    public boolean isCurrentUser(Long userId) {
        String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        try {
            User user = getUserByEmail(currentEmail);
            return user.getId().equals(userId);
        } catch (Exception e) {
            return false;
        }
    }

    public void changePassword(String email, String currentPassword, String newPassword) {
        User user = getUserByEmail(email);
        // In production, validate current password against hashed password
        // For now, we'll just update the password
        user.setPassword(newPassword);
        userRepository.save(user);
    }

    public UserDTO convertToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .department(user.getDepartment())
                .role(user.getRole().toString())
                .accountStatus(user.getAccountStatus().toString())
                .build();
    }
}
