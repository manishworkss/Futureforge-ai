package com.futureforge.ai.controller;

import com.futureforge.ai.dto.request.LoginRequest;
import com.futureforge.ai.dto.request.SendOtpRequest;
import com.futureforge.ai.dto.request.VerifyOtpRequest;
import com.futureforge.ai.dto.response.ApiResponse;
import com.futureforge.ai.dto.response.AuthResponse;
import com.futureforge.ai.entity.User;
import com.futureforge.ai.service.AuthService;
import com.futureforge.ai.service.OtpService;
import jakarta.servlet.http.HttpServletRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "User registration and login")
public class AuthController {

    private final AuthService authService;
    private final OtpService otpService;

    @PostMapping("/send-otp")
    @Operation(summary = "Send OTP to email for registration")
    public ResponseEntity<ApiResponse<Void>> sendOtp(@Valid @RequestBody SendOtpRequest request) {
        otpService.generateAndSendOtp(request.getEmail());
        return ResponseEntity.ok(ApiResponse.success("OTP sent to your email", null));
    }

    @PostMapping("/verify-otp")
    @Operation(summary = "Verify OTP and complete registration")
    public ResponseEntity<ApiResponse<AuthResponse>> verifyOtp(
            @Valid @RequestBody VerifyOtpRequest request,
            HttpServletRequest servletRequest) {
        AuthResponse response = authService.verifyOtpAndRegister(request, servletRequest.getRemoteAddr());
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Registration successful", response));
    }

    @PostMapping("/login")
    @Operation(summary = "Login with email and password")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest servletRequest) {
        AuthResponse response = authService.login(request, servletRequest.getRemoteAddr());
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user info")
    public ResponseEntity<ApiResponse<AuthResponse.UserResponse>> getCurrentUser(
            @AuthenticationPrincipal User user) {
        AuthResponse.UserResponse response = authService.getCurrentUser(user);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
