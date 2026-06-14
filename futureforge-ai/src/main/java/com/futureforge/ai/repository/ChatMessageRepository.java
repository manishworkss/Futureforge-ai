package com.futureforge.ai.repository;

import com.futureforge.ai.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findTop20ByUserIdOrderByCreatedAtDesc(Long userId);
    
    List<ChatMessage> findByChatSessionIdOrderByCreatedAtAsc(Long sessionId);
    List<ChatMessage> findByUserIdAndChatSessionIsNullOrderByCreatedAtAsc(Long userId);

    @Transactional
    void deleteByUserId(Long userId);
}
