package com.futureforge.ai.controller;

import com.futureforge.ai.dto.request.ChatMessageRequest;
import com.futureforge.ai.dto.response.ApiResponse;
import com.futureforge.ai.dto.response.ChatMessageResponse;
import com.futureforge.ai.dto.response.ChatSessionResponse;
import com.futureforge.ai.entity.User;
import com.futureforge.ai.service.ChatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@Tag(name = "AI Mentor Chat", description = "Multi-thread conversation with AI career mentor")
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/send")
    @Operation(summary = "Send a message and get AI mentor response")
    public ResponseEntity<ApiResponse<ChatMessageResponse>> sendMessage(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ChatMessageRequest request) {
        ChatMessageResponse response = chatService.sendMessage(user, request);
        return ResponseEntity.ok(ApiResponse.success("Message sent", response));
    }

    @GetMapping("/sessions")
    @Operation(summary = "Get all chat sessions")
    public ResponseEntity<ApiResponse<List<ChatSessionResponse>>> getChatSessions(
            @AuthenticationPrincipal User user) {
        List<ChatSessionResponse> responses = chatService.getUserSessions(user);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/sessions/{id}/messages")
    @Operation(summary = "Get messages for a specific session")
    public ResponseEntity<ApiResponse<List<ChatMessageResponse>>> getSessionMessages(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        List<ChatMessageResponse> responses = chatService.getSessionMessages(user, id);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @DeleteMapping("/sessions/{id}")
    @Operation(summary = "Delete a specific chat session")
    public ResponseEntity<ApiResponse<Void>> deleteSession(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        chatService.deleteSession(user, id);
        return ResponseEntity.ok(ApiResponse.success("Chat session deleted", null));
    }

    @DeleteMapping("/clear")
    @Operation(summary = "Clear entire chat history")
    public ResponseEntity<ApiResponse<Void>> clearChatHistory(
            @AuthenticationPrincipal User user) {
        chatService.clearChatHistory(user);
        return ResponseEntity.ok(ApiResponse.success("Chat history cleared", null));
    }
}
