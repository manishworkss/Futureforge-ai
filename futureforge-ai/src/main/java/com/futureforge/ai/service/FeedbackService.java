package com.futureforge.ai.service;

import com.futureforge.ai.dto.FeedbackRequest;
import com.futureforge.ai.entity.Feedback;
import com.futureforge.ai.entity.User;
import com.futureforge.ai.repository.FeedbackRepository;
import com.futureforge.ai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;

    @Transactional
    public void submitFeedback(FeedbackRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Feedback feedback = new Feedback();
        feedback.setUser(user);
        feedback.setRating(request.getRating());
        feedback.setComments(request.getComments());

        feedbackRepository.save(feedback);
    }
}
