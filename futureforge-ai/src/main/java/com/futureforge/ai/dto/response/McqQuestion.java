package com.futureforge.ai.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class McqQuestion {
    private String question;
    private List<String> options;
    private int correctOptionIndex;
    private String difficulty; // "easy" or "hard"
}
