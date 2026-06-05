package com.futureforge.ai.dto.response;

import com.futureforge.ai.entity.enums.DifficultyLevel;
import com.futureforge.ai.entity.enums.RoadmapStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoadmapResponse {

    private Long id;
    private String title;
    private String targetRole;
    private DifficultyLevel difficultyLevel;
    private Integer estimatedWeeks;
    private String description;
    private RoadmapStatus status;
    private List<MilestoneResponse> milestones;
    private LocalDateTime createdAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MilestoneResponse {
        private Long id;
        private Integer weekNumber;
        private String title;
        private String description;
        private String resources;
        private Boolean isCompleted;
        private Integer sortOrder;
    }
}
