package com.futureforge.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.futureforge.ai.dto.request.RoadmapRequest;
import com.futureforge.ai.dto.response.RoadmapResponse;
import com.futureforge.ai.entity.Roadmap;
import com.futureforge.ai.entity.RoadmapMilestone;
import com.futureforge.ai.entity.User;
import com.futureforge.ai.entity.enums.DifficultyLevel;
import com.futureforge.ai.entity.enums.RoadmapStatus;
import com.futureforge.ai.exception.ResourceNotFoundException;
import com.futureforge.ai.repository.RoadmapMilestoneRepository;
import com.futureforge.ai.repository.RoadmapRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoadmapService {

    private final RoadmapRepository roadmapRepository;
    private final RoadmapMilestoneRepository milestoneRepository;
    private final AiOrchestrationService aiOrchestrationService;
    private final ObjectMapper objectMapper;

    @Transactional
    public RoadmapResponse generateRoadmap(User user, RoadmapRequest request) {
        String preferences = "";
        if (request.getCurrentSkillLevel() != null) {
            preferences += "Current Skill Level: " + request.getCurrentSkillLevel() + "\n";
        }
        if (request.getDesiredWeeks() != null) {
            preferences += "Preferred Duration: " + request.getDesiredWeeks() + " weeks\n";
        }
        if (request.getAdditionalPreferences() != null) {
            preferences += request.getAdditionalPreferences();
        }

        log.info("Generating roadmap for user: {} targeting: {}", user.getEmail(), request.getTargetRole());
        String aiResponse = aiOrchestrationService.generateRoadmap(user, request.getTargetRole(), preferences, request.getAssessmentContext());

        // Parse AI response and create roadmap
        Roadmap roadmap = Roadmap.builder()
                .user(user)
                .targetRole(request.getTargetRole())
                .status(RoadmapStatus.ACTIVE)
                .build();

        try {
            String jsonContent = extractJson(aiResponse);
            JsonNode json = objectMapper.readTree(jsonContent);

            roadmap.setTitle(getJsonText(json, "title", "Roadmap to " + request.getTargetRole()));
            roadmap.setDescription(getJsonText(json, "description", ""));

            String diffStr = getJsonText(json, "difficultyLevel", "INTERMEDIATE");
            try {
                roadmap.setDifficultyLevel(DifficultyLevel.valueOf(diffStr.toUpperCase()));
            } catch (Exception e) {
                roadmap.setDifficultyLevel(DifficultyLevel.INTERMEDIATE);
            }

            int weeks = json.has("estimatedWeeks") ? json.get("estimatedWeeks").asInt(12) : 12;
            roadmap.setEstimatedWeeks(weeks);

            // Parse milestones
            JsonNode milestonesNode = json.get("milestones");
            if (milestonesNode != null && milestonesNode.isArray()) {
                int order = 0;
                for (JsonNode m : milestonesNode) {
                    RoadmapMilestone milestone = RoadmapMilestone.builder()
                            .weekNumber(m.has("weekNumber") ? m.get("weekNumber").asInt(order + 1) : order + 1)
                            .title(getJsonText(m, "title", "Week " + (order + 1)))
                            .description(getJsonText(m, "description", ""))
                            .resources(getJsonText(m, "resources", ""))
                            .isCompleted(false)
                            .sortOrder(order)
                            .build();
                    roadmap.addMilestone(milestone);
                    order++;
                }
            }
        } catch (Exception e) {
            log.warn("Failed to parse roadmap AI response as JSON: {}", e.getMessage());
            roadmap.setTitle("Roadmap to " + request.getTargetRole());
            roadmap.setDescription(aiResponse);
            roadmap.setEstimatedWeeks(request.getDesiredWeeks() != null ? request.getDesiredWeeks() : 12);
        }

        roadmap = roadmapRepository.save(roadmap);
        log.info("Roadmap saved with id: {} and {} milestones", roadmap.getId(), roadmap.getMilestones().size());

        return mapToResponse(roadmap);
    }

    public List<RoadmapResponse> getUserRoadmaps(User user) {
        return roadmapRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public RoadmapResponse getRoadmapById(User user, Long roadmapId) {
        Roadmap roadmap = roadmapRepository.findById(roadmapId)
                .orElseThrow(() -> new ResourceNotFoundException("Roadmap", "id", roadmapId));

        if (!roadmap.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Roadmap", "id", roadmapId);
        }

        return mapToResponse(roadmap);
    }

    @Transactional
    public RoadmapResponse toggleMilestone(User user, Long roadmapId, Long milestoneId) {
        Roadmap roadmap = roadmapRepository.findById(roadmapId)
                .orElseThrow(() -> new ResourceNotFoundException("Roadmap", "id", roadmapId));

        if (!roadmap.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Roadmap", "id", roadmapId);
        }

        RoadmapMilestone milestone = milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new ResourceNotFoundException("Milestone", "id", milestoneId));

        if (!milestone.getRoadmap().getId().equals(roadmapId)) {
            throw new ResourceNotFoundException("Milestone", "id", milestoneId);
        }

        milestone.setIsCompleted(!milestone.getIsCompleted());
        milestoneRepository.save(milestone);

        // Check if all milestones are completed
        boolean allCompleted = roadmap.getMilestones().stream()
                .allMatch(RoadmapMilestone::getIsCompleted);
        if (allCompleted) {
            roadmap.setStatus(RoadmapStatus.COMPLETED);
            roadmapRepository.save(roadmap);
        }

        return mapToResponse(roadmap);
    }

    @Transactional
    public void deleteRoadmap(User user, Long roadmapId) {
        Roadmap roadmap = roadmapRepository.findById(roadmapId)
                .orElseThrow(() -> new ResourceNotFoundException("Roadmap", "id", roadmapId));

        if (!roadmap.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Roadmap", "id", roadmapId);
        }

        roadmapRepository.delete(roadmap);
        log.info("Roadmap {} deleted for user: {}", roadmapId, user.getEmail());
    }

    private String extractJson(String response) {
        if (response.contains("```json")) {
            int start = response.indexOf("```json") + 7;
            int end = response.indexOf("```", start);
            if (end > start) return response.substring(start, end).trim();
        }
        if (response.contains("```")) {
            int start = response.indexOf("```") + 3;
            int end = response.indexOf("```", start);
            if (end > start) return response.substring(start, end).trim();
        }
        int braceStart = response.indexOf('{');
        int braceEnd = response.lastIndexOf('}');
        if (braceStart >= 0 && braceEnd > braceStart) {
            return response.substring(braceStart, braceEnd + 1);
        }
        return response;
    }

    private String getJsonText(JsonNode json, String field, String defaultValue) {
        JsonNode node = json.get(field);
        if (node == null) return defaultValue;
        return node.asText(defaultValue);
    }

    private String getJsonText(JsonNode json, String field) {
        return getJsonText(json, field, null);
    }

    private RoadmapResponse mapToResponse(Roadmap roadmap) {
        return RoadmapResponse.builder()
                .id(roadmap.getId())
                .title(roadmap.getTitle())
                .targetRole(roadmap.getTargetRole())
                .difficultyLevel(roadmap.getDifficultyLevel())
                .estimatedWeeks(roadmap.getEstimatedWeeks())
                .description(roadmap.getDescription())
                .status(roadmap.getStatus())
                .milestones(roadmap.getMilestones().stream()
                        .map(m -> RoadmapResponse.MilestoneResponse.builder()
                                .id(m.getId())
                                .weekNumber(m.getWeekNumber())
                                .title(m.getTitle())
                                .description(m.getDescription())
                                .resources(m.getResources())
                                .isCompleted(m.getIsCompleted())
                                .sortOrder(m.getSortOrder())
                                .build())
                        .collect(Collectors.toList()))
                .createdAt(roadmap.getCreatedAt())
                .build();
    }
}
