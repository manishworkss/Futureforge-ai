package com.futureforge.ai.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoadmapRequest {

    @NotBlank(message = "Target role is required")
    private String targetRole;

    private String currentSkillLevel;

    private Integer desiredWeeks;

    private String additionalPreferences;

    private String assessmentContext;
}
