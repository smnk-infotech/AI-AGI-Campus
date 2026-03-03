# AI + AGI Powered Educational Organization & Campus Control System

### **Vision: The Autonomous University of 2030**
This project represents a **paradigm shift** in educational management. It is not just a Learning Management System (LMS); it is an **Autonomous Campus Operating System**. By integrating **Artificial General Intelligence (AGI)** into the core of campus operations, we aim to create a self-optimizing educational environment where:
-   **Students** receive 24/7 personalized tutoring, learning kits, and wellbeing support from a real AI assistant.
-   **Faculty** are empowered by an AI research copilot, automated advising, and course management tools.
-   **Parents** get transparent visibility into their child's attendance, academics, and communication with faculty.
-   **Administrators** possess "God Mode" AGI oversight with real-time campus intelligence, predictive analytics, broadcast alerts, and the ability to simulate policy changes before implementation.

---

## 🏗️ System Architecture

The platform is built as a **multi-tenant, distributed application** with **6 frontend portals**, a **FastAPI backend**, and a **Gemini-powered AGI Brain**.

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React 18 + Vite)                   │
│                                                                     │
│  Homepage:5173  Student:5174  Faculty:5175  Parent:5176  Admin:5177  │
└─────────────────────┬───────────────────────────────────────────────┘
                      │  HTTP / JWT Auth
┌─────────────────────▼───────────────────────────────────────────────┐
│                   BACKEND (FastAPI + Uvicorn)  :8001                 │
│                                                                     │
│  8 Routers │ 33 API Endpoints │ OAuth2 JWT │ CORS │ Swagger /docs   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │              AGI Brain (ReAct Agent)                         │    │
│  │  Google Gemini 2.5 Flash │ 6 Tools │ RBAC │ Memory │ Logs   │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │              SQLite Database (campus.db)                     │    │
│  │  10 Tables │ SQLAlchemy ORM │ Relational Integrity           │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

### **Core Components**
1.  **Central Intelligence (Backend)**: A high-performance Python FastAPI server that manages the `campus.db` (SQLite) relational database, serves 33 REST API endpoints across 8 routers, and orchestrates AI agents.
2.  **Role-Specific Portals**: 5 distinct React applications tailored for Students, Faculty, Administrators, Parents, and a public Homepage — plus a static website home.
3.  **The AGI Brain**: A dedicated service layer powered by **Google Gemini 2.5 Flash** with a ReAct (Reason + Act) reasoning loop, 6 registered tools with role-based access control (RBAC), persistent memory, and complete decision logging.

---

## 🔑 API Key — What This Project Needs

This entire project runs on **one single API key**:

