-- ============================================
-- FutureForge AI - Comprehensive Production Schema
-- MySQL 8.x
-- ============================================

-- ============================================
-- 1. Users Table
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name      VARCHAR(100) NOT NULL,
    email          VARCHAR(150) NOT NULL UNIQUE,
    password_hash  VARCHAR(255),
    provider       VARCHAR(20)  NOT NULL DEFAULT 'LOCAL',
    provider_id    VARCHAR(150),
    email_verified BOOLEAN      NOT NULL DEFAULT FALSE,
    role           VARCHAR(20)  NOT NULL DEFAULT 'USER',
    is_active      BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. User Profiles Table
-- ============================================
CREATE TABLE IF NOT EXISTS user_profiles (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id          BIGINT NOT NULL UNIQUE,
    semester         INT,
    education        VARCHAR(150),
    skills_json      TEXT COMMENT 'JSON array of technical skills',
    interests_json   TEXT COMMENT 'JSON array of career interests',
    career_goal      VARCHAR(255),
    bio              TEXT,
    linkedin_url     VARCHAR(255),
    github_url       VARCHAR(255),
    leetcode_url     VARCHAR(255),
    portfolio_url    VARCHAR(255),
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. Domain Recommendations Table
-- ============================================
CREATE TABLE IF NOT EXISTS domain_recommendations (
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id           BIGINT NOT NULL,
    ai_response_json  TEXT NOT NULL COMMENT 'JSON output from AI',
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 4. Career Analyses Table
-- ============================================
CREATE TABLE IF NOT EXISTS career_analyses (
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id           BIGINT NOT NULL,
    target_role       VARCHAR(100),
    analysis_input    TEXT,
    analysis_result   TEXT,
    career_fit_score  VARCHAR(50),
    strengths         TEXT,
    weaknesses        TEXT,
    recommendations   TEXT,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 5. Roadmaps Table
-- ============================================
CREATE TABLE IF NOT EXISTS roadmaps (
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id           BIGINT NOT NULL,
    target_role       VARCHAR(100) NOT NULL,
    title             VARCHAR(255),
    difficulty_level  VARCHAR(20) DEFAULT 'INTERMEDIATE',
    status            VARCHAR(20) DEFAULT 'ACTIVE',
    estimated_weeks   INT DEFAULT 12,
    description       TEXT,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 6. Roadmap Milestones Table
-- ============================================
CREATE TABLE IF NOT EXISTS roadmap_milestones (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    roadmap_id   BIGINT NOT NULL,
    week_number  INT NOT NULL,
    title        VARCHAR(200) NOT NULL,
    description  TEXT,
    resources    TEXT,
    sort_order   INT DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (roadmap_id) REFERENCES roadmaps(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 7. Chat Sessions Table
-- ============================================
CREATE TABLE IF NOT EXISTS chat_sessions (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT NOT NULL,
    title       VARCHAR(255) NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 8. Chat Messages Table
-- ============================================
CREATE TABLE IF NOT EXISTS chat_messages (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    session_id      BIGINT,
    role            VARCHAR(20) NOT NULL COMMENT 'USER, ASSISTANT, or MENTOR',
    content         TEXT NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 9. OTP Verifications Table
-- ============================================
CREATE TABLE IF NOT EXISTS otp_verifications (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    email           VARCHAR(150) NOT NULL,
    otp             VARCHAR(10) NOT NULL,
    failed_attempts INT NOT NULL DEFAULT 0,
    expires_at      TIMESTAMP NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_otp_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 10. Auth Audit Logs Table
-- ============================================
CREATE TABLE IF NOT EXISTS auth_audit_logs (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_email  VARCHAR(150) NOT NULL,
    action      VARCHAR(100) NOT NULL,
    ip_address  VARCHAR(50),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_email (user_email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 11. User Feedback Table
-- ============================================
CREATE TABLE IF NOT EXISTS user_feedback (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    rating          INT NOT NULL,
    comments        TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
