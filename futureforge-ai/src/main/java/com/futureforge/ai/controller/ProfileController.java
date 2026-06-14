package com.futureforge.ai.controller;

import com.futureforge.ai.dto.ProfileRequest;
import com.futureforge.ai.dto.ProfileResponse;
import com.futureforge.ai.entity.User;
import com.futureforge.ai.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@Tag(name = "Profile", description = "Profile Management API")
@SecurityRequirement(name = "bearerAuth")
public class ProfileController {

    private final ProfileService profileService;
    private final com.futureforge.ai.service.AiOrchestrationService aiOrchestrationService;

    @GetMapping
    @Operation(summary = "Get current user profile")
    public ResponseEntity<ProfileResponse> getProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(profileService.getProfile(user));
    }

    @PutMapping
    @Operation(summary = "Create or update user profile")
    public ResponseEntity<ProfileResponse> updateProfile(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ProfileRequest request) {
        return ResponseEntity.ok(profileService.updateProfile(user, request));
    }
    
    @PostMapping("/upload-resume")
    @Operation(summary = "Upload resume to extract profile data")
    public ResponseEntity<com.futureforge.ai.dto.response.ApiResponse<String>> uploadResume(
            @AuthenticationPrincipal User user,
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("File is empty");
            }
            
            // Extract text using PDFBox
            try (org.apache.pdfbox.pdmodel.PDDocument document = org.apache.pdfbox.Loader.loadPDF(file.getBytes())) {
                org.apache.pdfbox.text.PDFTextStripper stripper = new org.apache.pdfbox.text.PDFTextStripper();
                String text = stripper.getText(document);
                
                String extractedJson = aiOrchestrationService.parseResumeToProfile(text);
                return ResponseEntity.ok(com.futureforge.ai.dto.response.ApiResponse.success("Resume parsed successfully", extractedJson));
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to process resume: " + e.getMessage());
        }
    }
}
