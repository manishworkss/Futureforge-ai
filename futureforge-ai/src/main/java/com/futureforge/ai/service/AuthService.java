package com.futureforge.ai.service;

import com.futureforge.ai.dto.request.LoginRequest;
import com.futureforge.ai.dto.request.VerifyOtpRequest;
import com.futureforge.ai.dto.response.AuthResponse;
import com.futureforge.ai.entity.AuthAuditLog;
import com.futureforge.ai.entity.User;
import com.futureforge.ai.entity.UserProfile;
import com.futureforge.ai.entity.enums.AuthProvider;
import com.futureforge.ai.entity.enums.Role;
import com.futureforge.ai.exception.BadRequestException;
import com.futureforge.ai.repository.AuthAuditLogRepository;
import com.futureforge.ai.repository.UserProfileRepository;
import com.futureforge.ai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final AuthAuditLogRepository auditLogRepository;
    private final OtpService otpService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse verifyOtpAndRegister(VerifyOtpRequest request, String ipAddress) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }

        // Validate OTP
        otpService.validateOtp(request.getEmail(), request.getOtp());

        // Check if email already exists as a LOCAL user
        userRepository.findByEmail(request.getEmail()).ifPresent(u -> {
            if (u.getProvider() == AuthProvider.LOCAL) {
                throw new BadRequestException("Email already registered: " + request.getEmail());
            }
        });

        // Delete used OTP
        otpService.deleteOtp(request.getEmail());

        // Either create new user or update an existing GOOGLE user that didn't have a password
        User user = userRepository.findByEmail(request.getEmail()).orElse(new User());
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setProvider(AuthProvider.LOCAL); // Set to LOCAL or retain GOOGLE? Actually, if they registered with OTP, it's LOCAL
        user.setEmailVerified(true);
        user.setRole(Role.USER);
        user.setIsActive(true);

        if (user.getProfile() == null) {
            UserProfile profile = UserProfile.builder()
                    .user(user)
                    .build();
            user.setProfile(profile);
        }

        user = userRepository.save(user);

        logAudit(user.getEmail(), "REGISTER_SUCCESS", ipAddress);
        log.info("New user registered via OTP: {}", user.getEmail());

        return buildAuthResponse(user);
    }

    public AuthResponse login(LoginRequest request, String ipAddress) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (Exception e) {
            logAudit(request.getEmail(), "LOGIN_FAILED", ipAddress);
            throw new BadRequestException("Invalid email or password");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        logAudit(user.getEmail(), "LOGIN_SUCCESS", ipAddress);
        log.info("User logged in: {}", user.getEmail());

        return buildAuthResponse(user);
    }

    public AuthResponse.UserResponse getCurrentUser(User user) {
        return AuthResponse.UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    public AuthResponse buildAuthResponse(User user) {
        String accessToken = jwtService.generateAccessToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .tokenType("Bearer")
                .expiresIn(jwtService.getAccessTokenExpiration())
                .user(AuthResponse.UserResponse.builder()
                        .id(user.getId())
                        .fullName(user.getFullName())
                        .email(user.getEmail())
                        .role(user.getRole().name())
                        .build())
                .build();
    }

    private void logAudit(String email, String action, String ipAddress) {
        AuthAuditLog auditLog = AuthAuditLog.builder()
                .userEmail(email)
                .action(action)
                .ipAddress(ipAddress)
                .build();
        auditLogRepository.save(auditLog);
    }
}
