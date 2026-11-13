package com.futureforge.ai.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("local")
@DisplayName("Live Groq Cloud AI Integration Test")
class LiveGroqAiIntegrationTest {

    @Autowired
    private GroqAiService groqAiService;

    @Test
    @DisplayName("Should successfully connect to Groq Cloud and generate AI response in real time")
    void testLiveAiChat() {
        String response = groqAiService.chat("You are Oracle, an elite AI mentor.", "Say 'FutureForge AI is live!'");
        System.out.println(">>> LIVE GROQ AI RESPONSE: " + response);
        assertNotNull(response);
        assertFalse(response.isBlank());
    }

    @Test
    @DisplayName("Should generate valid JSON in JSON mode from Groq Cloud")
    void testLiveAiJsonMode() {
        String jsonResponse = groqAiService.chatAsJson("You are a JSON generator.", "Provide a JSON object with key 'status' equal to 'READY'");
        System.out.println(">>> LIVE GROQ AI JSON: " + jsonResponse);
        assertNotNull(jsonResponse);
        assertTrue(jsonResponse.contains("\"status\""));
    }
}