| Key | Provider | Model | How to Get It |
|-----|----------|-------|---------------|
| `GOOGLE_API_KEY` | Google AI (Gemini) | `gemini-2.5-flash` | Free at [Google AI Studio](https://aistudio.google.com/apikey) |

**One key powers everything** — student AI chat, faculty research copilot, admin AGI controller, learning kit generation, campus intelligence, broadcast alerts, and all tool-based ReAct reasoning.

**Setup**: Create a file at `backend/api/.env`:
```env
GOOGLE_API_KEY=your_google_gemini_api_key_here
```

> No OpenAI key, no Azure key, no separate database credentials. The backend loads this key at startup via `python-dotenv` and configures both the direct chat endpoints and the AGI Brain automatically. If the key is missing, the system falls back to **Simulation Mode** so nothing crashes.

---

## 🚀 Key Features by Portal

### 🎓 Student Portal (`student_app` — Port 5174)
*Empowering learners with real AI intelligence.*

| Route | Page | Description |
|-------|------|-------------|
| `/` | Dashboard | GPA, attendance %, credits, schedule, system alerts |
| `/courses` | Courses | Enrolled courses with real-time data from backend |
| `/assignments` | Assignments | View upcoming work, track deadlines, submission flows |
| `/schedule` | Schedule | Dynamic weekly schedule from active enrollments |
| `/attendance` | Attendance | Face-recognition attendance with history |
| `/assistant` | AI Assistant | Full-featured ChatGPT-style AI with Learning Kits |
| `/wellbeing` | Wellbeing | Support Circle and Daily Inspiration |

**Key Features:**
-   **AI Study Assistant (ChatGPT UI)**: Persistent dark-themed chat interface with conversation history (localStorage), markdown rendering, copy/feedback buttons. Connects to real Gemini API.
-   **Learning Kit Generator**: Ask the AI to teach any topic and get flashcards, quiz questions, visual aids, and curated resources — all AI-generated.
-   **Face Verification Attendance**: Webcam-based face recognition with backend attendance tracking.
-   **Real-Time Schedule**: Fetches time slots from actual course enrollments in the database.

### 👩‍🏫 Faculty Portal (`faculty_app` — Port 5175)
*Augmenting research and instruction.*

| Route | Page | Description |
|-------|------|-------------|
| `/` | Dashboard | Courses taught, students reached, assignments, KPIs |
| `/courses` | Courses | Create and manage courses |
| `/assignments` | Assignments | Create, view, delete assignments |
| `/schedule` | Schedule | Faculty teaching schedule |
| `/advising` | Advising | Real students enrolled in faculty's courses |
| `/research` | Research | AI Research Copilot for grant writing and literature reviews |

**Key Features:**
-   **Research Copilot**: AI agent for grant writing, literature reviews, experiment planning.
-   **Dynamic Advising**: Automatically fetches **real students** enrolled in the faculty's courses from the database.
-   **Course Command Center**: Create and manage courses with instant student access.

### 🏢 Admin Portal (`admin_app` — Port 5177)
*Total operational awareness — "God Mode".*

| Route | Page | Description |
|-------|------|-------------|
| `/dashboard` | Dashboard | Executive analytics with KPIs, alerts, revenue |
| `/students` | Students | Full student management CRUD |
| `/staff` | Staff | Faculty/staff management |
| `/operations` | Operations | Operational management |
| `/reports` | Reports | Analytics and reporting |
| `/agi` | AGI Controller | **Full AGI Organization Command Center** |

**Key Features:**
-   **AGI Organization Controller (6 Tabs)**:
    -   **Command Center**: Chat with the AGI Brain using admin-level tools. Ask *"How is attendance this week?"* or *"Simulate a fee increase"* and get data-backed answers with visible tool usage.
    -   **Org Overview**: Real-time campus-wide stats (students, faculty, courses, attendance rate, revenue, at-risk count, AGI activity).
    -   **Student Intel**: Per-student attendance, grades, enrollment, and risk-status analysis.
    -   **Faculty Intel**: Per-faculty workload (courses, students reached) analysis.
    -   **AGI Logs**: Full audit trail of every AGI decision (goal, analysis, decision, confidence, timestamp).
    -   **Broadcasts**: Send system-wide alerts to all users, view notification history.
-   **Pattern Detection**: Automatically flags at-risk students (attendance < 75%).
-   **Grade Management**: Direct grade updates for any student enrollment.

### 👨‍👩‍👦 Parent Portal (`parent_app` — Port 5176)
*Transparent visibility into student progress.*

| Route | Page | Description |
|-------|------|-------------|
| `/` | Dashboard | Child's overview and quick stats |
| `/attendance` | Attendance | View child's attendance history |
| `/academics` | Academics | Grades and course progress |
| `/communication` | Communication | Messages and alerts from faculty |
| `/finance` | Finance | Fee tracking and payment status |

### 🏠 Homepage (`homepage` — Port 5173)
*Public university gateway.*

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | University landing page |
| `/features` | Features | Platform feature showcase |
| `/about` | About | About the university |
| `/portal` | Login | Role-based login portal |

---

## 🧠 AGI Brain — Deep Dive

The AGI Brain (`backend/api/services/agi_engine.py`) implements a **ReAct (Reason + Act) agent** powered by Google Gemini 2.5 Flash.

### **Architecture**
```
User Goal → System Prompt + Tool Descriptions → Gemini LLM
    ↓
  THOUGHT (reasoning about what to do)
    ↓
  ACTION (calls a tool with arguments)  ←── or ──→  FINAL ANSWER
    ↓
  OBSERVATION (tool result)
    ↓
  2nd LLM Pass (incorporate observation)
    ↓
  FINAL ANSWER (returned to user)
    ↓
  All decisions logged to AGILogs table
```

### **6 Registered AGI Tools**

| Tool | Description | Uses DB | RBAC Roles |
|------|-------------|---------|------------|
| `get_student_info` | Fetch student profile, enrolled courses, and attendance records | Yes | student, faculty, admin |
| `check_attendance_stats` | Calculate campus-wide attendance rate from real data | Yes | admin, faculty |
| `simulate_event` | Predict the outcome of a policy change or campus event | No | admin |
| `remember_fact` | Store a user preference or fact to long-term AGI memory | Yes | Public |
| `recall_context` | Recall past facts by category from AGI memory | Yes | Public |
| `broadcast_alert` | Send a system-wide notification to all users | Yes | admin |

### **System Prompt**
The AGI Brain uses an advanced multi-agent debate prompt (`SMART_CAMPUS_BRAIN_PROMPT`) where internal agents (Student Agent, Faculty Agent, Admin Agent, Analytics Agent) debate before reaching a decision. The reasoning loop follows: **OBSERVE → ANALYZE → DEBATE → DECIDE → EXPLAIN → LOG → MONITOR**.

### **Lazy Model Initialization**
The Gemini model is initialized lazily via `_ensure_model()` — it only loads after `main.py` has loaded the `.env` file, ensuring the API key is always available.

---

## 📡 Complete API Reference (33 Endpoints)

### Root
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/` | Welcome message |
| `GET` | `/health` | Health check — `{"status": "ok"}` |

### Auth (`/api/auth`)
| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/auth/token` | OAuth2 login (checks Students → Faculty → Admins), returns JWT with role |
| `GET` | `/api/auth/me` | Get current authenticated user profile |

### AI (`/api/ai`) — *All powered by Gemini 2.5 Flash*
| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/ai/chat` | Simple single-turn chat |
| `POST` | `/api/ai/messages` | Multi-turn conversation via AGI Brain |
| `POST` | `/api/ai/agi` | Goal-oriented AGI reasoning (ReAct with tool use) |
| `POST` | `/api/ai/teach` | Generate Learning Kit (flashcards, quiz, visuals, resources) |

### Admin (`/api/admin`)
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/admin/dashboard` | Full admin dashboard (stats, events, alerts) |
| `POST` | `/api/admin/grades` | Update a student's grade |
| `GET` | `/api/admin/alerts` | System alerts (low-attendance risk students) |
| `GET` | `/api/admin/agi/status` | Real-time campus intelligence snapshot |
| `GET` | `/api/admin/agi/logs` | AGI decision audit trail |
| `GET` | `/api/admin/agi/notifications` | All broadcast notifications |
| `POST` | `/api/admin/agi/broadcast` | Send system-wide alert |
| `POST` | `/api/admin/agi/command` | Execute a goal through AGI Brain (admin tools) |
| `GET` | `/api/admin/agi/students-overview` | Per-student analysis (attendance, grades, risk) |
| `GET` | `/api/admin/agi/faculty-overview` | Per-faculty workload analysis |

### Courses (`/api/courses`)
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/courses/` | List all courses |
| `POST` | `/api/courses/` | Create a course |
| `POST` | `/api/courses/{course_id}/enroll` | Enroll student in course |
| `GET` | `/api/courses/my/{student_id}` | Get student's enrolled courses |

### Students (`/api/students`)
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/students/{student_id}/dashboard` | Full student dashboard |
| `GET` | `/api/students/` | List all students |
| `POST` | `/api/students/` | Create student |
| `GET` | `/api/students/{student_id}` | Get student by ID |
| `PUT` | `/api/students/{student_id}` | Update student |
| `DELETE` | `/api/students/{student_id}` | Delete student |

### Faculty (`/api/faculty`)
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/faculty/{faculty_id}/dashboard` | Faculty dashboard |
| `GET` | `/api/faculty/{faculty_id}/advisees` | Students in faculty's courses |
| `GET` | `/api/faculty/` | List all faculty |
| `POST` | `/api/faculty/` | Create faculty |
| `GET` | `/api/faculty/{faculty_id}` | Get faculty by ID |
| `PUT` | `/api/faculty/{faculty_id}` | Update faculty |
| `DELETE` | `/api/faculty/{faculty_id}` | Delete faculty |

### Assignments (`/api/assignments`)
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/assignments/` | List all assignments |
| `POST` | `/api/assignments/` | Create assignment |
| `DELETE` | `/api/assignments/{assignment_id}` | Delete assignment |

### Attendance (`/api/attendance`)
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/attendance/` | List all attendance records |
| `POST` | `/api/attendance/` | Mark attendance (one per student per day) |
| `GET` | `/api/attendance/student/{student_id}` | Student attendance history |

---

## 🗄️ Database Schema (10 Tables)

Database: **SQLite** (`campus.db`) via **SQLAlchemy ORM**

| Table | Model | Key Columns |
|-------|-------|-------------|
| `students` | `StudentDB` | id, first_name, last_name, email, major, year, hashed_password |
| `faculty` | `FacultyDB` | id, first_name, last_name, email, department, hashed_password |
| `admins` | `AdminDB` | id, first_name, last_name, email, hashed_password |
| `courses` | `CourseDB` | id, name, code, description, faculty_id, schedule, credits, location, fee |
| `enrollments` | `EnrollmentDB` | id, student_id, course_id, enrollment_date, grade |
| `attendance` | `AttendanceDB` | id, student_id, date, status (Present/Absent/Late), method (Manual/FaceRec) |
| `assignments` | `AssignmentDB` | id, title, course_id, due_date, description, total_points |
| `agi_memory` | `AGIMemory` | id, user_id, role, context_type (conversation/preference/fact), content, timestamp |
| `agi_logs` | `AGILogs` | id, timestamp, goal, context_summary, analysis, decision, explanation, confidence, module |
| `notifications` | `NotificationDB` | id, sender_role, message, target_role, timestamp |

---

## 🛠️ Technology Stack

### **Frontend**
| Technology | Purpose |
|------------|---------|
| React 18 | UI framework (functional components, hooks) |
| Vite | Build tool (HMR, lightning-fast dev server) |
| React Router v6 | Client-side routing with role-based access |
| ReactMarkdown + remark-gfm | AI response rendering with GitHub-flavored markdown |
| Lucide React | Icon library |
| Custom CSS Variables | Design system with light theme, glassmorphism |
| localStorage | Auth token persistence, conversation history |

### **Backend**
| Technology | Purpose |
|------------|---------|
| FastAPI | High-performance async REST API with auto-docs |
| Uvicorn | ASGI server |
| SQLAlchemy | ORM with declarative models and relationships |
| SQLite | File-based relational database (`campus.db`) |
| Pydantic | Request/response validation and serialization |
| python-jose | JWT token generation and verification (HS256) |
| passlib | Password hashing (PBKDF2-SHA256) |
| python-dotenv | Environment variable loading from `.env` |
| python-multipart | OAuth2 form data parsing |

### **AI / AGI Layer**
| Technology | Purpose |
|------------|---------|
| google-generativeai SDK | Gemini 2.5 Flash model access |
| ReAct Agent Pattern | Thought → Tool → Observation → Answer reasoning loop |
| Tool Registry + RBAC | 6 tools with role-based access control |
| AGIMemory + AGILogs | Persistent context memory and full decision audit trail |
| Multi-Agent Debate Prompt | Internal debate between Student/Faculty/Admin/Analytics agents |

---

## ⚡ Getting Started (Local Development)

### Prerequisites
-   **Node.js** v18+ (for frontend apps)
-   **Python** v3.10+ (for backend)
-   **Google API Key** (free from [AI Studio](https://aistudio.google.com/apikey))

### 1. Backend Setup
```powershell
# Navigate to backend API directory
cd backend/api

# Create and activate virtual environment
python -m venv .venv
.venv\Scripts\activate

# Install all Python dependencies
pip install -r requirements.txt

# Create your .env file with your API key
echo GOOGLE_API_KEY=your_key_here > .env

# Seed the database with demo data
cd ../..
python -m backend.api.seed_db

# Start the backend server on port 8001
python -m uvicorn backend.api.main:app --host 127.0.0.1 --port 8001
```

> **Note**: Do NOT use `--reload` flag if you have `.venv` inside the project directory — WatchFiles will detect `site-packages` changes and crash in a loop. Run without `--reload` for stability.

### 2. Frontend Setup
Open 4 separate terminals and launch each portal:

**Homepage** (Port 5173):
```powershell
cd frontend/homepage
npm install
npm run dev
```

**Student App** (Port 5174):
```powershell
cd frontend/student_app
npm install
npm run dev
```

**Faculty App** (Port 5175):
```powershell
cd frontend/faculty_app
npm install
npm run dev
```

**Admin App** (Port 5177):
```powershell
cd frontend/admin_app
npm install
npm run dev
```

### 3. Quick Start (One Command)
```powershell
.\start_campus.bat
```
This launches the backend and all frontend portals automatically.

### **Test Credentials**
| Role | Email | Password | Portal |
|------|-------|----------|--------|
| Admin | `admin@campus.edu` | `admin123` | `http://localhost:5177` |
| Faculty | `dr.gupta@faculty.edu` | `password123` | `http://localhost:5175` |
| Student | `aarav.kumar@student.edu` | `password123` | `http://localhost:5174` |
| Student | `priya@student.edu` | `password123` | `http://localhost:5174` |
| Faculty | `prof.dave@faculty.edu` | `password123` | `http://localhost:5175` |

### **Seeded Demo Data**
| Entity | Details |
|--------|---------|
| **Faculty** | Dr. Gupta (CS Dept, `fac-001`) · Prof. Dave (Robotics Dept, `fac-002`) |
| **Students** | Aarav Kumar (Robotics, Year 8) · Priya Singh (CS, Year 8) |
| **Admin** | Campus Admin (`adm-001`) |
| **Courses** | AI 101 (3 credits, $750) · Robotics 101 (4 credits, $900) · Ethics 200 (2 credits, $400) |
| **Enrollments** | Aarav → AI101 (4.0), ROB101 (3.5) · Priya → AI101 (3.0), ETH200 (4.0) |
| **Assignments** | "Neural Net Essay" (due +2 days) · "Build Servo Arm" (due +5 days) |
| **Attendance** | Aarav: 5 recent days (random Present/Late via FaceRec) |

---

## 📂 Project Structure
```text
AI-AGI-Campus/
│
├── backend/
│   └── api/
│       ├── .env                  # API key configuration (GOOGLE_API_KEY)
│       ├── main.py               # FastAPI app entry point, CORS, router registration
│       ├── database.py           # SQLAlchemy engine, SessionLocal, Base
│       ├── models_db.py          # All 10 database models (SQLAlchemy)
│       ├── auth.py               # JWT utilities, password hashing, token verification
│       ├── prompts.py            # AGI system prompt (multi-agent debate)
│       ├── requirements.txt      # Python dependencies
│       ├── seed_db.py            # Database seeder (faculty, students, courses, etc.)
│       ├── routers/
│       │   ├── auth.py           # POST /api/auth/token, GET /api/auth/me
│       │   ├── ai.py             # POST /api/ai/chat, messages, agi, teach
│       │   ├── admin.py          # GET/POST /api/admin/* (dashboard, AGI controller)
│       │   ├── courses.py        # CRUD /api/courses/*
│       │   ├── students.py       # CRUD /api/students/*
│       │   ├── faculty.py        # CRUD /api/faculty/*
│       │   ├── assignments.py    # CRUD /api/assignments/*
│       │   └── attendance.py     # /api/attendance/* (mark, history)
│       └── services/
│           └── agi_engine.py     # AGI Brain: ReAct agent, tools, RBAC, memory
│
├── frontend/
│   ├── homepage/                 # Public landing page (Port 5173)
│   │   └── src/
│   │       ├── App.jsx           # Routes: /, /features, /about, /portal
│   │       └── pages/            # Home, Features, About
│   │
│   ├── student_app/              # Student portal (Port 5174)
│   │   └── src/
│   │       ├── App.jsx           # Routes: /, /courses, /assignments, /schedule, /attendance, /assistant, /wellbeing
│   │       ├── chatgpt.css       # Dark-themed ChatGPT-style AI assistant styles
│   │       └── pages/            # Dashboard, Courses, Assignments, Schedule, Attendance, AIAssistant, Wellbeing
│   │
│   ├── faculty_app/              # Faculty portal (Port 5175)
│   │   └── src/
│   │       ├── App.jsx           # Routes: /, /courses, /assignments, /schedule, /advising, /research
│   │       └── pages/            # Dashboard, Courses, Assignments, Schedule, Advising, Research
│   │
│   ├── parent_app/               # Parent portal (Port 5176)
│   │   └── src/
│   │       ├── App.jsx           # Routes: /, /attendance, /academics, /communication, /finance
│   │       └── pages/            # Dashboard, Attendance, Academics, Communication, Finance
│   │
│   ├── admin_app/                # Admin portal (Port 5177)
│   │   └── src/
│   │       ├── App.jsx           # Routes: /dashboard, /students, /staff, /operations, /reports, /agi
│   │       └── pages/            # Dashboard, Students, Staff, Operations, Reports, AGIController
│   │
│   └── website_home/             # Static website (optional)
│
├── docs/
│   ├── project_overview.md       # Architecture overview
│   ├── modules.md                # Module documentation
│   ├── tech_stack.md             # Technology details
│   └── PROJECT_STATUS.md         # Current status tracking
│
├── campus.db                     # SQLite database (auto-created on startup)
├── start_campus.bat              # One-command full system launcher
├── health_check.ps1              # PowerShell system health monitor
├── CAMPUS_DESIGN_SYSTEM.css      # Shared CSS design system variables
├── CONTRIBUTING.md               # Contribution guidelines
├── CODE_OF_CONDUCT.md            # Community standards
├── SECURITY.md                   # Security policy
├── LICENSE                       # Project license
└── README.md                     # This documentation
```

---

## 🔍 System Monitoring & Health Checks

### **Health Endpoints**
| Endpoint | URL | Expected Response |
|----------|-----|-------------------|
| API Health | `GET http://localhost:8001/health` | `{"status": "ok"}` |
| API Docs | `GET http://localhost:8001/docs` | Interactive Swagger UI |
| Homepage | `GET http://localhost:5173` | 200 OK |
| Student App | `GET http://localhost:5174` | 200 OK |
| Faculty App | `GET http://localhost:5175` | 200 OK |
| Admin App | `GET http://localhost:5177` | 200 OK |

### **Health Check Script**
```powershell
# Run the automated health check
.\health_check.ps1
```

Expected output when all systems are running:
```
=== AI-AGI Campus System Health Monitor ===

1. Frontend Applications:
   Checking homepage on port 5173...       OK (200)
   Checking student_app on port 5174...    OK (200)
   Checking faculty_app on port 5175...    OK (200)
   Checking admin_app on port 5177...      OK (200)

2. Backend API:
   Checking Health Endpoint (port 8001)... OK (200)
   Checking Auth Endpoint...               OK (200)

=== ALL SYSTEMS OPERATIONAL ===
```

---

## ✅ Project Status (March 3, 2026)

This project is **FULLY OPERATIONAL** with live Gemini AI integration across all portals.

### **System Health: 🟢 ALL SYSTEMS OPERATIONAL**
-   [x] **Full-Stack Integration**: 5 React frontends ↔ FastAPI backend ↔ SQLite database with real-time data
-   [x] **Live AI (Gemini 2.5 Flash)**: All 4 AI endpoints verified working with real Gemini responses
-   [x] **AGI Brain (ReAct Agent)**: Goal-oriented reasoning with tool execution, RBAC, memory, and decision logging
-   [x] **AGI Organization Controller**: Admin "God Mode" with 6-tab command center (10 admin endpoints)
-   [x] **Learning Kit Generator**: AI creates flashcards, quizzes, visual aids, and resources on any topic
-   [x] **Multi-Portal Architecture**: 5 React apps (Homepage, Student, Faculty, Parent, Admin)
-   [x] **Authentication & Security**: JWT (HS256) with OAuth2, PBKDF2 password hashing, role-based access
-   [x] **Database**: 10 tables with SQLAlchemy ORM, relational integrity, seeded demo data
-   [x] **API Documentation**: Swagger UI at `/docs` with all 33 endpoints documented
-   [x] **CORS**: Configured for all 5 frontend origins
-   [x] **Health Monitoring**: PowerShell health check script for all services

### **Latest Enhancements (March 2026)**
-   **AGI Organization Controller**: Full admin command center with real-time campus intelligence, AGI chat with tool execution, student/faculty analytics, broadcast alerts, and AGI decision logs
-   **AI Integration Complete**: All 4 AI endpoints (`/api/ai/chat`, `/messages`, `/agi`, `/teach`) verified with real Gemini responses and tool usage
-   **Lazy AGI Initialization**: Gemini model loads after `.env` is parsed, ensuring API key availability
-   **Dark Theme AI Chat**: ChatGPT-style interface with preserved dark theme and markdown rendering
-   **Campus Intelligence**: Real-time stats — attendance rates, revenue, at-risk detection, AGI activity tracking

---

## 🚀 Deployment & Production

### **Environment Variables**
Create `backend/api/.env`:
```env
# Required — powers all AI features
GOOGLE_API_KEY=your_google_gemini_api_key

# Optional — defaults are used if not set
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=300
```

### **Production Checklist**
- [x] All frontend applications tested and responding (200 OK)
- [x] Backend API functional with health checks
- [x] Database populated with demo data
- [x] Authentication system verified with all 3 roles
- [x] All 4 AI endpoints verified with real Gemini responses
- [x] AGI Brain tool execution confirmed (ReAct loop working)
- [x] CORS configured for all frontend origins
- [x] Swagger documentation accessible at `/docs`

### **Production Deployment Options**
1. **Docker**: Containerize backend + frontend for cloud deployment
2. **Cloud Platforms**: Deploy to AWS, Azure, or Google Cloud
3. **Database Migration**: Upgrade to PostgreSQL for production workloads
4. **Reverse Proxy**: Nginx/Caddy for SSL termination and load balancing
5. **Environment**: Set `GOOGLE_API_KEY` as a server environment variable

---

## 👥 Team Phase 2 — Role Assignments & Tasks

**Project Phase:** Phase 2 (Enhancement & Production Readiness)
**Team Size:** 4 Members

### 🧑‍💻 Member 1: The AI Architect (Backend - AI Focus)
**Goal:** Upgrade the AGI tools in `agi_engine.py` to use real reasoning data.
- **Task 1.1 (Real Simulation):** Modify `tool_simulate_event` to query `AttendanceDB` and `EnrollmentDB` for actual impact calculations.
- **Task 1.2 (Gemini Integration):** Update fallback logic to trigger only on 401/503 errors. Add robust error logging to `AGILogs`.
- **Task 1.3 (New Tool):** Add `tool_suggest_intervention` that scans `StudentDB` for GPA < 2.0 and suggests study plans.

### 🎨 Member 2: The Frontend Lead (UI/UX)
**Goal:** Enhance user experience and visual feedback.
- **Task 2.1 (Offline Indicators):** Add "AI Offline / Simulation Mode" badge in student app when backend uses fallback.
- **Task 2.2 (Charts):** Replace "At Risk Students" text list with Bar/Pie chart in faculty dashboard.
- **Task 2.3 (Accessibility):** Ensure all forms support keyboard navigation and screen readers.

### ⚙️ Member 3: The Backend Engineer (Infrastructure)
**Goal:** Prepare the system for deployment and scalability.
- **Task 3.1 (Dockerization):** Create Dockerfiles and `docker-compose.yml` for one-command stack deployment.
- **Task 3.2 (DB Migration):** Script to migrate from SQLite to PostgreSQL. Update `database.py` for `.env` connection strings.
- **Task 3.3 (API Docs):** Enhance `main.py` metadata for descriptive Swagger UI.

### 🛡️ Member 4: The QA & Security Lead (Testing)
**Goal:** Establish testing and CI pipeline.
- **Task 4.1 (Unit Testing):** Convert `verify_*.py` scripts into a `pytest` suite in `tests/` directory.
- **Task 4.2 (Input Validation):** Audit auth and student routers. Add Pydantic validators for email/password.
- **Task 4.3 (CI Pipeline):** Create `.github/workflows/test.yml` for automated testing on push.

---

## 🔄 Git Collaboration Workflow

### Branch Strategy
```
main (protected)
  ├── feature/member1-real-simulation
  ├── feature/member2-dashboard-charts
  ├── feature/member3-dockerization
  └── feature/member4-pytest-suite
```

### Development Cycle
1. **Branch**: `git checkout -b feature/your-task-name`
2. **Code**: Implement your task using AI assistants
3. **Verify**: Run `.\start_campus.bat` and `.\health_check.ps1`
4. **Commit**: `git add . && git commit -m "Description of change"`
5. **Push**: `git push origin feature/your-task-name`
6. **PR**: Create Pull Request on GitHub, assign reviewer
7. **Merge**: After approval, merge to `main`
8. **Sync**: Everyone runs `git pull origin main`

### Conflict Resolution
```powershell
git pull origin main          # Pull latest into your branch
# VS Code highlights conflicts
# Choose: Accept Current / Accept Incoming / Keep Both
git add .
git commit -m "Resolved merge conflicts"
git push origin feature/your-branch
```

---

*© 2026 AI-AGI Campus Team. Built for the Future of Education.*