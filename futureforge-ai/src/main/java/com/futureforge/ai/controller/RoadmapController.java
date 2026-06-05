package com.futureforge.ai.controller;

import com.futureforge.ai.dto.request.RoadmapRequest;
import com.futureforge.ai.dto.response.ApiResponse;
import com.futureforge.ai.dto.response.RoadmapResponse;
import com.futureforge.ai.entity.User;
import com.futureforge.ai.service.RoadmapService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roadmaps")
@RequiredArgsConstructor
@Tag(name = "Roadmaps", description = "AI-generated learning roadmaps")
public class RoadmapController {

    private final RoadmapService roadmapService;

    @PostMapping("/generate")
    @Operation(summary = "Generate an AI-powered learning roadmap")
    public ResponseEntity<ApiResponse<RoadmapResponse>> generateRoadmap(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody RoadmapRequest request) {
        RoadmapResponse response = roadmapService.generateRoadmap(user, request);
        return ResponseEntity.ok(ApiResponse.success("Roadmap generated", response));
    }

    @GetMapping
    @Operation(summary = "List all user roadmaps")
    public ResponseEntity<ApiResponse<List<RoadmapResponse>>> getRoadmaps(
            @AuthenticationPrincipal User user) {
        List<RoadmapResponse> responses = roadmapService.getUserRoadmaps(user);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a roadmap with milestones")
    public ResponseEntity<ApiResponse<RoadmapResponse>> getRoadmap(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        RoadmapResponse response = roadmapService.getRoadmapById(user, id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PatchMapping("/{id}/milestones/{milestoneId}")
    @Operation(summary = "Toggle milestone completion status")
    public ResponseEntity<ApiResponse<RoadmapResponse>> toggleMilestone(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @PathVariable Long milestoneId) {
        RoadmapResponse response = roadmapService.toggleMilestone(user, id, milestoneId);
        return ResponseEntity.ok(ApiResponse.success("Milestone updated", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a roadmap")
    public ResponseEntity<ApiResponse<Void>> deleteRoadmap(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        roadmapService.deleteRoadmap(user, id);
        return ResponseEntity.ok(ApiResponse.success("Roadmap deleted", null));
    }
}
