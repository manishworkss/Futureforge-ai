package com.futureforge.ai.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssessmentResultResponse {
    private int score;
    private int total;
    private double percentage;
    private String assessmentContext;
}

