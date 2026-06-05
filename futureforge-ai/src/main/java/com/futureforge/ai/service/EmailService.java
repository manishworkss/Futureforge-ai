package com.futureforge.ai.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendOtpEmail(String to, String otp) {
        log.info("Sending OTP email to {}", to);
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("FutureForge AI - Your Verification Code");
            message.setText("Welcome to FutureForge AI!\n\n" +
                    "Your registration verification code is: " + otp + "\n\n" +
                    "This code will expire in 5 minutes.\n\n" +
                    "If you did not request this code, please ignore this email.");
            
            mailSender.send(message);
            log.info("OTP email successfully sent to {}", to);
        } catch (Exception e) {
            log.error("Failed to send OTP email to {}", to, e);
            throw new RuntimeException("Failed to send email. Please try again later.");
        }
    }
}
