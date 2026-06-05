package com.futureforge.ai.controller;

import com.futureforge.ai.dto.response.ApiResponse;
import com.futureforge.ai.dto.FeedbackRequest;
import com.futureforge.ai.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Or configure globally
public class FeedbackController {

    private final FeedbackService feedbackService;

    @PostMapping
    public ResponseEntity<ApiResponse<String>> submitFeedback(@RequestBody FeedbackRequest request) {
        feedbackService.submitFeedback(request);
        return ResponseEntity.ok(ApiResponse.success("Feedback submitted successfully", null));
    }
}
