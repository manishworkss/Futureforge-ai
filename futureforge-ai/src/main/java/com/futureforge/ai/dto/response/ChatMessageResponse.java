package com.futureforge.ai.dto.response;

import com.futureforge.ai.entity.enums.MessageRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageResponse {

    private Long id;
    private MessageRole role;
    private String content;
    private LocalDateTime createdAt;
}
