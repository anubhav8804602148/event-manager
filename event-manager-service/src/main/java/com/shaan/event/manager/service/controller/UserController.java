package com.shaan.event.manager.service.controller;

import com.shaan.event.manager.service.dto.ApiResponse;
import com.shaan.event.manager.service.dto.UserDTO;
import com.shaan.event.manager.service.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<Object>> getProfile(Authentication authentication) {
        String userEmail = authentication.getName();
        UserDTO userDTO = userService.getUserDTOById(userService.getUserByEmail(userEmail).getId());
        return ResponseEntity.ok(ApiResponse.success("Profile fetched successfully", userDTO, 200));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<Object>> updateProfile(
            @RequestBody UserDTO userDTO,
            Authentication authentication) {
        String userEmail = authentication.getName();
        var user = userService.getUserByEmail(userEmail);
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setPhone(userDTO.getPhone());
        user.setDepartment(userDTO.getDepartment());
        var updatedUser = userService.updateUser(user);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", userService.convertToDTO(updatedUser), 200));
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<Object>> changePassword(
            @RequestBody ChangePasswordRequest request,
            Authentication authentication) {
        String userEmail = authentication.getName();
        userService.changePassword(userEmail, request.getCurrentPassword(), request.getNewPassword());
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully", null, 200));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Object>> getAllUsers(Pageable pageable) {
        Page<UserDTO> users = userService.getAllUsers(pageable);
        return ResponseEntity.ok(ApiResponse.success("Users fetched successfully", users, 200));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Object>> getUserById(@PathVariable Long id) {
        UserDTO userDTO = userService.getUserDTOById(id);
        return ResponseEntity.ok(ApiResponse.success("User fetched successfully", userDTO, 200));
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Object>> searchUsers(
            @RequestParam String keyword,
            Pageable pageable) {
        Page<UserDTO> users = userService.searchUsers(keyword, pageable);
        return ResponseEntity.ok(ApiResponse.success("Users searched successfully", users, 200));
    }

    @GetMapping("/role/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Object>> getUsersByRole(
            @PathVariable String role,
            Pageable pageable) {
        Page<UserDTO> users = userService.getUsersByRole(role, pageable);
        return ResponseEntity.ok(ApiResponse.success("Users fetched by role successfully", users, 200));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Object>> toggleUserStatus(
            @PathVariable Long id,
            @RequestBody ToggleStatusRequest request) {
        if (request.isEnabled()) {
            userService.unlockUser(id);
        } else {
            userService.lockUser(id);
        }
        UserDTO userDTO = userService.getUserDTOById(id);
        return ResponseEntity.ok(ApiResponse.success("User status updated successfully", userDTO, 200));
    }

    // Inner classes for request bodies
    public static class ChangePasswordRequest {
        private String currentPassword;
        private String newPassword;

        public String getCurrentPassword() {
            return currentPassword;
        }

        public void setCurrentPassword(String currentPassword) {
            this.currentPassword = currentPassword;
        }

        public String getNewPassword() {
            return newPassword;
        }

        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }
    }

    public static class ToggleStatusRequest {
        private boolean enabled;

        public boolean isEnabled() {
            return enabled;
        }

        public void setEnabled(boolean enabled) {
            this.enabled = enabled;
        }
    }
}
