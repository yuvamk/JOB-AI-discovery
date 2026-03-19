# JOB-AI-discovery

[![Deep Discovery](https://img.shields.io/badge/AI-Gemini%201.5%20Pro-blueviolet)](https://deepmind.google/technologies/gemini/)
[![Framework](https://img.shields.io/badge/Framework-Next.js%2014-black)](https://nextjs.org/)
[![Database](https://img.shields.io/badge/DB-MongoDB%20%2B%20Prisma-green)](https://www.mongodb.com/)

> **A FULL-FLEDGED, AI-POWERED JOB DISCOVERY PLATFORM** 
> Features multi-tenant architecture, AI Career Coach, 6-Template AI Resume Builder, automated job scraping pipelines, TanStack/Recharts Admin Dashboard, and JSON-LD SEO.

---

---

## 🚀 Elite Features

### 1. 🧠 Autonomous Strategic Orchestrator
Unlike traditional search tools, this agent uses a **Multi-Wave Strategic Brain** to plan its discovery process.
- **Wave-based Planning**: The AI plans up to 100 waves of search, adjusting keywords and platforms based on previous results.
- **Creative Directions**: It explores synonyms and related roles (e.g., "Vibe Coder", "AI Architect") to find hidden gems.
- **Self-Correction**: If a wave yields no results, the AI pivots its strategy automatically.

### 2. 🌍 Global Deep Career Scraper
Go beyond overcrowded job boards. Our **Deep Discovery Engine** finds jobs where they are born:
- **Domain Discovery**: Automatically identifies company websites matching your niche.
- **Career Page Detection**: Intelligently finds "Join Us" or "Careers" links on any domain.
- **Agentic Extraction**: Uses AI to "read" the career page HTML and extract listings, regardless of the site's layout or language.

### 3. 🧠 Instinct System (Personalized Learning)
The agent grows smarter with every interaction.
- **Historical Analysis**: Every time you save or delete a job, the agent records an **Instinct**.
- **Refined Matching**: These instincts are fed back into the AI's matching logic to ensure your recommendations evolve toward your perfect fit.

### 4. 🛡️ Automated Quality Guardrails
Never see a "junk" job again.
- **The Job Auditor**: Every listing undergoes an automated audit for broken links, thin descriptions, and suspicious content before it enters your dashboard.

---

## 🛠️ How it was Made (Tech & Architecture)

### Core Technologies
- **Frontend**: Next.js 15 (App Router) with a premium, glassmorphic UI.
- **AI Brain**: Google **Gemini 2.5 Flash** for high-speed, high-reasoning strategic planning and job matching.
- **Scraping**: A hybrid engine combining **Puppeteer** (for deep web scraping) and 10+ REST/RSS APIs (Remotive, RemoteOK, etc.).
- **Backend**: Next.js Server Actions and API Routes with SSE (Server-Sent Events) for real-time progress streaming.
- **Database**: **MongoDB** for persistent storage of jobs, resume profiles, and learned instincts.

### The Agentic Workflow
1. **Plan**: AI analyzes your profile and generates a multi-task search strategy.
2. **Execute**: The Orchestrator runs scraper tasks in parallel across Google Search and job boards.
3. **Deep Scrape**: Puppeteer navigates found company websites to extract direct listings.
4. **Audit**: The Auditor filters out low-quality results.
5. **Match**: The Matcher scores results based on your Resume + Learned Instincts.
6. **Learn**: Your feedback updates the Instinct Store, closing the loop.

---

## 🚦 Getting Started

### Prerequisites
- **Node.js**: 18.0.0 or higher
- **MongoDB**: A running MongoDB instance (Atlas recommended)
- **Google AI Studio**: API Key for Gemini 1.5/2.0
- **Gmail Account**: For sending OTPs (requires App Password)
- **Google Cloud Console**: For Google Login (OAuth 2.0)

### 1. Environment Configuration
Create a `.env` file in the root directory and add the following variables:

```env
# MongoDB Connection
MONGODB_URI="mongodb+srv://..."
DATABASE_URL="mongodb+srv://..."

# AI Engine (Google Gemini)
GEMINI_API_KEY="your-gemini-api-key"

# Authentication (NextAuth)
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="your-32-character-secret"

# OTP Email (Gmail)
GMAIL_USER="your-email@gmail.com"
GMAIL_APP_PASSWORD="your-app-password"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

#### 🛡️ How to get Gmail App Password:
1. Go to your Google Account settings.
2. Enable **2-Step Verification**.
3. Search for **App Passwords**.
4. Create a new app password (select 'Other' and name it 'Kinetic').
5. Copy the 16-character code into `GMAIL_APP_PASSWORD`.

#### 🔑 How to get Google OAuth Credentials:
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project and set up the **OAuth Consent Screen**.
3. Create **Credentials** -> **OAuth Client ID** (Web Application).
4. Add `http://localhost:3001` to **Authorized JavaScript origins**.
5. Add `http://localhost:3001/api/auth/callback/google` to **Authorized redirect URIs**.

### 2. Installation & Database Sync
```bash
# Install dependencies
npm install --legacy-peer-deps

# Push schema to MongoDB and Generate Prisma Client
npx prisma db push
npx prisma generate
```

### 3. Run Development Server
```bash
npm run dev -p 3001
```

---

## 🏗️ Project Architecture
- **Next.js (App Router)**: Framework for both frontend and backend.
- **Prisma**: ORM for MongoDB interaction.
- **Next-Auth**: Complete authentication solution (Google, Email OTP).
- **Framer Motion**: For fluid, premium animations and glassmorphic UI.
- **Nodemailer**: Secure transactional email delivery for OTPs.
- **Google Gemini**: Strategic reasoning and job-matching engine.

---

## 🔮 Futuristic Approach
This project isn't just a tool; it's a **Living Agent**. 
- **Infinite Search**: Capable of paginating through thousands of results across the open web.
- **Zero-knowledge Extraction**: Can extract data from websites it has never encountered before using LLM reasoning.
- **Personalized Evolution**: The more you use it, the more it becomes an extension of your professional identity.

---
*Created with ❤️ by Yuvam Kumar and the Kinetic Team.*
