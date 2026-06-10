package com.futureforge.ai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProfileRequest {

    @NotNull(message = "Semester is required")
    private Integer semester;

    @NotBlank(message = "Education is required")
    private String education;

    private List<String> skills;

    private List<String> interests;

    @NotBlank(message = "Career goal is required")
    private String careerGoal;

    private String bio;

    private String linkedinUrl;
    private String githubUrl;
    private String leetcodeUrl;
    private String portfolioUrl;
}
