package com.futureforge.ai.service;

import com.futureforge.ai.dto.request.AssessmentSubmitRequest;
import com.futureforge.ai.dto.response.AssessmentResultResponse;
import com.futureforge.ai.entity.User;
import com.futureforge.ai.entity.enums.Role;
import com.futureforge.ai.exception.BadRequestException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Assessment Security and 100% Accuracy Scoring Test Suite")
class AssessmentSecurityAndScoringTest {

    private JwtService jwtService;
    private User testUser;
    private final String secretKey = "TestSecretKeyForJWTTokenGenerationAndValidationMustBeLongEnough256Bits1234567890";

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secretKey", secretKey);
        ReflectionTestUtils.setField(jwtService, "accessTokenExpiration", 86400000L);
        ReflectionTestUtils.setField(jwtService, "refreshTokenExpiration", 604800000L);

        testUser = User.builder()
                .id(1L)
                .fullName("Alex Turing")
                .email("alex@example.com")
                .passwordHash("encoded_pass")
                .role(Role.USER)
                .build();
    }

    @Test
    @DisplayName("Should achieve 100% accuracy result when candidate answers match verified answer key")
    void shouldAchieve100PercentAccuracyWhenAllAnswersMatch() {
        String domain = "Cloud Architecture";
        List<Integer> officialAnswerKey = Arrays.asList(2, 0, 3, 1, 2, 1, 0, 3, 2, 1);

        // Generate tamper-proof cryptographic token
        String assessmentToken = jwtService.generateAssessmentToken(testUser.getEmail(), domain, officialAnswerKey);
        assertNotNull(assessmentToken);

        // Candidate submits 100% matching answers
        List<Integer> candidateAnswers = Arrays.asList(2, 0, 3, 1, 2, 1, 0, 3, 2, 1);
        List<Integer> decryptedKey = jwtService.extractAssessmentAnswers(assessmentToken, testUser.getEmail(), domain);

        assertEquals(officialAnswerKey.size(), decryptedKey.size());

        int score = 0;
        for (int i = 0; i < decryptedKey.size(); i++) {
            if (i < candidateAnswers.size() && candidateAnswers.get(i).equals(decryptedKey.get(i))) {
                score++;
            }
        }

        double accuracyPercentage = ((double) score / decryptedKey.size()) * 100.0;

        assertEquals(10, score, "All 10 questions must be scored correctly");
        assertEquals(100.0, accuracyPercentage, 0.001, "Accuracy must be exactly 100.0%");
    }

    @Test
    @DisplayName("Should accurately score partial performance (e.g., 70% accuracy for 7/10 correct)")
    void shouldAccuratelyScorePartialPerformance() {
        String domain = "Full Stack Development";
        List<Integer> officialAnswerKey = Arrays.asList(0, 1, 2, 3, 0, 1, 2, 3, 0, 1);

        String assessmentToken = jwtService.generateAssessmentToken(testUser.getEmail(), domain, officialAnswerKey);
        List<Integer> decryptedKey = jwtService.extractAssessmentAnswers(assessmentToken, testUser.getEmail(), domain);

        // Candidate answers 7 correct, 3 wrong
        List<Integer> candidateAnswers = Arrays.asList(0, 1, 2, 3, 0, 1, 2, 0, 1, 2);

        int score = 0;
        for (int i = 0; i < decryptedKey.size(); i++) {
            if (candidateAnswers.get(i).equals(decryptedKey.get(i))) {
                score++;
            }
        }

        double accuracy = ((double) score / decryptedKey.size()) * 100.0;
        assertEquals(7, score);
        assertEquals(70.0, accuracy, 0.001);
    }

    @Test
    @DisplayName("Should detect and reject forged or tampered assessment tokens")
    void shouldRejectTamperedAssessmentToken() {
        String domain = "DevOps";
        List<Integer> officialAnswerKey = Arrays.asList(1, 2, 3);
        String token = jwtService.generateAssessmentToken(testUser.getEmail(), domain, officialAnswerKey);

        // Tamper with the token signature (flip characters at the end)
        String tamperedToken = token.substring(0, token.length() - 5) + "ABCDE";

        assertThrows(Exception.class, () -> {
            jwtService.extractAssessmentAnswers(tamperedToken, testUser.getEmail(), domain);
        }, "Tampered token must fail signature verification");
    }

    @Test
    @DisplayName("Should reject assessment token if domain does not match")
    void shouldRejectTokenOnDomainMismatch() {
        String domain = "DevOps";
        List<Integer> officialAnswerKey = Arrays.asList(1, 2, 3);
        String token = jwtService.generateAssessmentToken(testUser.getEmail(), domain, officialAnswerKey);

        assertThrows(BadRequestException.class, () -> {
            jwtService.extractAssessmentAnswers(token, testUser.getEmail(), "Cybersecurity");
        }, "Token must be rejected if evaluated against mismatched domain");
    }

    @Test
    @DisplayName("Should reject assessment token if user does not match")
    void shouldRejectTokenOnUserMismatch() {
        String domain = "DevOps";
        List<Integer> officialAnswerKey = Arrays.asList(1, 2, 3);
        String token = jwtService.generateAssessmentToken(testUser.getEmail(), domain, officialAnswerKey);

        assertThrows(BadRequestException.class, () -> {
            jwtService.extractAssessmentAnswers(token, "impostor@example.com", domain);
        }, "Token must be rejected if evaluated for an unauthorized user");
    }
}
