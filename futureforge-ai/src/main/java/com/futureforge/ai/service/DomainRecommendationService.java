package com.futureforge.ai.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.futureforge.ai.dto.response.DomainRecommendationResponse;
import com.futureforge.ai.entity.DomainRecommendation;
import com.futureforge.ai.entity.User;
import com.futureforge.ai.entity.UserProfile;
import com.futureforge.ai.exception.ResourceNotFoundException;
import com.futureforge.ai.repository.DomainRecommendationRepository;
import com.futureforge.ai.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class DomainRecommendationService {

    private final DomainRecommendationRepository domainRepository;
    private final AiOrchestrationService aiOrchestrationService;
    private final ObjectMapper objectMapper;

    @Transactional
    public DomainRecommendationResponse recommendDomain(User user) {
        String aiResponse = aiOrchestrationService.generateDomainRecommendations(user);

        DomainRecommendation recommendation = DomainRecommendation.builder()
                .user(user)
                .aiResponseJson(aiResponse)
                .build();

        recommendation = domainRepository.save(recommendation);

        return parseResponse(recommendation);
    }

    @Transactional(readOnly = true)
    public DomainRecommendationResponse getLatestRecommendation(User user) {
        DomainRecommendation recommendation = domainRepository.findTopByUserIdOrderByCreatedAtDesc(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("No domain recommendations found."));
        return parseResponse(recommendation);
    }

    private DomainRecommendationResponse parseResponse(DomainRecommendation recommendation) {
        try {
            DomainRecommendationResponse response = objectMapper.readValue(
                    recommendation.getAiResponseJson(), 
                    DomainRecommendationResponse.class
            );
            response.setId(recommendation.getId());
            return response;
        } catch (JsonProcessingException e) {
            log.error("Failed to parse AI response: {}", recommendation.getAiResponseJson(), e);
            throw new RuntimeException("Failed to parse AI response. The model may have returned invalid JSON.");
        }
    }
}
