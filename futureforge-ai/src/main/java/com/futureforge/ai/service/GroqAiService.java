package com.futureforge.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class GroqAiService {

    private final WebClient groqWebClient;
    private final ObjectMapper objectMapper;

    @Value("${groq.api.model}")
    private String model;

    @Value("${groq.api.max-tokens}")
    private int maxTokens;

    @Value("${groq.api.temperature}")
    private double temperature;

    /**
     * Send a standard chat completion request to Groq API.
     *
     * @param systemPrompt the system-level instruction (mega context)
     * @param userMessage  the user's specific prompt
     * @return the AI assistant's response text
     */
    public String chat(String systemPrompt, String userMessage) {
        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", systemPrompt));
        messages.add(Map.of("role", "user", "content", userMessage));
        return sendRequest(messages, false);
    }

    /**
     * Send a chat completion request to Groq API with JSON mode enabled.
     *
     * @param systemPrompt the system-level instruction (mega context)
     * @param userMessage  the user's specific prompt
     * @return the AI assistant's response in valid JSON
     */
    public String chatAsJson(String systemPrompt, String userMessage) {
        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", systemPrompt));
        messages.add(Map.of("role", "user", "content", userMessage));
        return sendRequest(messages, true);
    }

    /**
     * Send a chat completion with full pre-built history.
     *
     * @param messages list of message maps with "role" and "content"
     * @return the AI assistant's response text
     */
    public String chatWithHistory(List<Map<String, String>> messages) {
        return sendRequest(messages, false);
    }

    private String sendRequest(List<Map<String, String>> messages, boolean jsonMode) {
        try {
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", model);
            requestBody.put("messages", messages);
            requestBody.put("max_tokens", maxTokens);
            requestBody.put("temperature", temperature);
            
            if (jsonMode) {
                requestBody.put("response_format", Map.of("type", "json_object"));
            }

            String responseBody = groqWebClient.post()
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            if (responseBody == null) {
                throw new RuntimeException("Empty response from Groq API");
            }

            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode choices = root.get("choices");

            if (choices != null && choices.isArray() && !choices.isEmpty()) {
                return choices.get(0).get("message").get("content").asText();
            }

            throw new RuntimeException("No choices in Groq API response");

        } catch (Exception e) {
            log.error("Groq API call failed: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to get response from AI service: " + e.getMessage(), e);
        }
    }
}
