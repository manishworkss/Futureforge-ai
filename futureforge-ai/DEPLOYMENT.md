# FutureForge AI - Deployment Guide

This guide covers everything you need to deploy FutureForge AI as a production-ready SaaS.

## Architecture
- **Frontend:** React + Vite deployed to **Vercel**
- **Backend:** Spring Boot (Java 25) deployed to **Render** or **Railway**
- **Database:** Managed MySQL (e.g. Render, PlanetScale, Railway)

---

## 1. Database Setup (Render / Railway)
1. Create a new MySQL instance.
2. Note the connection URI, Username, and Password.

## 2. Backend Deployment (Render / Railway)

1. Connect your GitHub repository to Render/Railway.
2. Select the `futureforge-ai` folder as the root directory.
3. **Build Command:** `./mvnw clean package -DskipTests`
4. **Start Command:** `java -jar target/futureforge-ai-1.0.0.jar --spring.profiles.active=prod`

### Required Environment Variables

You MUST configure the following environment variables in your deployment dashboard:

| Variable | Description | Example |
|---|---|---|
| `SPRING_DATASOURCE_URL` | JDBC URL for MySQL | `jdbc:mysql://host:3306/db_name` |
| `SPRING_DATASOURCE_USERNAME` | MySQL user | `root` |
| `SPRING_DATASOURCE_PASSWORD` | MySQL password | `secret123` |
| `JWT_SECRET` | Secret key for generating JWTs | `a-very-long-base64-encoded-secret` |
| `GROQ_API_KEY` | Groq / Llama3 API Key | `gsk_...` |
| `GOOGLE_CLIENT_ID` | Google OAuth2 ID | `...apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth2 Secret | `GOCSPX-...` |
| `MAIL_USERNAME` | SMTP Email (Gmail) | `your.email@gmail.com` |
| `MAIL_PASSWORD` | App Password for Gmail | `abcd efgh ijkl mnop` |

---

## 3. Frontend Deployment (Vercel)

1. Connect your GitHub repository to Vercel.
2. Select the `futureforge-ui` folder as the Root Directory.
3. Framework Preset: **Vite**
4. **Build Command:** `npm run build`
5. **Output Directory:** `dist`

### Required Environment Variables

| Variable | Description | Example |
|---|---|---|
| `VITE_API_BASE_URL` | Production Backend URL | `https://futureforge-api.onrender.com` |

> **Note:** Ensure you update the `axios` instance in `src/lib/api.ts` to use `import.meta.env.VITE_API_BASE_URL` instead of `http://localhost:8080`.

---

## Production Checklist
- [ ] Database is accessible from the internet.
- [ ] Backend is running with `prod` profile and returns `200 OK` on health endpoints.
- [ ] Frontend can communicate with Backend (CORS is properly configured).
- [ ] Google OAuth redirect URI is updated in Google Cloud Console to point to the production backend URL (`https://.../login/oauth2/code/google`).
