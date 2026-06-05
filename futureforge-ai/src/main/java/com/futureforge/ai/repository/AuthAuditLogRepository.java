package com.futureforge.ai.repository;

import com.futureforge.ai.entity.AuthAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuthAuditLogRepository extends JpaRepository<AuthAuditLog, Long> {
    List<AuthAuditLog> findTop10ByUserEmailOrderByTimestampDesc(String email);
}
