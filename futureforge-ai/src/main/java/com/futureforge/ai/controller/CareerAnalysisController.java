package com.futureforge.ai.controller;

import com.futureforge.ai.dto.request.CareerAnalysisRequest;
import com.futureforge.ai.dto.response.ApiResponse;
import com.futureforge.ai.dto.response.CareerAnalysisResponse;
import com.futureforge.ai.entity.User;
import com.futureforge.ai.service.CareerAnalysisService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/career")
@RequiredArgsConstructor
@Tag(name = "Career Analysis", description = "AI-powered career analysis")
public class CareerAnalysisController {

    private final CareerAnalysisService careerAnalysisService;

    @PostMapping("/analyze")
    @Operation(summary = "Run an AI career analysis")
    public ResponseEntity<ApiResponse<CareerAnalysisResponse>> analyzeCareer(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CareerAnalysisRequest request) {
        CareerAnalysisResponse response = careerAnalysisService.analyzeCareer(user, request);
        return ResponseEntity.ok(ApiResponse.success("Career analysis completed", response));
    }

    @GetMapping("/analyses")
    @Operation(summary = "List all past career analyses")
    public ResponseEntity<ApiResponse<List<CareerAnalysisResponse>>> getAnalyses(
            @AuthenticationPrincipal User user) {
        List<CareerAnalysisResponse> responses = careerAnalysisService.getUserAnalyses(user);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/analyses/{id}")
    @Operation(summary = "Get a specific career analysis")
    public ResponseEntity<ApiResponse<CareerAnalysisResponse>> getAnalysis(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        CareerAnalysisResponse response = careerAnalysisService.getAnalysisById(user, id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
