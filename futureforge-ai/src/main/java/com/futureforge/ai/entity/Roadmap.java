package com.futureforge.ai.entity;

import com.futureforge.ai.entity.enums.DifficultyLevel;
import com.futureforge.ai.entity.enums.RoadmapStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "roadmaps")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Roadmap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(name = "target_role", length = 100)
    private String targetRole;

    @Enumerated(EnumType.STRING)
    @Column(name = "difficulty_level", length = 20)
    @Builder.Default
    private DifficultyLevel difficultyLevel = DifficultyLevel.INTERMEDIATE;

    @Column(name = "estimated_weeks")
    @Builder.Default
    private Integer estimatedWeeks = 12;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    @Builder.Default
    private RoadmapStatus status = RoadmapStatus.ACTIVE;

    @OneToMany(mappedBy = "roadmap", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    @Builder.Default
    private List<RoadmapMilestone> milestones = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public void addMilestone(RoadmapMilestone milestone) {
        milestones.add(milestone);
        milestone.setRoadmap(this);
    }
}
