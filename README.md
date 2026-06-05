<div align="center">
  <h1>FutureForge AI</h1>
  <p><strong>Intelligent SaaS Platform for Personalized Career Trajectories</strong></p>
  
  <p>
    <a href="#"><img src="https://img.shields.io/badge/Spring%20Boot-3.3-brightgreen.svg?style=flat-square&logo=spring-boot" alt="Spring Boot"></a>
    <a href="#"><img src="https://img.shields.io/badge/React-18-blue.svg?style=flat-square&logo=react" alt="React"></a>
    <a href="#"><img src="https://img.shields.io/badge/MySQL-8.0-blue.svg?style=flat-square&logo=mysql" alt="MySQL"></a>
    <a href="#"><img src="https://img.shields.io/badge/AI-Llama_3_70B-orange.svg?style=flat-square&logo=meta" alt="Llama 3"></a>
  </p>
</div>

## Overview
FutureForge AI is an enterprise-grade application designed to analyze academic profiles and provide data-driven career guidance. By leveraging Large Language Models (LLMs), the platform evaluates user skill sets to generate optimal technical domains, comprehensive learning roadmaps, and continuous AI-driven mentorship.

## Architecture & Tech Stack

### Client Architecture
* **Framework:** React 18 with TypeScript and Vite
* **UI Engineering:** Tailwind CSS 3.4, Shadcn UI components
* **State Management & Routing:** React Router v6

### Core Services
* **Application Server:** Spring Boot 3.3 (Java 17)
* **Data Persistence:** MySQL 8.0, Hibernate ORM / Spring Data JPA
* **Authentication:** Stateless JWT Implementation, Spring Security, OAuth2 (Google)
* **AI Orchestration:** Groq Cloud API integration for ultra-low latency inference (Llama-3 70B)
* **Document Processing:** iText PDF Core for dynamic roadmap report generation

## Core Capabilities
1. **Algorithmic Domain Matching:** Analyzes academic background, current skill set, and semester progression to recommend optimal technology sectors.
2. **Dynamic Roadmap Generation:** Synthesizes structured, milestone-based learning paths customized to the user's target proficiency.
3. **Conversational AI Mentor:** Context-aware, continuous technical support powered by a system-prompted LLM.
4. **Automated Document Export:** Generates standardized, downloadable PDF reports of the user's career trajectory and milestones.

## Deployment Instructions

### Prerequisites
* Java 17 JDK
* Node.js 20+
* MySQL Server
* Groq API Key
* Google Cloud Console OAuth Credentials

### Environment Configuration
1. Initialize a MySQL database named `futureforge_db`.
2. Configure the application properties by providing the necessary environment variables (`GROQ_API_KEY`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `JWT_SECRET`).

### Service Initialization

#### Backend Service
```bash
cd futureforge-ai
./mvnw clean package -DskipTests
./mvnw spring-boot:run
```

#### Client Application
```bash
cd futureforge-ui
npm install
npm run dev
```

The application client will securely proxy API requests to the backend service. Access the interface at `http://localhost:3000`.

## Security Implementations
* **Cryptographic Security:** Robust token validation with secure cryptographic signing for API access.
* **XSS Mitigation:** Adherence to strict cross-site scripting prevention strategies.
* **API Protection:** Engineered to handle concurrent database transactions and mitigate excessive API consumption.

---
*Maintained by Manish Kumar*
