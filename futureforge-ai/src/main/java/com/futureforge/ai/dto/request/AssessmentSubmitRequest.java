package com.futureforge.ai.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssessmentSubmitRequest {

    @NotBlank(message = "Domain is required")
    private String domain;

    @NotBlank(message = "Assessment token is required")
    private String assessmentToken;

    @NotNull(message = "Answers are required")
    private List<Integer> answers;

    private List<String> codingAnswers;
}

