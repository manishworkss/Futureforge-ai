package com.futureforge.ai.dto;

import lombok.Data;

@Data
public class FeedbackRequest {
    private Integer rating;
    private String comments;
}
