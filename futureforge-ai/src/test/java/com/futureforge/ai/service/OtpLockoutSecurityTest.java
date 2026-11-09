package com.futureforge.ai.service;

import com.futureforge.ai.entity.OTPVerification;
import com.futureforge.ai.exception.BadRequestException;
import com.futureforge.ai.repository.OTPVerificationRepository;
import com.futureforge.ai.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("OTP Security & Lockout Test Suite")
class OtpLockoutSecurityTest {

    @Mock
    private OTPVerificationRepository otpRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private OtpService otpService;

    private final String email = "student@futureforge.ai";
    private final String validOtp = "123456";

    @Test
    @DisplayName("Should validate successfully on first attempt with correct OTP")
    void shouldValidateCorrectOtp() {
        OTPVerification verification = OTPVerification.builder()
                .id(1L)
                .email(email)
                .otp(validOtp)
                .failedAttempts(0)
                .expiresAt(LocalDateTime.now().plusMinutes(5))
                .build();

        when(otpRepository.findTopByEmailOrderByCreatedAtDesc(email)).thenReturn(Optional.of(verification));

        boolean isValid = otpService.validateOtp(email, validOtp);
        assertTrue(isValid);
    }

    @Test
    @DisplayName("Should track failed attempts and inform candidate of remaining tries")
    void shouldTrackFailedAttempts() {
        OTPVerification verification = OTPVerification.builder()
                .id(1L)
                .email(email)
                .otp(validOtp)
                .failedAttempts(1)
                .expiresAt(LocalDateTime.now().plusMinutes(5))
                .build();

        when(otpRepository.findTopByEmailOrderByCreatedAtDesc(email)).thenReturn(Optional.of(verification));

        BadRequestException ex = assertThrows(BadRequestException.class, () -> {
            otpService.validateOtp(email, "999999");
        });

        assertTrue(ex.getMessage().contains("3 attempts remaining"));
        assertEquals(2, verification.getFailedAttempts());
        verify(otpRepository).save(verification);
    }

    @Test
    @DisplayName("Should lock out candidate and delete OTP record after 5 failed attempts")
    void shouldLockoutAfterFiveFailedAttempts() {
        OTPVerification verification = OTPVerification.builder()
                .id(1L)
                .email(email)
                .otp(validOtp)
                .failedAttempts(4)
                .expiresAt(LocalDateTime.now().plusMinutes(5))
                .build();

        when(otpRepository.findTopByEmailOrderByCreatedAtDesc(email)).thenReturn(Optional.of(verification));

        BadRequestException ex = assertThrows(BadRequestException.class, () -> {
            otpService.validateOtp(email, "000000");
        });

        assertTrue(ex.getMessage().contains("Too many invalid attempts"));
        verify(otpRepository).delete(verification);
    }

    @Test
    @DisplayName("Should reject and delete expired OTPs")
    void shouldRejectExpiredOtp() {
        OTPVerification expiredVerification = OTPVerification.builder()
                .id(1L)
                .email(email)
                .otp(validOtp)
                .failedAttempts(0)
                .expiresAt(LocalDateTime.now().minusMinutes(1)) // Expired
                .build();

        when(otpRepository.findTopByEmailOrderByCreatedAtDesc(email)).thenReturn(Optional.of(expiredVerification));

        BadRequestException ex = assertThrows(BadRequestException.class, () -> {
            otpService.validateOtp(email, validOtp);
        });

        assertTrue(ex.getMessage().contains("OTP has expired"));
        verify(otpRepository).delete(expiredVerification);
    }
}

