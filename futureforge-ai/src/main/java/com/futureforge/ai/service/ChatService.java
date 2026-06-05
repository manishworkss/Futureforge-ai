package com.futureforge.ai.service;

import com.futureforge.ai.dto.request.ChatMessageRequest;
import com.futureforge.ai.dto.response.ChatMessageResponse;
import com.futureforge.ai.entity.ChatMessage;
import com.futureforge.ai.entity.User;
import com.futureforge.ai.entity.enums.MessageRole;
import com.futureforge.ai.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final AiOrchestrationService aiOrchestrationService;

    @Transactional
    public ChatMessageResponse sendMessage(User user, ChatMessageRequest request) {
        // Save user message
        ChatMessage userMsg = ChatMessage.builder()
                .user(user)
                .role(MessageRole.USER)
                .content(request.getContent())
                .build();
        chatMessageRepository.save(userMsg);

        // Get AI response
        String aiResponse = aiOrchestrationService.generateMentorChatResponse(user);

        // Save AI message
        ChatMessage aiMsg = ChatMessage.builder()
                .user(user)
                .role(MessageRole.ASSISTANT)
                .content(aiResponse)
                .build();
        chatMessageRepository.save(aiMsg);

        return mapToResponse(aiMsg);
    }

    @Transactional(readOnly = true)
    public List<ChatMessageResponse> getChatHistory(User user) {
        List<ChatMessage> messages = chatMessageRepository.findTop20ByUserIdOrderByCreatedAtDesc(user.getId());
        Collections.reverse(messages); // chronological order
        return messages.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void clearChatHistory(User user) {
        chatMessageRepository.deleteByUserId(user.getId());
    }

    private ChatMessageResponse mapToResponse(ChatMessage msg) {
        return ChatMessageResponse.builder()
                .id(msg.getId())
                .role(msg.getRole())
                .content(msg.getContent())
                .createdAt(msg.getCreatedAt())
                .build();
    }
}
