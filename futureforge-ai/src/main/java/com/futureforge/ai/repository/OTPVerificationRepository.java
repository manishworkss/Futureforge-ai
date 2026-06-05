package com.futureforge.ai.repository;

import com.futureforge.ai.entity.OTPVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface OTPVerificationRepository extends JpaRepository<OTPVerification, Long> {
    
    Optional<OTPVerification> findTopByEmailOrderByCreatedAtDesc(String email);

    @Transactional
    void deleteByEmail(String email);
}
