package com.futureforge.ai.repository;

import com.futureforge.ai.entity.DomainRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DomainRecommendationRepository extends JpaRepository<DomainRecommendation, Long> {
    Optional<DomainRecommendation> findTopByUserIdOrderByCreatedAtDesc(Long userId);
}
