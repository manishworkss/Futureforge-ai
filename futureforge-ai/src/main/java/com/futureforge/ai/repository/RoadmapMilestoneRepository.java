package com.futureforge.ai.repository;

import com.futureforge.ai.entity.RoadmapMilestone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoadmapMilestoneRepository extends JpaRepository<RoadmapMilestone, Long> {
}
