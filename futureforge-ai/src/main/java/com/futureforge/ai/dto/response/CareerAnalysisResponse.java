package com.futureforge.ai.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CareerAnalysisResponse {

    private Long id;
    private String analysisInput;
    private String analysisResult;
    private String careerFitScore;
    private String strengths;
    private String weaknesses;
    private String recommendations;
    private LocalDateTime createdAt;
}
