package com.futureforge.ai.repository;

import com.futureforge.ai.entity.Roadmap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoadmapRepository extends JpaRepository<Roadmap, Long> {

    List<Roadmap> findByUserIdOrderByCreatedAtDesc(Long userId);
}
