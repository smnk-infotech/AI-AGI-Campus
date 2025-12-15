# AI + AGI Powered Educational Organization & Campus Control System

## 📌 Overview
This project is a 1-year capstone project that aims to build a cost-free, AI + AGI-inspired platform for managing education and full campus administration.
The system integrates AI tutoring, faculty assistance, and administrative automation into one intelligent solution.

## 🚀 Key Features

### 🎓 Student Module
- **AI Tutor & AGI Brain**: Personalized learning assistant powered by **Gemini 2.5 Flash** with Week-Ahead planning.
- **Course Enrollment**: Browse and enroll in available courses.
- **Assignment View**: Track assignments, due dates, and grades.
- **Attendance**: Mark attendance using **Face Verification** via webcam.
- **Secure Login**: JWT-based authentication protecting student data.

### 👩‍🏫 Faculty Module
- **Course Management**: Create and manage academic courses (e.g., "Robotics 101").
- **Assignment Creation**: Issue assignments with descriptions and point values.
- **Attendance Logging**: View student attendance records.
- **At-Risk Detection**: AGI automatically flags students with low attendance or grades.

### 🏢 Admin Module
- **Dashboard**: Live campus statistics (Active Students, Staff, etc.).
- **AGI Controller ("God Mode")**: Interactive chat interface for policy analysis and strategic simulations.
- **Global Pattern Detection**: AGI monitors campus-wide trends (e.g., "Attendance is dropping in CS Dept").

## 🛠️ Tech Stack

### Frontend (Monorepo)
- **Framework**: React 18 + Vite
- **Styling**: Vanilla CSS (Premium "Glassmorphism" Design)
- **State Management**: React Hooks + Context
- **Apps**:
    - `student_app` (Port 5174)
    - `faculty_app` (Port 5175)
    - `admin_app` (Port 5177)

### Backend
- **Framework**: Python FastAPI (Async)
- **Database**: SQLite (Persistent `campus.db` with SQLAlchemy)
- **Authentication**: JWT (JSON Web Tokens) + PBKDF2 Password Hashing
- **AI Integration**: Google Gemini API (`gemini-2.5-flash`)
- **AGI Engine**: Custom `AGIBrain` service with Multi-Agent Reasoning.

## ⚡ Quick Start

### 1. Backend Setup
```powershell
# Navigate to backend API directory
cd backend/api

# Create/Activate Virtual Environment
python -m venv .venv
.venv\Scripts\activate

# Install Dependencies
pip install -r requirements.txt

# Run Server (Port 8000)
uvicorn backend.api.main:app --reload
```

### 2. Frontend Setup
Open separate terminals for each app you want to run.

**Student App**:
```powershell
cd frontend/student_app
npm install
npm run dev
# Access at http://localhost:5174
```
*Login Creds: `aarav.kumar@student.edu` / `password123`*

**Faculty App**:
```powershell
cd frontend/faculty_app
npm install
npm run dev
# Access at http://localhost:5175
```
*Login Creds: `dr.gupta@faculty.edu` / `password123`*

**Admin App**:
```powershell
cd frontend/admin_app
npm install
npm run dev
# Access at http://localhost:5177
```
*Login Creds: `admin@campus.edu` / `admin123`*

## 📂 Project Structure
```
root/
├── backend/
│   └── api/
│       ├── routers/          # API Endpoints
│       │   ├── auth.py       # JWT & Login
│       │   ├── ai.py         # Gemini & AGI Routes
│       │   ├── students.py   # Student CRUD
│       │   ├── faculty.py    # Faculty CRUD
│       │   └── admin.py      # Admin Stats
│       ├── services/
│       │   └── agi_engine.py # 🧠 Core AGI Reasoning Logic
│       ├── models_db.py      # SQLAlchemy Models (SQLite)
│       ├── prompts.py        # System Identity (Prompts)
│       ├── seed_db.py        # Database Population Script
│       └── main.py           # FastAPI Entry Point
├── frontend/
│   ├── student_app/          # Port 5174
│   │   └── src/pages/        # (Dashboard, Assignments, AI Assistant...)
│   ├── faculty_app/          # Port 5175
│   │   └── src/pages/        # (Dashboard, Courses, Research...)
│   └── admin_app/            # Port 5177
│       └── src/pages/        # (Dashboard, AGI Controller, Operations...)
└── README.md
```

## ✅ Progress Check (Dec 2025)
- [x] **Backend**: FastAPI running with SQLite Persistence.
- [x] **Frontend**: All apps connected and styled.
- [x] **Auth**: JWT Authentication implemented.
- [x] **Assignments**: Full creation/view loop working.
- [x] **Courses**: Management and Enrollment features active.
- [x] **Attendance**: Camera-based Face Verification active.
- [x] **AGI Features**:
    - [x] Multi-Agent Debate System
    - [x] Context Awareness (Grades, Assignments, Global Stats)
    - [x] Admin "What-If" Simulator

## 📌 License
MIT License – Free for academic and research use.

## 🧠 AGI "Smart Brain" Upgrade (Dec 2025)
The system is powered by a **Goal-Oriented AGI Engine** (`backend/api/services/agi_engine.py`) that acts as a continuous, intelligent campus OS.

### 🌟 Core Capabilities
1.  **Multi-Agent Consensus System**: 
    -   Every decision is debated internally by simulated agents: **Student Advocate** (Wellbeing), **Faculty Advocate** (Workload), **Admin Agent** (Efficiency), and **Analytics Agent** (Data).
    -   The AGI outputs a **Consensus Decision** and a **Confidence Score (0-100%)**.
    
2.  **Deep Context Awareness ("X-Ray Vision")**:
    -   **Student**: Sees assignments, grades, and attendance history to imply performance.
    -   **Faculty**: Detects at-risk students and workload bottlenecks.
    -   **Admin**: Monitors global stats (Attendance Rate, Dept Health) for macro-management.

3.  **"God Mode" Simulator**:
    -   Admins can ask **"What If?"** scenarios (e.g., *"What if we cut the library budget?"*).
    -   The AGI simulates the outcome based on its multi-agent debate logic.

4.  **Memory & Transparency**:
    -   **Long-Term Memory**: Stores all reasoning chains in the `agi_logs` database.
    -   **Explainability**: Every suggestion comes with a clear reason ("Why?") sourced from the internal debate.

### 🤖 "Always-On" Identity
The system runs on a strict **Observe -> Analyze -> Debate -> Decide** loop, preventing hallucination and ensuring all suggestions are ethical, safe, and role-appropriate.
