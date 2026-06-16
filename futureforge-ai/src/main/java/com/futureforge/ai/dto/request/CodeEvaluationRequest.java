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
public class CodeEvaluationRequest {
    @NotBlank(message = "Task title is required")
    private String taskTitle;
    
    @NotBlank(message = "Task description is required")
    private String taskDescription;
    
    @NotBlank(message = "Code snippet is required")
    private String codeSnippet;
}
