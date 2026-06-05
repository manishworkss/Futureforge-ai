package com.futureforge.ai.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class ProfileUpdateRequest {

    @Min(1)
    @Max(10)
    private Integer semester;

    private String education;

    private List<String> skills;

    private List<String> interests;

    private String careerGoal;

    private String bio;
}
