package com.futureforge.ai.service;

import com.futureforge.ai.dto.request.ChatMessageRequest;
import com.futureforge.ai.dto.response.ChatMessageResponse;
import com.futureforge.ai.dto.response.ChatSessionResponse;
import com.futureforge.ai.entity.ChatMessage;
import com.futureforge.ai.entity.ChatSession;
import com.futureforge.ai.entity.User;
import com.futureforge.ai.entity.enums.MessageRole;
import com.futureforge.ai.repository.ChatMessageRepository;
import com.futureforge.ai.repository.ChatSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatSessionRepository chatSessionRepository;
    private final AiOrchestrationService aiOrchestrationService;

    @Transactional
    public ChatMessageResponse sendMessage(User user, ChatMessageRequest request) {
        ChatSession session;
        if (request.getSessionId() == null) {
            String title = request.getContent().length() > 30 
                    ? request.getContent().substring(0, 30) + "..." 
                    : request.getContent();
            session = ChatSession.builder()
                    .user(user)
                    .title(title)
                    .build();
            session = chatSessionRepository.save(session);
        } else {
            session = chatSessionRepository.findById(request.getSessionId())
                    .orElseThrow(() -> new IllegalArgumentException("Chat session not found"));
            if (!session.getUser().getId().equals(user.getId())) {
                throw new IllegalArgumentException("Unauthorized");
            }
        }

        // Save user message
        ChatMessage userMsg = ChatMessage.builder()
                .user(user)
                .chatSession(session)
                .role(MessageRole.USER)
                .content(request.getContent())
                .build();
        chatMessageRepository.save(userMsg);

        // Get AI response
        String aiResponse = aiOrchestrationService.generateMentorChatResponse(user, session.getId());

        // Save AI message
        ChatMessage aiMsg = ChatMessage.builder()
                .user(user)
                .chatSession(session)
                .role(MessageRole.ASSISTANT)
                .content(aiResponse)
                .build();
        chatMessageRepository.save(aiMsg);

        // Update session updatedAt timestamp
        chatSessionRepository.save(session);

        return mapToResponse(aiMsg);
    }

    @Transactional
    public List<ChatSessionResponse> getUserSessions(User user) {
        // Migrate legacy messages if any
        List<ChatMessage> legacyMessages = chatMessageRepository.findByUserIdAndChatSessionIsNullOrderByCreatedAtAsc(user.getId());
        if (!legacyMessages.isEmpty()) {
            ChatSession legacySession = ChatSession.builder()
                    .user(user)
                    .title("Legacy Chat")
                    .build();
            legacySession = chatSessionRepository.save(legacySession);
            for (ChatMessage msg : legacyMessages) {
                msg.setChatSession(legacySession);
                chatMessageRepository.save(msg);
            }
        }

        List<ChatSession> sessions = chatSessionRepository.findByUserIdOrderByUpdatedAtDesc(user.getId());
        return sessions.stream()
                .map(s -> ChatSessionResponse.builder()
                        .id(s.getId())
                        .title(s.getTitle())
                        .createdAt(s.getCreatedAt())
                        .updatedAt(s.getUpdatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ChatMessageResponse> getSessionMessages(User user, Long sessionId) {
        ChatSession session = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found"));
        if (!session.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Unauthorized");
        }
        
        List<ChatMessage> messages = chatMessageRepository.findByChatSessionIdOrderByCreatedAtAsc(sessionId);
        return messages.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteSession(User user, Long sessionId) {
        ChatSession session = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found"));
        if (!session.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Unauthorized");
        }
        chatSessionRepository.delete(session);
    }

    @Transactional
    public void clearChatHistory(User user) {
        chatMessageRepository.deleteByUserId(user.getId());
        // Since session has cascade ALL on messages, we should delete sessions too
        List<ChatSession> sessions = chatSessionRepository.findByUserIdOrderByUpdatedAtDesc(user.getId());
        chatSessionRepository.deleteAll(sessions);
    }

    private ChatMessageResponse mapToResponse(ChatMessage msg) {
        return ChatMessageResponse.builder()
                .id(msg.getId())
                .sessionId(msg.getChatSession() != null ? msg.getChatSession().getId() : null)
                .role(msg.getRole())
                .content(msg.getContent())
                .createdAt(msg.getCreatedAt())
                .build();
    }
}
