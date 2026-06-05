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
public class CareerAnalysisRequest {

    @NotBlank(message = "Career goal or question is required")
    private String careerGoal;

    private String additionalContext;
}
