<div align="center">
  
  # 🚀 FutureForge AI

  <!-- Animated Typing SVG -->
  <a href="https://github.com/manishworkss/Futureforge-ai">
    <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=28&pause=1000&color=4F46E5&center=true&vCenter=true&width=800&lines=Your+Personal+AI+Career+Mentor;Discover+Your+Perfect+Tech+Domain;Generate+Actionable+Learning+Roadmaps;Ace+Your+Next+Tech+Interview" alt="Typing SVG" />
  </a>

  <p align="center">
    <strong>An intelligent SaaS platform that transforms student profiles into personalized career trajectories.</strong>
  </p>

  <!-- Badges -->
  <p align="center">
    <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot" />
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
    <img src="https://img.shields.io/badge/Llama_3-0467DF?style=for-the-badge&logo=meta&logoColor=white" alt="Llama 3" />
  </p>
</div>

---

## ✨ Key Features

<table align="center">
  <tr>
    <td align="center" width="33%">
      <img src="https://cdn-icons-png.flaticon.com/512/8633/8633190.png" width="50" alt="Domain Match"/><br/>
      <b>AI Domain Matching</b><br/>Analyzes your skills and semester to recommend the exact tech domains (e.g., Cloud, AI, Full Stack) where you'll thrive.
    </td>
    <td align="center" width="33%">
      <img src="https://cdn-icons-png.flaticon.com/512/10061/10061730.png" width="50" alt="Roadmaps"/><br/>
      <b>Dynamic Roadmaps</b><br/>Generates step-by-step, actionable learning roadmaps tailored to your exact proficiency level and goals.
    </td>
    <td align="center" width="33%">
      <img src="https://cdn-icons-png.flaticon.com/512/4712/4712139.png" width="50" alt="AI Mentor"/><br/>
      <b>24/7 AI Mentor Chat</b><br/>Stuck on a bug? Ask your personal Llama-3 powered AI mentor context-aware technical questions anytime.
    </td>
  </tr>
</table>

## 🛠 Tech Stack

### Frontend (User Interface)
- **Framework:** React + Vite (TypeScript)
- **Styling:** Tailwind CSS 3.4 & Framer Motion (for buttery smooth UI animations)
- **Components:** Shadcn UI
- **Routing:** React Router v6

### Backend (Core Engine)
- **Framework:** Spring Boot 3.3 (Java 17)
- **Database:** MySQL with Hibernate/JPA
- **Security:** Spring Security, JWT Authentication, Google OAuth2
- **AI Integration:** Groq Cloud API (Llama 3 70B model)
- **Document Gen:** iText PDF Core

---

## ⚡ Quick Start

### Prerequisites
Make sure you have **Java 17**, **Node.js 20+**, and **MySQL** installed on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/manishworkss/Futureforge-ai.git
cd Futureforge-ai
```

### 2. Backend Setup
1. Create a MySQL database named `futureforge_db`.
2. Configure your environment variables in `.env` or `application-local.yml` (e.g., `GROQ_API_KEY`, `GOOGLE_CLIENT_ID`).
3. Run the Spring Boot application:
```bash
cd futureforge-ai
./mvnw spring-boot:run
```

### 3. Frontend Setup
1. Open a new terminal and navigate to the UI folder.
2. Install dependencies and start the Vite dev server:
```bash
cd futureforge-ui
npm install
npm run dev
```
3. Open `http://localhost:3000` in your browser!

---

## 🔒 Security & Architecture

FutureForge uses an advanced architecture to keep user data secure:
- **Stateless Authentication:** Industry-standard JWT tokens stored securely in HttpOnly cookies to prevent XSS attacks.
- **Role-Based Access Control:** Strict endpoint protection ensuring users can only access their own personalized AI roadmaps.
- **Rate Limiting:** Protects the Groq AI layer from being overwhelmed by too many rapid requests.

---

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=4F46E5&height=150&section=footer" width="100%"/>
  <p>Built with ❤️ by Manish Kumar</p>
</div>
