package com.futureforge.ai.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class DomainRecommendationResponse {
    private Long id;
    private List<Domain> recommendations;

    @Data
    @Builder
    public static class Domain {
        private String domainName;
        private String matchReasoning;
        private Integer matchPercentage;
        private List<String> topRoles;
    }
}
