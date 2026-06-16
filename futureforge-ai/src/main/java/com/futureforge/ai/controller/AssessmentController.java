package com.futureforge.ai.controller;

import com.futureforge.ai.dto.response.ApiResponse;
import com.futureforge.ai.dto.response.AssessmentResponse;
import com.futureforge.ai.entity.User;
import com.futureforge.ai.service.AiOrchestrationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/assessment")
@RequiredArgsConstructor
@Tag(name = "Assessment", description = "AI Skill Assessment API")
@SecurityRequirement(name = "bearerAuth")
public class AssessmentController {

    private final AiOrchestrationService aiOrchestrationService;
    private final ObjectMapper objectMapper;

    @GetMapping("/generate")
    @Operation(summary = "Generate a skill assessment for a given domain")
    public ResponseEntity<ApiResponse<AssessmentResponse>> generateAssessment(
            @AuthenticationPrincipal User user,
            @RequestParam("domain") String domain) {
        
        try {
            String aiJson = aiOrchestrationService.generateAssessment(domain);
            AssessmentResponse response = objectMapper.readValue(aiJson, AssessmentResponse.class);
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate assessment: " + e.getMessage());
        }
    }

    @PostMapping("/evaluate-code")
    @Operation(summary = "Evaluate a code snippet via the AI virtual compiler")
    public ResponseEntity<ApiResponse<com.futureforge.ai.dto.response.CodeEvaluationResponse>> evaluateCode(
            @AuthenticationPrincipal User user,
            @RequestBody com.futureforge.ai.dto.request.CodeEvaluationRequest request) {
        
        try {
            String aiJson = aiOrchestrationService.evaluateCodeSnippet(
                    request.getTaskTitle(), 
                    request.getTaskDescription(), 
                    request.getCodeSnippet()
            );
            com.futureforge.ai.dto.response.CodeEvaluationResponse response = objectMapper.readValue(aiJson, com.futureforge.ai.dto.response.CodeEvaluationResponse.class);
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (Exception e) {
            throw new RuntimeException("Failed to evaluate code: " + e.getMessage());
        }
    }
}
