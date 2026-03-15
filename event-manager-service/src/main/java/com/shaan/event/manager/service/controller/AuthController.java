package com.shaan.event.manager.service.controller;

import com.shaan.event.manager.service.dto.ApiResponse;
import com.shaan.event.manager.service.dto.LoginRequest;
import com.shaan.event.manager.service.dto.LoginResponse;
import com.shaan.event.manager.service.dto.RegisterRequest;
import com.shaan.event.manager.service.entity.User;
import com.shaan.event.manager.service.service.AuthService;
import com.shaan.event.manager.service.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AuthController {
    private final AuthService authService;
    private final UserService userService;

    public AuthController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Object>> register(@Valid @RequestBody RegisterRequest request) {
        User user = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("User registered successfully", userService.convertToDTO(user), 201));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response, 200));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<LoginResponse>> refresh(@RequestHeader("Authorization") String bearerToken) {
        String refreshToken = bearerToken.substring(7); // Remove "Bearer " prefix
        LoginResponse response = authService.refreshToken(refreshToken);
        return ResponseEntity.ok(ApiResponse.success("Token refreshed successfully", response, 200));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Object>> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Unauthorized", "User not authenticated", 401));
        }

        String email = authentication.getName();
        User user = authService.getCurrentUser(email);
        return ResponseEntity.ok(ApiResponse.success("Current user fetched", userService.convertToDTO(user), 200));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Object>> logout() {
        // Since we're using JWT, logout is handled client-side by removing the token
        return ResponseEntity.ok(ApiResponse.success("Logout successful", null, 200));
    }
}
