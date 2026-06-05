package com.futureforge.ai.service;

import com.futureforge.ai.entity.CareerAnalysis;
import com.futureforge.ai.entity.ChatMessage;
import com.futureforge.ai.entity.Roadmap;
import com.futureforge.ai.entity.User;
import com.futureforge.ai.repository.CareerAnalysisRepository;
import com.futureforge.ai.repository.ChatMessageRepository;
import com.futureforge.ai.repository.RoadmapRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiOrchestrationService {

    private final GroqAiService groqAiService;
    private final ProfileService profileService;
    private final CareerAnalysisRepository careerAnalysisRepository;
    private final RoadmapRepository roadmapRepository;
    private final ChatMessageRepository chatMessageRepository;

    public String generateDomainRecommendations(User user) {
        String profileContext = profileService.buildProfileContext(user);

        String systemPrompt = """
                You are an expert IT career counselor helping a BCA (Computer Applications) student find their ideal tech domain.
                Analyze the user's profile and recommend the top 3 IT domains that fit them best based STRICTLY on their skills and interests.
                
                Your response MUST be exactly in the following JSON format ONLY, no markdown formatting:
                {
                    "recommendations": [
                        {
                            "domainName": "Web Development",
                            "matchReasoning": "Because you know HTML and CSS...",
                            "matchPercentage": 95,
                            "topRoles": ["Frontend Developer", "Full Stack Developer"]
                        }
                    ]
                }
                """;

        String userMessage = String.format("## My Profile:\n%s\n\nPlease recommend the top 3 domains for me.", profileContext);

        return groqAiService.chat(systemPrompt, userMessage);
    }

    public String generateCareerAnalysis(User user, String targetDomain) {
        String profileContext = profileService.buildProfileContext(user);

        String systemPrompt = """
                You are an expert career counselor. Analyze the user's profile against their target domain.
                
                Your response MUST be exactly in the following JSON format ONLY:
                {
                    "careerFitScore": "85/100",
                    "analysisResult": "Detailed analysis paragraph...",
                    "strengths": ["strength1", "strength2"],
                    "weaknesses": ["weakness1", "weakness2"],
                    "recommendations": ["recommendation1", "recommendation2"]
                }
                """;

        String userMessage = String.format("## My Profile:\n%s\n\n## Target Domain:\n%s\n\nPlease analyze my profile against this domain.", profileContext, targetDomain);

        return groqAiService.chat(systemPrompt, userMessage);
    }

    public String generateRoadmap(User user, String targetRole, String preferences) {
        String profileContext = profileService.buildProfileContext(user);
        
        // Fetch latest weaknesses from career analysis to influence roadmap length
        List<CareerAnalysis> analyses = careerAnalysisRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        String analysisContext = "No prior analysis available.";
        if (!analyses.isEmpty()) {
            CareerAnalysis latest = analyses.get(0);
            analysisContext = "Weaknesses: " + latest.getWeaknesses() + "\nAnalysis: " + latest.getAnalysisResult();
        }

        String systemPrompt = """
                You are an expert curriculum designer.
                Create a detailed, week-by-week learning roadmap for the user to achieve their target role.
                If they have significant weaknesses/skill gaps, extend the roadmap to cover them (e.g. 12-16 weeks).
                If they are already highly skilled, keep it short and advanced (e.g. 4-8 weeks).
                
                Your response MUST be exactly in the following JSON format ONLY:
                {
                    "title": "Roadmap Title",
                    "description": "Brief description of the roadmap",
                    "difficultyLevel": "BEGINNER",
                    "estimatedWeeks": 12,
                    "milestones": [
                        {
                            "weekNumber": 1,
                            "title": "Milestone Title",
                            "description": "What to learn and do this week",
                            "resources": "Comma-separated list of recommended resources"
                        }
                    ]
                }
                """;

        String userMessage = String.format("""
                ## My Profile:
                %s
                
                ## Target Role: %s
                
                ## My Latest Career Analysis (Weaknesses to address):
                %s
                
                ## Preferences:
                %s
                
                Create a personalized learning roadmap.
                """, profileContext, targetRole, analysisContext, (preferences != null ? preferences : "None"));

        return groqAiService.chat(systemPrompt, userMessage);
    }

    public String generateMentorChatResponse(User user) {
        String profileContext = profileService.buildProfileContext(user);
        
        List<CareerAnalysis> analyses = careerAnalysisRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        String analysisContext = analyses.isEmpty() ? "None" : "Weaknesses: " + analyses.get(0).getWeaknesses();

        List<Roadmap> roadmaps = roadmapRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        String roadmapContext = roadmaps.isEmpty() ? "None" : roadmaps.get(0).getTargetRole() + " Roadmap";

        String systemPrompt = String.format("""
                You are FutureForge AI Mentor — a highly contextual career mentor.
                
                ## USER CONTEXT
                Profile:
                %s
                
                Latest Career Analysis:
                %s
                
                Active Roadmap:
                %s
                
                Guidelines:
                - Use the provided context to give extremely personalized advice.
                - Do NOT repeat their profile back to them. Just use the knowledge.
                - Be warm, encouraging, and concise (2-3 paragraphs max).
                """, profileContext, analysisContext, roadmapContext);

        // Build history
        List<ChatMessage> rawHistory = chatMessageRepository.findTop20ByUserIdOrderByCreatedAtDesc(user.getId());
        List<ChatMessage> history = new ArrayList<>(rawHistory);
        java.util.Collections.reverse(history);
        
        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", systemPrompt));
        
        for (ChatMessage msg : history) {
            String role = msg.getRole().name().toLowerCase();
            // Llama API expects 'assistant' instead of our 'mentor' role sometimes, but map to 'assistant'
            if (role.equals("mentor")) role = "assistant";
            messages.add(Map.of("role", role, "content", msg.getContent()));
        }

        return groqAiService.chatWithHistory(messages);
    }
}
