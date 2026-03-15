package com.shaan.event.manager.service.service;

import com.shaan.event.manager.service.dto.LoginRequest;
import com.shaan.event.manager.service.dto.LoginResponse;
import com.shaan.event.manager.service.dto.RegisterRequest;
import com.shaan.event.manager.service.entity.AccountStatus;
import com.shaan.event.manager.service.entity.Role;
import com.shaan.event.manager.service.entity.User;
import com.shaan.event.manager.service.exception.DuplicateEmailException;
import com.shaan.event.manager.service.exception.UnauthorizedException;
import com.shaan.event.manager.service.repository.UserRepository;
import com.shaan.event.manager.service.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthService {
    private final UserRepository userRepository;
    private final UserService userService;
    private final JwtTokenProvider tokenProvider;
    private final PasswordEncoder passwordEncoder;
    private static final int MAX_LOGIN_ATTEMPTS = 5;
    private static final long LOCKOUT_DURATION_MINUTES = 30;

    public AuthService(UserRepository userRepository, UserService userService,
                      JwtTokenProvider tokenProvider, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.tokenProvider = tokenProvider;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(RegisterRequest request) {
        // Check if email already exists
        if (userService.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("Email already registered: " + request.getEmail());
        }

        // Create new user
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .department(request.getDepartment())
                .role(Role.STUDENT)
                .accountStatus(AccountStatus.ACTIVE)
                .failedLoginAttempts(0)
                .build();

        return userService.createUser(user);
    }

    public LoginResponse login(LoginRequest request) {
        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        // Check if account is locked
        if (user.getAccountStatus() == AccountStatus.LOCKED) {
            throw new UnauthorizedException("Account is locked. Please try again later.");
        }

        // Check if account is inactive
        if (user.getAccountStatus() == AccountStatus.INACTIVE) {
            throw new UnauthorizedException("Account is inactive. Contact administrator.");
        }

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            // Increment failed login attempts
            user.setFailedLoginAttempts(user.getFailedLoginAttempts() + 1);
            
            // Lock account if max attempts exceeded
            if (user.getFailedLoginAttempts() >= MAX_LOGIN_ATTEMPTS) {
                user.setAccountStatus(AccountStatus.LOCKED);
            }
            
            userService.updateUser(user);
            throw new UnauthorizedException("Invalid email or password");
        }

        // Reset failed login attempts on successful login
        user.setFailedLoginAttempts(0);
        userService.updateUser(user);

        // Generate tokens
        String accessToken = tokenProvider.generateAccessToken(user.getEmail(), user.getRole().toString());
        String refreshToken = tokenProvider.generateRefreshToken(user.getEmail());

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(tokenProvider.getExpirationTime())
                .user(userService.convertToDTO(user))
                .build();
    }

    public LoginResponse refreshToken(String refreshToken) {
        if (!tokenProvider.validateToken(refreshToken)) {
            throw new UnauthorizedException("Invalid or expired refresh token");
        }

        String email = tokenProvider.getEmailFromToken(refreshToken);
        User user = userService.getUserByEmail(email);

        String accessToken = tokenProvider.generateAccessToken(user.getEmail(), user.getRole().toString());
        String newRefreshToken = tokenProvider.generateRefreshToken(user.getEmail());

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(newRefreshToken)
                .tokenType("Bearer")
                .expiresIn(tokenProvider.getExpirationTime())
                .user(userService.convertToDTO(user))
                .build();
    }

    public User getCurrentUser(String email) {
        return userService.getUserByEmail(email);
    }
}
