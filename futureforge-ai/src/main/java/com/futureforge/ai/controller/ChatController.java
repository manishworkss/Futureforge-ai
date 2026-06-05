package com.futureforge.ai.controller;

import com.futureforge.ai.dto.request.ChatMessageRequest;
import com.futureforge.ai.dto.response.ApiResponse;
import com.futureforge.ai.dto.response.ChatMessageResponse;
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
@Tag(name = "AI Mentor Chat", description = "Single thread conversation with AI career mentor")
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

    @GetMapping("/history")
    @Operation(summary = "Get recent chat history (last 20 messages)")
    public ResponseEntity<ApiResponse<List<ChatMessageResponse>>> getChatHistory(
            @AuthenticationPrincipal User user) {
        List<ChatMessageResponse> responses = chatService.getChatHistory(user);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @DeleteMapping("/clear")
    @Operation(summary = "Clear entire chat history")
    public ResponseEntity<ApiResponse<Void>> clearChatHistory(
            @AuthenticationPrincipal User user) {
        chatService.clearChatHistory(user);
        return ResponseEntity.ok(ApiResponse.success("Chat history cleared", null));
    }
}
