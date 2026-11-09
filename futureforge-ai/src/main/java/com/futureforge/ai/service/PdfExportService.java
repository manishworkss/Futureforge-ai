package com.futureforge.ai.service;

import com.futureforge.ai.entity.CareerAnalysis;
import com.futureforge.ai.entity.Roadmap;
import com.futureforge.ai.entity.RoadmapMilestone;
import com.futureforge.ai.entity.User;
import com.futureforge.ai.entity.UserProfile;
import com.futureforge.ai.repository.CareerAnalysisRepository;
import com.futureforge.ai.repository.RoadmapRepository;
import com.futureforge.ai.repository.UserProfileRepository;
import com.futureforge.ai.repository.UserRepository;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.properties.TextAlignment;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PdfExportService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final CareerAnalysisRepository careerAnalysisRepository;
    private final RoadmapRepository roadmapRepository;

    @Transactional(readOnly = true)
    public byte[] generateCareerReport() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        Optional<UserProfile> profileOpt = userProfileRepository.findByUserId(user.getId());
        List<CareerAnalysis> analyses = careerAnalysisRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        List<Roadmap> roadmaps = roadmapRepository.findByUserIdOrderByCreatedAtDesc(user.getId());

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // Document Title
        Paragraph header = new Paragraph("FutureForge AI — Executive Career Intelligence Report")
                .setTextAlignment(TextAlignment.CENTER)
                .setBold()
                .setFontSize(20);
        document.add(header);

        Paragraph subheader = new Paragraph("Autonomous Neural Trajectory & Curriculum Report")
                .setTextAlignment(TextAlignment.CENTER)
                .setItalic()
                .setFontSize(11);
        document.add(subheader);
        document.add(new Paragraph("\n"));

        // Candidate Profile
        document.add(new Paragraph("1. CANDIDATE NEURAL PROFILE").setBold().setFontSize(13));
        document.add(new Paragraph("Full Name: " + user.getFullName()));
        document.add(new Paragraph("Email: " + user.getEmail()));

        if (profileOpt.isPresent()) {
            UserProfile p = profileOpt.get();
            if (p.getEducation() != null && !p.getEducation().isBlank()) {
                document.add(new Paragraph("Education: " + p.getEducation() + (p.getSemester() != null && p.getSemester() > 0 ? " (Semester " + p.getSemester() + ")" : "")));
            }
            if (p.getCareerGoal() != null && !p.getCareerGoal().isBlank()) {
                document.add(new Paragraph("Primary Career Target: " + p.getCareerGoal()));
            }
            if (p.getSkillsJson() != null && !p.getSkillsJson().isBlank()) {
                document.add(new Paragraph("Acquired Tech Stack: " + p.getSkillsJson()));
            }
            if (p.getInterestsJson() != null && !p.getInterestsJson().isBlank()) {
                document.add(new Paragraph("Stated Interests: " + p.getInterestsJson()));
            }
        }
        document.add(new Paragraph("\n"));

        // Gap Analysis Section
        document.add(new Paragraph("2. TECHNICAL GAP ANALYSIS & MARKET READINESS").setBold().setFontSize(13));
        if (!analyses.isEmpty()) {
            CareerAnalysis analysis = analyses.get(0);
            if (analysis.getAnalysisInput() != null) {
                document.add(new Paragraph("Target Domain / Role: " + analysis.getAnalysisInput()).setBold());
            }
            if (analysis.getCareerFitScore() != null) {
                document.add(new Paragraph("Industry Market Fit Score: " + analysis.getCareerFitScore()).setBold());
            }
            if (analysis.getAnalysisResult() != null && !analysis.getAnalysisResult().isBlank()) {
                document.add(new Paragraph("\nExecutive Summary:"));
                document.add(new Paragraph(analysis.getAnalysisResult()));
            }
            if (analysis.getStrengths() != null && !analysis.getStrengths().isBlank()) {
                document.add(new Paragraph("\nVerified Strengths:").setBold());
                document.add(new Paragraph(analysis.getStrengths()));
            }
            if (analysis.getWeaknesses() != null && !analysis.getWeaknesses().isBlank()) {
                document.add(new Paragraph("\nIdentified Deficiencies / Gaps:").setBold());
                document.add(new Paragraph(analysis.getWeaknesses()));
            }
            if (analysis.getRecommendations() != null && !analysis.getRecommendations().isBlank()) {
                document.add(new Paragraph("\nRecommended Strategic Actions:").setBold());
                document.add(new Paragraph(analysis.getRecommendations()));
            }
        } else {
            document.add(new Paragraph("No formal gap analysis generated yet. Complete a domain assessment to populate technical readiness metrics."));
        }
        document.add(new Paragraph("\n"));

        // Active Roadmap Milestones Section
        document.add(new Paragraph("3. ACTIVE LEARNING ROADMAP & MILESTONES").setBold().setFontSize(13));
        if (!roadmaps.isEmpty()) {
            Roadmap roadmap = roadmaps.get(0);
            document.add(new Paragraph("Curriculum Title: " + (roadmap.getTitle() != null ? roadmap.getTitle() : "Roadmap to " + roadmap.getTargetRole())).setBold());
            document.add(new Paragraph("Target Role: " + roadmap.getTargetRole() + " | Difficulty: " + roadmap.getDifficultyLevel() + " | Duration: " + roadmap.getEstimatedWeeks() + " Weeks"));

            if (roadmap.getDescription() != null && !roadmap.getDescription().isBlank()) {
                document.add(new Paragraph("Curriculum Overview: " + roadmap.getDescription()));
            }

            List<RoadmapMilestone> milestones = roadmap.getMilestones();
            if (milestones != null && !milestones.isEmpty()) {
                long completedCount = milestones.stream().filter(m -> Boolean.TRUE.equals(m.getIsCompleted())).count();
                document.add(new Paragraph("Progress: " + completedCount + " of " + milestones.size() + " milestones completed (" + (completedCount * 100 / milestones.size()) + "%)\n"));

                for (RoadmapMilestone m : milestones) {
                    String status = Boolean.TRUE.equals(m.getIsCompleted()) ? "[COMPLETED]" : "[PENDING]";
                    document.add(new Paragraph(status + " Week " + m.getWeekNumber() + ": " + m.getTitle()).setBold());
                    if (m.getDescription() != null && !m.getDescription().isBlank()) {
                        document.add(new Paragraph("    " + m.getDescription()));
                    }
                    if (m.getResources() != null && !m.getResources().isBlank()) {
                        document.add(new Paragraph("    Resources: " + m.getResources()));
                    }
                }
            }
        } else {
            document.add(new Paragraph("No active roadmap initiated. Generate a roadmap from your dashboard to begin milestone tracking."));
        }

        // Footer
        document.add(new Paragraph("\n\nFutureForge AI Platform — Report compiled on " + LocalDate.now().format(DateTimeFormatter.ofPattern("MMMM dd, yyyy")))
                .setTextAlignment(TextAlignment.RIGHT)
                .setItalic()
                .setFontSize(9));

        document.close();
        return baos.toByteArray();
    }
}
