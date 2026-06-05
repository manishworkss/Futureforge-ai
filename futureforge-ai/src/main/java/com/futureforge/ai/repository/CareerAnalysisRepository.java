package com.futureforge.ai.repository;

import com.futureforge.ai.entity.CareerAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CareerAnalysisRepository extends JpaRepository<CareerAnalysis, Long> {

    List<CareerAnalysis> findByUserIdOrderByCreatedAtDesc(Long userId);
}
