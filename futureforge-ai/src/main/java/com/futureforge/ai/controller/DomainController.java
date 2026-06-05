package com.futureforge.ai.controller;

import com.futureforge.ai.dto.response.ApiResponse;
import com.futureforge.ai.dto.response.DomainRecommendationResponse;
import com.futureforge.ai.entity.User;
import com.futureforge.ai.service.DomainRecommendationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/domains")
@RequiredArgsConstructor
@Tag(name = "Domain Recommendation", description = "AI-powered IT domain suggestions")
public class DomainController {

    private final DomainRecommendationService domainService;

    @PostMapping("/recommend")
    @Operation(summary = "Generate domain recommendations based on profile")
    public ResponseEntity<ApiResponse<DomainRecommendationResponse>> recommendDomain(
            @AuthenticationPrincipal User user) {
        DomainRecommendationResponse response = domainService.recommendDomain(user);
        return ResponseEntity.ok(ApiResponse.success("Domain recommendations generated", response));
    }

    @GetMapping("/latest")
    @Operation(summary = "Get the latest domain recommendations")
    public ResponseEntity<ApiResponse<DomainRecommendationResponse>> getLatestRecommendation(
            @AuthenticationPrincipal User user) {
        DomainRecommendationResponse response = domainService.getLatestRecommendation(user);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
