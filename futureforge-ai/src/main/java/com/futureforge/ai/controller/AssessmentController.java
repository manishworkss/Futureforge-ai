package com.futureforge.ai.controller;

import com.futureforge.ai.dto.request.AssessmentSubmitRequest;
import com.futureforge.ai.dto.request.CodeEvaluationRequest;
import com.futureforge.ai.dto.response.ApiResponse;
import com.futureforge.ai.dto.response.AssessmentResponse;
import com.futureforge.ai.dto.response.AssessmentResultResponse;
import com.futureforge.ai.dto.response.CodeEvaluationResponse;
import com.futureforge.ai.dto.response.McqQuestion;
import com.futureforge.ai.entity.User;
import com.futureforge.ai.service.AiOrchestrationService;
import com.futureforge.ai.service.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assessment")
@RequiredArgsConstructor
@Tag(name = "Assessment", description = "AI Skill Assessment API")
@SecurityRequirement(name = "bearerAuth")
public class AssessmentController {

    private final AiOrchestrationService aiOrchestrationService;
    private final JwtService jwtService;
    private final ObjectMapper objectMapper;

    @GetMapping("/generate")
    @Operation(summary = "Generate a skill assessment for a given domain")
    public ResponseEntity<ApiResponse<AssessmentResponse>> generateAssessment(
            @AuthenticationPrincipal User user,
            @RequestParam("domain") String domain) {
        
        try {
            String aiJson = aiOrchestrationService.generateAssessment(domain);
            AssessmentResponse response = objectMapper.readValue(aiJson, AssessmentResponse.class);

            if (response.getMcqs() != null && !response.getMcqs().isEmpty()) {
                // Extract answer key and generate cryptographically signed assessment token
                List<Integer> answerKey = response.getMcqs().stream()
                        .map(McqQuestion::getCorrectOptionIndex)
                        .toList();
                
                String token = jwtService.generateAssessmentToken(user.getUsername(), domain, answerKey);
                response.setAssessmentToken(token);

                // Conceal answer key so correct options are never leaked to client network traffic
                response.getMcqs().forEach(q -> q.setCorrectOptionIndex(-1));
            }

            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate assessment: " + e.getMessage(), e);
        }
    }

    @PostMapping("/submit")
    @Operation(summary = "Submit assessment answers for server-side grading and validation")
    public ResponseEntity<ApiResponse<AssessmentResultResponse>> submitAssessment(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody AssessmentSubmitRequest request) {

        try {
            List<Integer> answerKey = jwtService.extractAssessmentAnswers(
                    request.getAssessmentToken(), 
                    user.getUsername(), 
                    request.getDomain()
            );

            int correctCount = 0;
            List<Integer> userAnswers = request.getAnswers() != null ? request.getAnswers() : List.of();
            for (int i = 0; i < answerKey.size() && i < userAnswers.size(); i++) {
                if (answerKey.get(i).equals(userAnswers.get(i))) {
                    correctCount++;
                }
            }

            int total = answerKey.size();
            double percentage = total > 0 ? (correctCount * 100.0 / total) : 0.0;

            List<String> codingSolutions = request.getCodingAnswers() != null ? request.getCodingAnswers() : List.of();
            String coding1 = !codingSolutions.isEmpty() ? codingSolutions.get(0) : "Not attempted";
            String coding2 = codingSolutions.size() > 1 ? codingSolutions.get(1) : "Not attempted";

            String verifiedContext = String.format("""
                    Verified Diagnostic Assessment Performance for Role: %s
                    - Technical Multiple-Choice Score: %d / %d (%.0f%%)
                    - Challenge 1 Solution:
                    %s
                    - Challenge 2 Solution:
                    %s
                    Curriculum Directives:
                    If MCQ score is under 60%% or code lacks key logic, enforce foundational modules first.
                    If MCQ score is >= 80%% with solid code, accelerate into advanced distributed patterns.
                    """, request.getDomain(), correctCount, total, percentage, coding1, coding2);

            AssessmentResultResponse result = AssessmentResultResponse.builder()
                    .score(correctCount)
                    .total(total)
                    .percentage(percentage)
                    .assessmentContext(verifiedContext)
                    .build();

            return ResponseEntity.ok(ApiResponse.success(result));
        } catch (Exception e) {
            throw new RuntimeException("Assessment submission error: " + e.getMessage(), e);
        }
    }

    @PostMapping("/evaluate-code")
    @Operation(summary = "Evaluate a code snippet via the AI virtual compiler")
    public ResponseEntity<ApiResponse<CodeEvaluationResponse>> evaluateCode(
            @AuthenticationPrincipal User user,
            @RequestBody CodeEvaluationRequest request) {
        
        try {
            String aiJson = aiOrchestrationService.evaluateCodeSnippet(
                    request.getTaskTitle(), 
                    request.getTaskDescription(), 
                    request.getCodeSnippet()
            );
            CodeEvaluationResponse response = objectMapper.readValue(aiJson, CodeEvaluationResponse.class);
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (Exception e) {
            throw new RuntimeException("Failed to evaluate code: " + e.getMessage(), e);
        }
    }
}
