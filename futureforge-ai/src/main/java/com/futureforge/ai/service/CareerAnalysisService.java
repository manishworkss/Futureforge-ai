package com.futureforge.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.futureforge.ai.dto.request.CareerAnalysisRequest;
import com.futureforge.ai.dto.response.CareerAnalysisResponse;
import com.futureforge.ai.entity.CareerAnalysis;
import com.futureforge.ai.entity.User;
import com.futureforge.ai.exception.ResourceNotFoundException;
import com.futureforge.ai.repository.CareerAnalysisRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CareerAnalysisService {

    private final CareerAnalysisRepository analysisRepository;
    private final AiOrchestrationService aiOrchestrationService;
    private final ObjectMapper objectMapper;

    @Transactional
    public CareerAnalysisResponse analyzeCareer(User user, CareerAnalysisRequest request) {
        String careerGoal = request.getCareerGoal();
        if (request.getAdditionalContext() != null && !request.getAdditionalContext().isEmpty()) {
            careerGoal += " | Additional Context: " + request.getAdditionalContext();
        }

        log.info("Running career analysis for user: {}", user.getEmail());
        String aiResponse = aiOrchestrationService.generateCareerAnalysis(user, careerGoal);

        // Parse the AI response
        CareerAnalysis analysis = CareerAnalysis.builder()
                .user(user)
                .analysisInput(careerGoal)
                .build();

        try {
            // Try to parse as JSON
            String jsonContent = extractJson(aiResponse);
            JsonNode json = objectMapper.readTree(jsonContent);

            analysis.setCareerFitScore(getJsonText(json, "careerFitScore"));
            analysis.setAnalysisResult(getJsonText(json, "analysisResult"));
            analysis.setStrengths(getJsonText(json, "strengths"));
            analysis.setWeaknesses(getJsonText(json, "weaknesses"));
            analysis.setRecommendations(getJsonText(json, "recommendations"));
        } catch (Exception e) {
            // If JSON parsing fails, store raw response
            log.warn("Failed to parse AI response as JSON, storing raw: {}", e.getMessage());
            analysis.setAnalysisResult(aiResponse);
        }

        analysis = analysisRepository.save(analysis);
        log.info("Career analysis saved with id: {}", analysis.getId());

        return mapToResponse(analysis);
    }

    public List<CareerAnalysisResponse> getUserAnalyses(User user) {
        return analysisRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public CareerAnalysisResponse getAnalysisById(User user, Long analysisId) {
        CareerAnalysis analysis = analysisRepository.findById(analysisId)
                .orElseThrow(() -> new ResourceNotFoundException("Career Analysis", "id", analysisId));

        if (!analysis.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Career Analysis", "id", analysisId);
        }

        return mapToResponse(analysis);
    }

    private String extractJson(String response) {
        // Try to extract JSON from markdown code blocks
        if (response.contains("```json")) {
            int start = response.indexOf("```json") + 7;
            int end = response.indexOf("```", start);
            if (end > start) {
                return response.substring(start, end).trim();
            }
        }
        if (response.contains("```")) {
            int start = response.indexOf("```") + 3;
            int end = response.indexOf("```", start);
            if (end > start) {
                return response.substring(start, end).trim();
            }
        }
        // Try raw JSON
        int braceStart = response.indexOf('{');
        int braceEnd = response.lastIndexOf('}');
        if (braceStart >= 0 && braceEnd > braceStart) {
            return response.substring(braceStart, braceEnd + 1);
        }
        return response;
    }

    private String getJsonText(JsonNode json, String field) {
        JsonNode node = json.get(field);
        if (node == null) return null;
        if (node.isArray()) return node.toString();
        return node.asText();
    }

    private CareerAnalysisResponse mapToResponse(CareerAnalysis analysis) {
        return CareerAnalysisResponse.builder()
                .id(analysis.getId())
                .analysisInput(analysis.getAnalysisInput())
                .analysisResult(analysis.getAnalysisResult())
                .careerFitScore(analysis.getCareerFitScore())
                .strengths(analysis.getStrengths())
                .weaknesses(analysis.getWeaknesses())
                .recommendations(analysis.getRecommendations())
                .createdAt(analysis.getCreatedAt())
                .build();
    }
}
