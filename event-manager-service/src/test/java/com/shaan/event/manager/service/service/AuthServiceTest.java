package com.shaan.event.manager.service.service;

import com.shaan.event.manager.service.dto.LoginRequest;
import com.shaan.event.manager.service.dto.LoginResponse;
import com.shaan.event.manager.service.dto.RegisterRequest;
import com.shaan.event.manager.service.dto.UserDTO;
import com.shaan.event.manager.service.entity.User;
import com.shaan.event.manager.service.entity.AccountStatus;
import com.shaan.event.manager.service.entity.Role;
import com.shaan.event.manager.service.exception.DuplicateEmailException;
import com.shaan.event.manager.service.exception.UnauthorizedException;
import com.shaan.event.manager.service.repository.UserRepository;
import com.shaan.event.manager.service.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for AuthService
 */
@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserService userService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    @InjectMocks
    private AuthService authService;

    private User testUser;
    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@college.edu");
        testUser.setPassword("hashedPassword");
        testUser.setFirstName("John");
        testUser.setLastName("Doe");
        testUser.setRole(Role.STUDENT);
        testUser.setAccountStatus(AccountStatus.ACTIVE);

        registerRequest = new RegisterRequest();
        registerRequest.setEmail("newuser@college.edu");
        registerRequest.setPassword("Pass123!");
        registerRequest.setFirstName("Jane");
        registerRequest.setLastName("Smith");

        loginRequest = new LoginRequest();
        loginRequest.setEmail("test@college.edu");
        loginRequest.setPassword("Pass123!");
    }

    @Test
    void testRegisterSuccess() {
        when(userService.existsByEmail(registerRequest.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(registerRequest.getPassword())).thenReturn("hashedPassword");
        when(userService.createUser(any(User.class))).thenReturn(testUser);

        User result = authService.register(registerRequest);

        assertNotNull(result);
        assertEquals(testUser.getEmail(), result.getEmail());
        assertEquals(testUser.getFirstName(), result.getFirstName());
    }

    @Test
    void testRegisterEmailAlreadyExists() {
        when(userService.existsByEmail(registerRequest.getEmail())).thenReturn(true);

        assertThrows(DuplicateEmailException.class, () -> authService.register(registerRequest));
    }

    @Test
    void testLoginSuccess() {
        when(userRepository.findByEmail(loginRequest.getEmail())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(loginRequest.getPassword(), testUser.getPassword())).thenReturn(true);
        when(tokenProvider.generateAccessToken(testUser.getEmail(), testUser.getRole().toString())).thenReturn("accessToken");
        when(tokenProvider.generateRefreshToken(testUser.getEmail())).thenReturn("refreshToken");
        when(tokenProvider.getExpirationTime()).thenReturn(86400000L);
        when(userService.convertToDTO(testUser)).thenReturn(new UserDTO());
        when(userService.updateUser(any(User.class))).thenReturn(testUser);

        LoginResponse result = authService.login(loginRequest);

        assertNotNull(result);
        assertEquals("accessToken", result.getAccessToken());
        assertEquals("refreshToken", result.getRefreshToken());
        assertNotNull(result.getUser());
    }

    @Test
    void testLoginUserNotFound() {
        when(userRepository.findByEmail(loginRequest.getEmail())).thenReturn(Optional.empty());

        assertThrows(UnauthorizedException.class, () -> authService.login(loginRequest));
    }

    @Test
    void testLoginInvalidPassword() {
        when(userRepository.findByEmail(loginRequest.getEmail())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(loginRequest.getPassword(), testUser.getPassword())).thenReturn(false);
        when(userService.updateUser(any(User.class))).thenReturn(testUser);

        assertThrows(UnauthorizedException.class, () -> authService.login(loginRequest));
    }

    @Test
    void testRefreshTokenSuccess() {
        String oldToken = "oldToken";
        String newToken = "newAccessToken";
        
        when(tokenProvider.validateToken(oldToken)).thenReturn(true);
        when(tokenProvider.getEmailFromToken(oldToken)).thenReturn(testUser.getEmail());
        when(userService.getUserByEmail(testUser.getEmail())).thenReturn(testUser);
        when(tokenProvider.generateAccessToken(testUser.getEmail(), testUser.getRole().toString())).thenReturn(newToken);
        when(tokenProvider.generateRefreshToken(testUser.getEmail())).thenReturn("newRefreshToken");
        when(tokenProvider.getExpirationTime()).thenReturn(86400000L);
        when(userService.convertToDTO(testUser)).thenReturn(new UserDTO());

        LoginResponse result = authService.refreshToken(oldToken);

        assertNotNull(result);
        assertEquals(newToken, result.getAccessToken());
        assertEquals("newRefreshToken", result.getRefreshToken());
    }

    @Test
    void testRefreshTokenInvalid() {
        String invalidToken = "invalidToken";
        when(tokenProvider.validateToken(invalidToken)).thenReturn(false);

        assertThrows(UnauthorizedException.class, () -> authService.refreshToken(invalidToken));
    }

    @Test
    void testGetCurrentUserSuccess() {
        when(userService.getUserByEmail(testUser.getEmail())).thenReturn(testUser);

        User result = authService.getCurrentUser(testUser.getEmail());

        assertNotNull(result);
        assertEquals(testUser.getEmail(), result.getEmail());
    }
}
