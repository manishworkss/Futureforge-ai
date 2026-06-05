package com.futureforge.ai.service;

import com.futureforge.ai.entity.OTPVerification;
import com.futureforge.ai.exception.BadRequestException;
import com.futureforge.ai.repository.OTPVerificationRepository;
import com.futureforge.ai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpService {

    private final OTPVerificationRepository otpRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final SecureRandom secureRandom = new SecureRandom();

    @Transactional
    public void generateAndSendOtp(String email) {
        // Prevent sending OTP if email is already a fully registered LOCAL user
        userRepository.findByEmail(email).ifPresent(user -> {
            if (user.getProvider() != null && user.getProvider().name().equals("LOCAL")) {
                throw new BadRequestException("Email already registered with local account.");
            }
        });

        // Delete any existing OTPs for this email to prevent spam and ensure only the latest is valid
        otpRepository.deleteByEmail(email);

        // Generate 6-digit OTP
        String otp = String.format("%06d", secureRandom.nextInt(1000000));

        OTPVerification verification = OTPVerification.builder()
                .email(email)
                .otp(otp)
                .expiresAt(LocalDateTime.now().plusMinutes(5))
                .build();

        otpRepository.save(verification);

        // Send Email
        emailService.sendOtpEmail(email, otp);
    }

    @Transactional
    public boolean validateOtp(String email, String otp) {
        OTPVerification verification = otpRepository.findTopByEmailOrderByCreatedAtDesc(email)
                .orElseThrow(() -> new BadRequestException("No OTP found for this email. Please request a new one."));

        if (verification.getExpiresAt().isBefore(LocalDateTime.now())) {
            otpRepository.delete(verification);
            throw new BadRequestException("OTP has expired. Please request a new one.");
        }

        if (!verification.getOtp().equals(otp)) {
            throw new BadRequestException("Invalid OTP.");
        }

        // OTP is valid
        return true;
    }

    @Transactional
    public void deleteOtp(String email) {
        otpRepository.deleteByEmail(email);
    }
}
