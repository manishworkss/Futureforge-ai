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

        return groqAiService.chatAsJson(systemPrompt, userMessage);
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

        return groqAiService.chatAsJson(systemPrompt, userMessage);
    }

    public String generateRoadmap(User user, String targetRole, String preferences, String assessmentContext) {
        String profileContext = profileService.buildProfileContext(user);
        
        List<CareerAnalysis> analyses = careerAnalysisRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        String analysisContext = "No prior gap analysis detected.";
        if (!analyses.isEmpty()) {
            CareerAnalysis latest = analyses.get(0);
            analysisContext = "Identified Weaknesses: " + latest.getWeaknesses() + "\\nAnalysis Summary: " + latest.getAnalysisResult();
        }

        String systemPrompt = """
                You are 'Oracle', an elite IT Curriculum Architect AI.
                Design a realistic, step-by-step learning roadmap for the user to secure the Target Role.
                You must explicitly address the "Identified Weaknesses" from their gap analysis.
                You MUST deeply incorporate the "Assessment Performance" into your roadmap. Adjust the difficulty and skip basics if they scored well, or add remedial phases if they scored poorly.
                Make the milestones progressive and highly technical. Avoid vague advice.
                IMPORTANT: For the 'resources' field in each milestone, provide REAL, SPECIFIC, and HIGH-QUALITY resources. You MUST include actual URLs. If you recommend a video, include a link to the YouTube channel or video. If you recommend a course, doc, or website, provide the direct website link.
                
                Your response MUST be exactly in the following JSON format ONLY, without markdown tags like ```json:
                {
                    "title": "Full Stack Migration Architect Roadmap",
                    "description": "An intense trajectory focusing on fixing CI/CD gaps based on your assessment.",
                    "difficultyLevel": "INTERMEDIATE",
                    "estimatedWeeks": 12,
                    "milestones": [
                        {
                            "weekNumber": 1,
                            "title": "Containerization Mastery",
                            "description": "Learn Docker basics, write Dockerfiles for existing Spring apps, and setup docker-compose.",
                            "resources": "1. TechWorld with Nana (YouTube): https://www.youtube.com/c/TechWorldwithNana\\n2. Docker Official Docs: https://docs.docker.com/"
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
                
                ## Assessment Performance:
                %s
                
                ## User Preferences:
                %s
                
                Generate the curriculum matrix.
                """, profileContext, targetRole, analysisContext, (assessmentContext != null ? assessmentContext : "No assessment taken"), (preferences != null ? preferences : "None"));

        return groqAiService.chatAsJson(systemPrompt, userMessage);
    }

    public String evaluateCodeSnippet(String taskTitle, String taskDescription, String codeSnippet) {
        String systemPrompt = """
                You are 'Oracle', an elite automated code compiler and evaluator.
                Your job is to analyze the user's code snippet for the given task.
                Identify if the code contains syntax errors, logic errors, or if it successfully solves the problem.
                Return your response EXACTLY in the following JSON format ONLY, without markdown tags like ```json:
                {
                    "isCorrect": true,
                    "compilerOutput": "Build Successful! All 5/5 hidden test cases passed.\\nRuntime: 45ms\\nMemory: 32MB",
                    "feedback": "Great use of the map function. Consider using a Set next time to improve time complexity to O(N)."
                }
                If there is an error, return something like:
                {
                    "isCorrect": false,
                    "compilerOutput": "SyntaxError: Unexpected token ';' at line 4.\\n    at execute (vm.js:12:33)",
                    "feedback": "You have a syntax error. Check your loop conditions and ensure all brackets are closed."
                }
                Make the compilerOutput look like real terminal/console output.
                """;

        String userMessage = String.format("## Task: %s\n## Description: %s\n\n## User Code:\n%s", taskTitle, taskDescription, codeSnippet);
        return groqAiService.chatAsJson(systemPrompt, userMessage);
    }

    public String generateAssessment(String domain) {
        String systemPrompt = """
                You are 'Oracle', an elite technical recruiter and examiner.
                Create a skill assessment test for the given domain.
                The test MUST contain exactly 10 multiple-choice questions (5 'easy' and 5 'hard').
                The test MUST contain exactly 2 coding/technical short-answer questions.
                
                Your response MUST be exactly in the following JSON format ONLY, without markdown tags like ```json:
                {
                    "mcqs": [
                        {
                            "question": "What is the primary purpose of a reverse proxy?",
                            "options": [
                                "To act as a firewall",
                                "To distribute client requests to backend servers",
                                "To store session state",
                                "To encrypt database traffic"
                            ],
                            "correctOptionIndex": 1,
                            "difficulty": "easy"
                        }
                    ],
                    "coding": [
                        {
                            "title": "Reverse a Linked List",
                            "description": "Write a function to reverse a singly linked list in-place."
                        }
                    ]
                }
                """;

        String userMessage = "Generate assessment for Domain: " + domain;
        return groqAiService.chatAsJson(systemPrompt, userMessage);
    }

    public String generateMentorChatResponse(User user, Long sessionId) {
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
                You are 'Oracle', an elite IT Career Strategist AI. You have been explicitly FINE-TUNED and TRAINED on the specific user you are speaking to.
                
                ## SYSTEM DIRECTIVES:
                1. Act as a senior tech mentor. Be direct, highly technical, actionable, and encouraging but realistic.
                2. NEVER break character. You are Oracle.
                3. Your entire reality is based on the USER'S EXACT CONTEXT provided below. You must reference their specific skills, their specific semester/level, and their precise goals in EVERY response.
                4. NEVER give generic advice. If they ask a technical question, answer it through the lens of their 'Acquired Tech Stack'.
                5. MAKE YOUR RESPONSES DYNAMIC AND SOLUTION-ORIENTED. For example, if a user has a gap, explicitly tell them: "Based on your Roadmap, you need to complete the Docker module." Give step-by-step actionable solutions.
                6. IF THE USER'S PROFILE IS EMPTY (e.g., no skills or role listed): Explicitly tell them: "Your neural profile is currently empty. Please navigate to the **Profile** page and upload your technical skills so I can personalize my algorithms to you."
                7. DO NOT HALLUCINATE. Only recommend things that make logical sense given their Target Role and Current Weaknesses.
                
                ## USER'S EXACT CONTEXT (TRAINING DATA):
                %s
                
                Latest Gap Analysis:
                %s
                
                Active Learning Roadmap:
                %s
                """, profileContext, analysisContext, roadmapContext);

        // Fetch recent history for this specific session
        List<ChatMessage> history = new ArrayList<>();
        if (sessionId != null) {
            List<ChatMessage> rawHistory = chatMessageRepository.findByChatSessionIdOrderByCreatedAtAsc(sessionId);
            // take last 10 messages for context
            int startIndex = Math.max(0, rawHistory.size() - 10);
            history = rawHistory.subList(startIndex, rawHistory.size());
        }
        
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

    public String parseResumeToProfile(String resumeText) {
        String systemPrompt = """
                You are 'Oracle', an elite AI data extractor.
                Parse the provided resume text and extract the candidate's details.
                Map the extracted data EXACTLY to the following JSON format.
                Do NOT include any markdown formatting or extra text. Only JSON.
                
                {
                    "bio": "A brief summary extracted from the resume",
                    "education": "Degree, Major, and University",
                    "semester": 0,
                    "careerGoal": "Inferred or stated career goals",
                    "skills": ["Java", "Python", "React", "Docker"],
                    "interests": ["Machine Learning", "Open Source"],
                    "linkedinUrl": "https://linkedin.com/in/... (if found)",
                    "githubUrl": "https://github.com/... (if found)",
                    "leetcodeUrl": "https://leetcode.com/... (if found)",
                    "portfolioUrl": "https://... (if found, excluding the above)"
                }
                
                Note: 'semester' should be an integer from 1-10 if mentioned, otherwise 0.
                """;

        String userMessage = "Here is the raw resume text:\\n\\n" + resumeText;
        return groqAiService.chatAsJson(systemPrompt, userMessage);
    }
}
