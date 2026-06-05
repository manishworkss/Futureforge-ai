package com.futureforge.ai.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ProfileResponse {
    private Long id;
    private String fullName;
    private String email;
    private Integer semester;
    private String education;
    private String careerGoal;
    private String bio;
    private List<String> skills;
    private List<String> interests;
}
