package com.futureforge.ai.service;

import com.futureforge.ai.entity.CareerAnalysis;
import com.futureforge.ai.entity.ChatMessage;
import com.futureforge.ai.entity.Roadmap;
import com.futureforge.ai.entity.RoadmapMilestone;
import com.futureforge.ai.entity.User;
import com.futureforge.ai.repository.CareerAnalysisRepository;
import com.futureforge.ai.repository.ChatMessageRepository;
import com.futureforge.ai.repository.RoadmapRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional(readOnly = true)
    public String generateDomainRecommendations(User user) {
        String profileContext = profileService.buildProfileContext(user);

        String systemPrompt = """
                You are 'Oracle', an elite IT Career Strategist AI and Tech Talent Architect.
                Analyze the candidate's verified skills, academic background, semester progression, and interests to recommend the top 3 high-growth tech domains with the highest market demand and strongest trajectory alignment (e.g., Cloud & Platform Engineering, Full-Stack Distributed Systems, Machine Learning & AI Systems, Cybersecurity & Application Security, Data Engineering & Analytics, DevOps & SRE).
                
                For each domain:
                - Do NOT hallucinate skills they do not possess.
                - Calculate a realistic matchPercentage (0-100) based on how many prerequisite skills they already possess.
                - Provide specific matchReasoning explaining how their existing tools transfer directly into this domain.
                - List 2-3 specific, achievable roles suitable for their stage.
                
                Your response MUST be exactly in the following JSON format ONLY, without markdown tags like ```json:
                {
                    "recommendations": [
                        {
                            "domainName": "Cloud & Platform Engineering",
                            "matchReasoning": "Your background in Linux and scripting strongly aligns with Cloud Infrastructure. Transitioning requires mastering Docker and Kubernetes...",
                            "matchPercentage": 88,
                            "topRoles": ["Cloud Architect", "Platform Engineer", "DevOps Engineer"]
                        }
                    ]
                }
                """;

        String userMessage = String.format("## Candidate Neural Profile:\n%s\n\nSynthesize optimal career domain trajectories.", profileContext);

        return groqAiService.chatAsJson(systemPrompt, userMessage);
    }

    @Transactional(readOnly = true)
    public String generateCareerAnalysis(User user, String targetDomain) {
        String profileContext = profileService.buildProfileContext(user);

        String systemPrompt = """
                You are 'Oracle', an elite IT Career Strategist AI and Technical Hiring Director.
                Conduct a rigorous, realistic technical gap analysis comparing the candidate's current capabilities against industry standards for the target domain.
                
                Evaluate their technical standing across 4 key dimensions:
                1. Core Programming & Language Proficiency
                2. Frameworks, APIs & Database Architecture
                3. Cloud, Containers & CI/CD Tooling
                4. Production Engineering, Testing & System Design
                
                Your response MUST be exactly in the following JSON format ONLY, without markdown tags like ```json:
                {
                    "careerFitScore": "72/100",
                    "analysisResult": "A detailed 2-3 paragraph executive summary of their current market competitiveness, hiring readiness, and the strategic path required to become production-ready.",
                    "strengths": [
                        "Strong foundational backend Java with clean OOP principles and RESTful design",
                        "Solid understanding of relational database schema design and ACID properties"
                    ],
                    "weaknesses": [
                        "Absence of containerization (Docker) and orchestration (Kubernetes) in their active stack",
                        "Lacks demonstrable automated CI/CD pipeline automation or integration testing"
                    ],
                    "recommendations": [
                        "Containerize existing Spring applications and write multi-stage Dockerfiles",
                        "Implement distributed caching with Redis to understand latency trade-offs",
                        "Deploy a portfolio project with automated GitHub Actions CI/CD to AWS or Render"
                    ]
                }
                """;

        String userMessage = String.format("## Candidate Neural Profile:\n%s\n\n## Target Domain:\n%s\n\nExecute comprehensive gap analysis.", profileContext, targetDomain);

        return groqAiService.chatAsJson(systemPrompt, userMessage);
    }

    @Transactional(readOnly = true)
    public String generateRoadmap(User user, String targetRole, String preferences, String assessmentContext) {
        String profileContext = profileService.buildProfileContext(user);
        
        List<CareerAnalysis> analyses = careerAnalysisRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        String analysisContext = "No prior gap analysis detected.";
        if (!analyses.isEmpty()) {
            CareerAnalysis latest = analyses.get(0);
            analysisContext = String.format("Identified Weaknesses: %s | Fit Score: %s | Summary: %s",
                    latest.getWeaknesses(), latest.getCareerFitScore(), latest.getAnalysisResult());
        }

        String systemPrompt = """
                You are 'Oracle', an elite Principal Curriculum Architect and Staff Engineer.
                Design a realistic, progressive week-by-week learning roadmap for the candidate to master the Target Role and bridge their identified technical weaknesses.
                
                IMPORTANT INSTRUCTIONS:
                1. Explicitly address the technical weaknesses from their gap analysis.
                2. Deeply incorporate the diagnostic assessment results: add remedial fundamentals if they struggled, or accelerate into advanced architectural patterns if they excelled.
                3. For each milestone, provide:
                   - weekNumber: sequential week number
                   - title: crisp, technical topic title
                   - description: A 3-tier blueprint: (1) Core concepts to master, (2) Hands-on mini-project to build with specific tools, (3) Measurable exit criteria to prove readiness.
                   - resources: 2-3 specific, high-quality, reputable learning resources WITH VALID DIRECT URLS (official documentation, roadmap.sh, top YouTube channels, or GitHub open-source repositories).
                
                Your response MUST be exactly in the following JSON format ONLY, without markdown tags like ```json:
                {
                    "title": "Cloud Platform & Distributed Systems Engineer Roadmap",
                    "description": "An intense, milestone-driven curriculum engineered to transition your foundational backend skills into enterprise-grade cloud architecture.",
                    "difficultyLevel": "INTERMEDIATE",
                    "estimatedWeeks": 12,
                    "milestones": [
                        {
                            "weekNumber": 1,
                            "title": "Containerization & Multi-Stage Docker Builds",
                            "description": "Concepts: Container primitives, namespace isolation, multi-stage Dockerfiles. Project: Dockerize an existing Spring Boot API with a MySQL sidecar using docker-compose. Exit Criteria: Successfully spin up and health-check the full multi-service stack with a single command.",
                            "resources": "1. Docker Official Documentation: https://docs.docker.com/get-started/\\n2. TechWorld with Nana Docker Course: https://www.youtube.com/c/TechWorldwithNana\\n3. Roadmap.sh DevOps Path: https://roadmap.sh/devops"
                        }
                    ]
                }
                """;

        String safeAssessment = sanitizeContext(assessmentContext, 3000);
        String safePreferences = sanitizeContext(preferences, 1000);

        String userMessage = String.format("""
                ## Candidate Neural Profile:
                %s
                
                ## Target Role:
                %s
                
                ## Technical Deficiencies & Gap Analysis:
                %s
                
                ## Diagnostic Assessment Results:
                <user_assessment_performance>
                %s
                </user_assessment_performance>
                
                ## Learner Preferences:
                <user_preferences>
                %s
                </user_preferences>
                
                Generate the curriculum matrix according to the specified JSON schema.
                """, profileContext, targetRole, analysisContext, safeAssessment, safePreferences);

        return groqAiService.chatAsJson(systemPrompt, userMessage);
    }

    public String evaluateCodeSnippet(String taskTitle, String taskDescription, String codeSnippet) {
        String systemPrompt = """
                You are 'Oracle', an elite automated code compiler, runtime evaluator, and senior code reviewer.
                Analyze the user's submitted code snippet for the specified challenge.
                Check for:
                1. Syntax validity and compilation errors.
                2. Algorithmic correctness across standard and edge-case inputs.
                3. Time and Space Complexity (Big-O notation).
                4. Code readability and clean coding principles.
                
                Return your response EXACTLY in the following JSON format ONLY, without markdown tags like ```json:
                {
                    "isCorrect": true,
                    "compilerOutput": "Build Successful! All 5/5 hidden test cases passed.\\nRuntime: 38ms | Memory: 34.2MB\\nTime Complexity: O(N) | Space Complexity: O(1)",
                    "feedback": "Clean and idiomatic implementation! Excellent in-place pointer manipulation. As an optional optimization, consider adding early-exit guards for empty or single-node inputs."
                }
                If incorrect or failing:
                {
                    "isCorrect": false,
                    "compilerOutput": "Runtime Error: NullPointerException at solution(Solution.java:18)\\nTest Case 3/5 Failed: Input [1] -> Expected [1], Received null",
                    "feedback": "Your solution misses the single-element edge case where the next pointer is null. Add a base-case check at the beginning of the function."
                }
                Make the compilerOutput look like an authentic terminal or IDE build log.
                """;

        String userMessage = String.format("## Task: %s\n## Description: %s\n\n## User Code:\n%s", taskTitle, taskDescription, codeSnippet);
        return groqAiService.chatAsJson(systemPrompt, userMessage);
    }

    public String generateAssessment(String domain) {
        String systemPrompt = """
                You are 'Oracle', a Senior Technical Interviewer and Staff Examiner.
                Create a high-caliber diagnostic skill assessment test for the given domain.
                The test MUST contain:
                1. Exactly 10 multiple-choice questions: 5 'easy' (fundamental concepts) and 5 'hard' (scenario-based architecture, debugging, edge cases).
                2. Exactly 2 practical coding challenges with clear problem statements and expected input/output.
                
                Your response MUST be exactly in the following JSON format ONLY, without markdown tags like ```json:
                {
                    "mcqs": [
                        {
                            "question": "In a distributed system, what is the primary distinction between eventual consistency and strong consistency under the CAP theorem?",
                            "options": [
                                "Eventual consistency guarantees immediate read freshness across all replicas",
                                "Strong consistency ensures every read receives the most recent write, while eventual consistency allows stale reads temporarily until convergence",
                                "Eventual consistency prevents network partitions entirely",
                                "Strong consistency eliminates the need for database locks"
                            ],
                            "correctOptionIndex": 1,
                            "difficulty": "hard"
                        }
                    ],
                    "coding": [
                        {
                            "title": "Reverse a Singly Linked List",
                            "description": "Write a function that reverses a singly linked list in-place and returns the new head pointer."
                        }
                    ]
                }
                """;

        String userMessage = "Generate assessment for Domain: " + domain;
        return groqAiService.chatAsJson(systemPrompt, userMessage);
    }

    @Transactional(readOnly = true)
    public String generateMentorChatResponse(User user, Long sessionId) {
        String profileContext = profileService.buildProfileContext(user);
        
        List<CareerAnalysis> analyses = careerAnalysisRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        String analysisContext = "No prior gap analysis completed.";
        if (!analyses.isEmpty()) {
            CareerAnalysis latest = analyses.get(0);
            analysisContext = String.format("""
                    - Career Fit Score: %s
                    - Key Strengths: %s
                    - Critical Weaknesses: %s
                    - Recommended Actions: %s
                    """,
                    latest.getCareerFitScore() != null ? latest.getCareerFitScore() : "Not scored",
                    latest.getStrengths() != null ? latest.getStrengths() : "None identified",
                    latest.getWeaknesses() != null ? latest.getWeaknesses() : "None identified",
                    latest.getRecommendations() != null ? latest.getRecommendations() : "None identified");
        }

        List<Roadmap> roadmaps = roadmapRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        String roadmapContext = "No active roadmap initiated.";
        if (!roadmaps.isEmpty()) {
            Roadmap active = roadmaps.get(0);
            List<RoadmapMilestone> milestones = active.getMilestones() != null ? active.getMilestones() : List.of();
            long completedCount = milestones.stream().filter(m -> Boolean.TRUE.equals(m.getIsCompleted())).count();
            
            // Find current active milestone (first incomplete milestone)
            RoadmapMilestone currentMilestone = milestones.stream()
                    .filter(m -> !Boolean.TRUE.equals(m.getIsCompleted()))
                    .findFirst()
                    .orElse(null);
                    
            StringBuilder sb = new StringBuilder();
            sb.append(String.format("Target Role: %s (Duration: %d weeks)\n", active.getTargetRole(), active.getEstimatedWeeks()));
            sb.append(String.format("Milestone Progress: %d/%d completed (%.0f%%)\n", 
                    completedCount, milestones.size(), milestones.isEmpty() ? 0.0 : (completedCount * 100.0 / milestones.size())));
            
            if (currentMilestone != null) {
                sb.append(String.format(">>> CURRENT ACTIVE MILESTONE (Week %d): %s\n", currentMilestone.getWeekNumber(), currentMilestone.getTitle()));
                sb.append(String.format("    Description: %s\n", currentMilestone.getDescription()));
                if (currentMilestone.getResources() != null && !currentMilestone.getResources().isBlank()) {
                    sb.append(String.format("    Curated Resources: %s\n", currentMilestone.getResources()));
                }
            } else if (!milestones.isEmpty()) {
                sb.append(">>> ALL MILESTONES COMPLETED! The user has finished their active curriculum.\n");
            }

            // Summary of completed milestones
            List<String> completedTitles = milestones.stream()
                    .filter(m -> Boolean.TRUE.equals(m.getIsCompleted()))
                    .map(m -> "Week " + m.getWeekNumber() + ": " + m.getTitle())
                    .toList();
            if (!completedTitles.isEmpty()) {
                sb.append("Completed Milestones: ").append(String.join(", ", completedTitles)).append("\n");
            }

            // Upcoming milestones preview
            List<String> upcomingTitles = milestones.stream()
                    .filter(m -> !Boolean.TRUE.equals(m.getIsCompleted()))
                    .skip(1)
                    .limit(3)
                    .map(m -> "Week " + m.getWeekNumber() + ": " + m.getTitle())
                    .toList();
            if (!upcomingTitles.isEmpty()) {
                sb.append("Upcoming Next: ").append(String.join(" -> ", upcomingTitles)).append("\n");
            }

            roadmapContext = sb.toString();
        }

        String systemPrompt = String.format("""
                You are 'Oracle', an elite Staff-Level Technical Mentor and Career Architect at FutureForge AI.
                You are explicitly trained and calibrated on the real-time neural profile and curriculum of the engineer speaking to you.

                ## CORE OPERATIONAL PERSONA:
                1. MENTOR IDENTITY: You speak with the authority, clarity, and warmth of a seasoned Staff/Principal Engineer or Engineering Director. You are direct, encouraging, highly technical, and never give fluff or generic platitudes.
                2. DEEP CONTEXT INTEGRATION: Your responses MUST continuously synthesize the candidate's exact profile, semester progression, current skills, gap analysis, and active roadmap milestones provided below.
                3. MILESTONE COACHING: If the user has an active milestone, proactively guide them on mastering it. When they ask questions, connect your technical answers directly to their current stack and current milestone.
                4. SOCRATIC & PRACTICAL: When the user asks for code or debugging help:
                   - Provide production-grade, clean code examples (idiomatic, with error handling, proper naming, and edge case coverage).
                   - Explain architectural trade-offs (scalability, latency, memory complexity).
                   - Offer Socratic follow-ups to test their comprehension ("Have you thought about how this behaves under concurrent writes?").
                5. HONEST MARKET REALISM: If their profile shows a clear technical gap for their dream role, give them realistic, actionable steps to bridge it with tangible portfolio projects rather than false praise.
                6. EMPTY PROFILE DIRECTIVE: If their profile has no skills or education, advise them: "Your neural profile is currently uncalibrated. Head over to the **Profile** page to add your skills or upload your resume so I can tailor my engineering guidance to you."
                7. CONVERSATIONAL CONTINUITY: Maintain flow from previous conversation turns. Do NOT re-introduce yourself every turn.

                ## CANDIDATE'S NEURAL PROFILE (TRAINING DATA):
                <candidate_profile>
                %s
                </candidate_profile>

                ## LATEST TECHNICAL GAP ANALYSIS:
                <gap_analysis>
                %s
                </gap_analysis>

                ## ACTIVE CURRICULUM & ROADMAP STATUS:
                <active_roadmap>
                %s
                </active_roadmap>
                """, 
                sanitizeContext(profileContext, 2000), 
                sanitizeContext(analysisContext, 2000), 
                sanitizeContext(roadmapContext, 3000));

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
            if (role.equals("mentor") || role.equals("ai")) role = "assistant";
            messages.add(Map.of("role", role, "content", msg.getContent()));
        }

        return groqAiService.chatWithHistory(messages);
    }

    public String parseResumeToProfile(String resumeText) {
        String systemPrompt = """
                You are 'Oracle', an elite AI data extractor and technical recruiter.
                Parse the provided resume text and extract the candidate's details.
                Map the extracted data EXACTLY to the following JSON format.
                Do NOT include any markdown formatting or extra text. Only JSON.
                
                {
                    "bio": "A crisp, compelling technical professional summary extracted from the resume",
                    "education": "Degree, Major, and University",
                    "semester": 0,
                    "careerGoal": "Inferred or stated career aspirations",
                    "skills": ["Java", "Python", "React", "Docker"],
                    "interests": ["Machine Learning", "Open Source", "Distributed Systems"],
                    "linkedinUrl": "https://linkedin.com/in/... (if found)",
                    "githubUrl": "https://github.com/... (if found)",
                    "leetcodeUrl": "https://leetcode.com/... (if found)",
                    "portfolioUrl": "https://... (if found, excluding the above)"
                }
                
                Note: 'semester' should be an integer from 1-10 if mentioned, otherwise 0.
                """;

        String userMessage = "Here is the raw resume text:\n\n" + resumeText;
        return groqAiService.chatAsJson(systemPrompt, userMessage);
    }

    private String sanitizeContext(String input, int maxLength) {
        if (input == null || input.isBlank()) {
            return "None provided.";
        }
        String sanitized = input.trim();
        if (sanitized.length() > maxLength) {
            sanitized = sanitized.substring(0, maxLength) + "... [truncated]";
        }
        // Neutralize script tags and HTML injection
        sanitized = sanitized.replaceAll("(?i)<script.*?>.*?</script>", "")
                             .replaceAll("(?i)<script.*?>", "")
                             .replaceAll("(?i)</script>", "");
        // Neutralize prompt override attacks
        sanitized = sanitized.replaceAll("(?i)ignore (all )?previous instructions", "[REDACTED_PROMPT_OVERRIDE]")
                             .replaceAll("(?i)forget previous instructions", "[REDACTED_PROMPT_OVERRIDE]")
                             .replaceAll("(?i)system override", "[REDACTED_PROMPT_OVERRIDE]");
        return sanitized.replace("```", "'''")
                        .replace("<system>", "")
                        .replace("</system>", "")
                        .replace("SYSTEM:", "");
    }
}
