package com.futureforge.ai.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:bcawithmanish0008@gmail.com}")
    private String fromEmail;

    @Value("${brevo.api.key:}")
    private String brevoApiKey;

    @Async
    public void sendOtpEmail(String to, String otp) {
        log.info("Sending OTP email to {}", to);
        String subject = "FutureForge AI - Your Verification Code";
        String text = "Welcome to FutureForge AI!\n\n" +
                "Your registration verification code is: " + otp + "\n\n" +
                "This code will expire in 5 minutes.\n\n" +
                "If you did not request this code, please ignore this email.";

        // Strategy 1: Brevo REST API (HTTPS Port 443 - Bypasses Cloud Firewalls)
        if (brevoApiKey != null && !brevoApiKey.isBlank()) {
            try {
                RestTemplate restTemplate = new RestTemplate();
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.set("api-key", brevoApiKey);

                Map<String, Object> body = new HashMap<>();
                Map<String, String> sender = new HashMap<>();
                sender.put("name", "FutureForge AI");
                sender.put("email", fromEmail);
                body.put("sender", sender);

                Map<String, String> recipient = new HashMap<>();
                recipient.put("email", to);
                body.put("to", Collections.singletonList(recipient));
                body.put("subject", subject);
                body.put("textContent", text);

                HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
                restTemplate.postForEntity("https://api.brevo.com/v3/smtp/email", request, String.class);
                log.info("🚀 OTP email successfully sent via Brevo HTTP API to {}", to);
                return;
            } catch (Exception e) {
                log.error("Brevo API email failed: {}", e.getMessage());
            }
        }

        // Strategy 2: JavaMail SMTP (Port 587)
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            
            mailSender.send(message);
            log.info("OTP email successfully sent via SMTP to {}", to);
        } catch (Exception e) {
            log.error("Failed to send OTP email to {}: {}", to, e.getMessage());
            log.warn("==========================================================");
            log.warn("📧 [LOCAL DEV MODE] Email sending failed (SMTP/HTTP not configured)");
            log.warn("🔑 Your verification OTP code for [{}] is: {}", to, otp);
            log.warn("==========================================================");
        }
    }
}
