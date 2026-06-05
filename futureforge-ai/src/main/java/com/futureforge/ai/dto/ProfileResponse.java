package com.futureforge.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProfileResponse {

    private Long id;
    private Long userId;
    private String fullName;
    private Integer semester;
    private String education;
    private List<String> skills;
    private List<String> interests;
    private String careerGoal;
    private String bio;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
