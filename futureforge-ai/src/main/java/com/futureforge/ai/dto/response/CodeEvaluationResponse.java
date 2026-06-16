package com.futureforge.ai.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CodeEvaluationResponse {
    private boolean isCorrect;
    private String compilerOutput;
    private String feedback;
}
