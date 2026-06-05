# FutureForge AI — Backend

> AI-Powered Career Development Platform

## Tech Stack

- **Java 17** + **Spring Boot 3.3.x**
- **MySQL 8** with Spring Data JPA
- **Spring Security** + JWT Authentication
- **Groq API** (LLaMA 3.3 70B) for AI features
- **Swagger/OpenAPI** for API documentation

## Prerequisites

- Java 17+
- MySQL 8.x running on `localhost:3306`
- Groq API key ([Get one here](https://console.groq.com))

## Quick Start

### 1. Clone & Navigate
```bash
cd futureforge-ai
```

### 2. Configure Environment
Set your Groq API key:
```bash
export GROQ_API_KEY=your_groq_api_key_here
```

### 3. Create MySQL Database
```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS futureforge_db;"
```
> Tables are auto-created by Hibernate (`ddl-auto: update`)

### 4. Run the Application
```bash
./mvnw spring-boot:run
```

The server starts at `http://localhost:8080`

### 5. Access Swagger UI
Open `http://localhost:8080/swagger-ui.html` in your browser.

## API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| POST | `/api/auth/refresh` | Refresh JWT token |
| GET | `/api/auth/me` | Get current user info |

### Profile (`/api/profile`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile` | Get profile |
| PUT | `/api/profile` | Update profile (semester, skills, interests) |

### Domain Recommendation (`/api/domains`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/domains/recommend` | Generate domain suggestions |
| GET | `/api/domains/latest` | Get latest recommendations |

### Career Analysis (`/api/career`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/career/analyze` | Run AI career analysis |
| GET | `/api/career/latest` | Get latest analysis |

### Roadmaps (`/api/roadmaps`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/roadmaps/generate` | Generate AI roadmap |
| GET | `/api/roadmaps/latest` | Get current active roadmap |
| PATCH | `/api/roadmaps/milestones/{mid}/complete` | Toggle milestone status |

### AI Chat (`/api/chat`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat/send` | Send message to AI mentor |
| GET | `/api/chat/history` | Get recent chat history |
| DELETE | `/api/chat/clear` | Clear chat history |

## Project Structure

```
src/main/java/com/futureforge/ai/
├── config/          # Security, CORS, Groq config
├── controller/      # REST controllers
├── dto/             # Request/Response DTOs
├── entity/          # JPA entities + enums
├── exception/       # Custom exceptions + handler
├── repository/      # Spring Data JPA repositories
└── service/         # Business logic + AI integration
```

## License

MIT
