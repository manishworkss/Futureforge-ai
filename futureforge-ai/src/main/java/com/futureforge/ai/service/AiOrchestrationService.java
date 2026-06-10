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
                You are 'Oracle', an elite IT Career Strategist AI.
                Analyze the user's profile and recommend the top 3 IT domains that fit them best based STRICTLY on their skills, current role, and stated interests.
                Do NOT hallucinate skills they do not possess.
                
                Your response MUST be exactly in the following JSON format ONLY, without markdown tags like ```json:
                {
                    "recommendations": [
                        {
                            "domainName": "Cloud Engineering",
                            "matchReasoning": "Your background in Linux and scripting strongly aligns with Cloud Infrastructure...",
                            "matchPercentage": 92,
                            "topRoles": ["Cloud Architect", "DevOps Engineer"]
                        }
                    ]
                }
                """;

        String userMessage = String.format("## Current Neural Profile:\n%s\n\nGenerate optimal domain trajectories.", profileContext);

        return groqAiService.chat(systemPrompt, userMessage);
    }

    public String generateCareerAnalysis(User user, String targetDomain) {
        String profileContext = profileService.buildProfileContext(user);

        String systemPrompt = """
                You are 'Oracle', an elite IT Career Strategist AI.
                Conduct a brutal, realistic gap analysis of the user's current skills against their target domain.
                Identify exact technical deficiencies and high-value strengths.
                
                Your response MUST be exactly in the following JSON format ONLY, without markdown tags like ```json:
                {
                    "careerFitScore": "75/100",
                    "analysisResult": "Detailed realistic analysis of their current standing in the market...",
                    "strengths": ["Strong foundational Java", "Good understanding of REST"],
                    "weaknesses": ["Lacks modern CI/CD experience", "No cloud platform exposure"],
                    "recommendations": ["Master Docker/Kubernetes", "Build a serverless project on AWS"]
                }
                """;

        String userMessage = String.format("## Profile Data:\n%s\n\n## Target Domain:\n%s\n\nExecute gap analysis.", profileContext, targetDomain);

        return groqAiService.chat(systemPrompt, userMessage);
    }

    public String generateRoadmap(User user, String targetRole, String preferences) {
        String profileContext = profileService.buildProfileContext(user);
        
        List<CareerAnalysis> analyses = careerAnalysisRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        String analysisContext = "No prior gap analysis detected.";
        if (!analyses.isEmpty()) {
            CareerAnalysis latest = analyses.get(0);
            analysisContext = "Identified Weaknesses: " + latest.getWeaknesses() + "\nAnalysis Summary: " + latest.getAnalysisResult();
        }

        String systemPrompt = """
                You are 'Oracle', an elite IT Curriculum Architect AI.
                Design a realistic, step-by-step learning roadmap for the user to secure the Target Role.
                You must explicitly address the "Identified Weaknesses" from their gap analysis.
                Make the milestones progressive and highly technical. Avoid vague advice.
                
                Your response MUST be exactly in the following JSON format ONLY, without markdown tags like ```json:
                {
                    "title": "Full Stack Migration Architect Roadmap",
                    "description": "An intense 12-week trajectory focusing on fixing CI/CD gaps and mastering cloud deployments.",
                    "difficultyLevel": "INTERMEDIATE",
                    "estimatedWeeks": 12,
                    "milestones": [
                        {
                            "weekNumber": 1,
                            "title": "Containerization Mastery",
                            "description": "Learn Docker basics, write Dockerfiles for existing Spring apps, and setup docker-compose.",
                            "resources": "Docker Official Docs, 'Docker Mastery' course"
                        }
                    ]
                }
                """;

        String userMessage = String.format("""
                ## Neural Profile:
                %s
                
                ## Target Role: %s
                
                ## Strategic Context (Weaknesses to address):
                %s
                
                ## User Preferences:
                %s
                
                Generate the curriculum matrix.
                """, profileContext, targetRole, analysisContext, (preferences != null ? preferences : "None"));

        return groqAiService.chat(systemPrompt, userMessage);
    }

    public String generateMentorChatResponse(User user) {
        String profileContext = profileService.buildProfileContext(user);
        
        List<CareerAnalysis> analyses = careerAnalysisRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        String analysisContext = analyses.isEmpty() ? "None" : "Identified Weaknesses: " + analyses.get(0).getWeaknesses() + " | Fit Score: " + analyses.get(0).getCareerFitScore();

        List<Roadmap> roadmaps = roadmapRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        String roadmapContext = "None";
        if (!roadmaps.isEmpty()) {
            Roadmap active = roadmaps.get(0);
            long completedMilestones = active.getMilestones().stream().filter(m -> m.getIsCompleted()).count();
            long totalMilestones = active.getMilestones().size();
            roadmapContext = String.format("Target Role: %s | Progress: %d/%d Milestones Completed", 
                    active.getTargetRole(), completedMilestones, totalMilestones);
        }

        String systemPrompt = String.format("""
                You are 'Oracle', an elite, highly realistic IT Career Strategist AI from FutureForge.
                
                ## SYSTEM DIRECTIVES:
                1. Act as a senior tech mentor. Be direct, highly technical, actionable, and encouraging but realistic.
                2. NEVER break character. You are Oracle.
                3. NEVER start responses with generic filler like "As an AI...".
                4. Keep responses concise (1-3 short paragraphs max). Format with Markdown (bolding key tech terms).
                5. STRICTLY utilize the User's Context below. If they ask about their progress, reference their Roadmap Progress. If they ask what to learn next, reference their Identified Weaknesses.
                6. MAKE YOUR RESPONSES DYNAMIC AND SOLUTION-ORIENTED. For example, if a user has a gap, explicitly tell them: "Go and upload your latest resume" or "Complete the Docker module in your roadmap and check off the milestone." Give step-by-step actionable solutions.
                7. IF THE USER'S PROFILE IS EMPTY (e.g., no skills or role listed): Do NOT ask them generic questions. Explicitly tell them: "Your neural profile is currently empty. Please navigate to the **Profile** page in the sidebar and upload your technical skills, education, and current role so I can construct a personalized trajectory for you."
                
                ## USER'S EXACT CONTEXT:
                %s
                
                Latest Gap Analysis:
                %s
                
                Active Learning Roadmap:
                %s
                """, profileContext, analysisContext, roadmapContext);

        // Fetch recent history (limit to 10 for tight context window)
        List<ChatMessage> rawHistory = chatMessageRepository.findTop20ByUserIdOrderByCreatedAtDesc(user.getId());
        List<ChatMessage> history = new ArrayList<>(rawHistory.subList(0, Math.min(10, rawHistory.size())));
        java.util.Collections.reverse(history); // Chronological order
        
        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", systemPrompt));
        
        for (ChatMessage msg : history) {
            String role = msg.getRole().name().toLowerCase();
            // Llama API expects 'assistant'
            if (role.equals("mentor") || role.equals("ai")) role = "assistant";
            messages.add(Map.of("role", role, "content", msg.getContent()));
        }

        return groqAiService.chatWithHistory(messages);
    }
}
