# AI + AGI Powered Educational Organization & Campus Control System

## 📌 Overview
This project is a 1-year capstone project that aims to build a cost-free, AI + AGI-inspired platform for managing education and full campus administration.
The system integrates AI tutoring, faculty assistance, and administrative automation into one intelligent solution.

**Current Status (Jan 2026):** 🟢 **Production Ready**
- **Architecture**: Multi-Tenant (Student/Faculty/Admin)
- **Data Integrity**: Real, Relational, Persisted Data (SQLite)
- **AI Core**: Google Gemini 2.5 Flash with **Simulation Fallback** (Works without API Key)

## 🚀 Key Features

### 🎓 Student Module
- **AI Tutor & AGI Brain**: Personalized learning assistant powered by **Gemini 2.5 Flash** with Week-Ahead planning.
- **Course Enrollment**: Browse and enroll in available courses.
- **Real-Time Dashboard**: View calculated GPA, Attendance Rates, and Credits based on actual DB records.
- **Attendance**: Mark attendance using **Face Verification** via webcam.
- **Secure Login**: JWT-based authentication protecting student data.

### 👩‍🏫 Faculty Module
- **Course Management**: Create and manage academic courses (e.g., "Robotics 101").
- **Smart Analytics**: Dashboard aggregates unique student counts and course ratings.
- **Assignment Creation**: Issue assignments with descriptions and point values.
- **At-Risk Detection**: AGI automatically flags students with low attendance or grades.

### 🏢 Admin Module
- **Dashboard**: Live campus statistics (Active Students, Staff, etc.).
- **AGI Controller ("God Mode")**: Interactive chat interface for policy analysis and strategic simulations.
- **Global Pattern Detection**: AGI monitors campus-wide trends (e.g., "Attendance is dropping in CS Dept").

## 🛠️ Tech Stack

### Frontend (Monorepo)
- **Framework**: React 18 + Vite
- **Styling**: Vanilla CSS (Premium "Glassmorphism" Design)
- **Apps**:
    - `student_app` (Port 5174)
    - `faculty_app` (Port 5175)
    - `admin_app` (Port 5177)

### Backend
- **Framework**: Python FastAPI (Async)
- **Database**: SQLite (Persistent `campus.db` with SQLAlchemy)
- **Authentication**: JWT (JSON Web Tokens) + PBKDF2 Password Hashing
- **AI Integration**: Google Gemini API (`gemini-2.5-flash`)
    - *Note: Includes robust Simulation Mode if API Key is missing/invalid.*
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

# Reset & Seed Database (Optional - Reset Data)
$env:PYTHONPATH="E:\AI-AGI-Campus"; .venv\Scripts\python.exe -m backend.api.seed_db

# Run Server (Port 8000)
python -m uvicorn backend.api.main:app --port 8000 --reload
```

### 2. Frontend Setup
Open separate terminals for each app.

**Student App**:
```powershell
cd frontend/student_app
npm install
npm run dev
# Access at http://localhost:5174
```
**Credentials:**
- **Aarav (Robotics)**: `aarav.kumar@student.edu` / `password123`
- **Priya (CS)**: `priya@student.edu` / `password123`

**Faculty App**:
```powershell
cd frontend/faculty_app
npm install
npm run dev
# Access at http://localhost:5175
```
**Credentials:**
- **Dr. Gupta (CS)**: `dr.gupta@faculty.edu` / `password123`
- **Prof. Dave (Robotics)**: `prof.dave@faculty.edu` / `password123`

**Admin App**:
```powershell
cd frontend/admin_app
npm install
npm run dev
# Access at http://localhost:5177
```
**Credentials:**
- **Admin**: `admin@campus.edu` / `admin123`

## 📂 Project Structure
```
root/
├── backend/
│   └── api/
│       ├── routers/          # API Endpoints
│       │   ├── auth.py       # JWT & Login
│       │   ├── ai.py         # Gemini & AGI Routes (w/ Simulation Fallback)
│       │   ├── students.py   # Student CRUD & Dashboard Logic
│       │   ├── faculty.py    # Faculty CRUD & Analytics
│       │   └── admin.py      # Admin Stats
│       ├── services/
│       │   └── agi_engine.py # 🧠 Core AGI Reasoning Logic
│       ├── models_db.py      # SQLAlchemy Models (User, Course, Enrollment, Grades)
│       ├── seed_db.py        # Relational Data Seeder
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

## ✅ Progress Check (Jan 2026)
- [x] **Backend**: FastAPI running with SQLite Persistence.
- [x] **Frontend**: All apps connected and styled.
- [x] **Auth**: JWT Authentication implemented & verified.
- [x] **Data Integrity**: **Real Relational Data** (No Mocks).
- [x] **Assignments**: Full creation/view loop working.
- [x] **Courses**: Management and Enrollment features active with Credits.
- [x] **Attendance**: Camera-based Face Verification active.
- [x] **AGI Features**:
    - [x] Multi-Agent Debate System
    - [x] Context Awareness (Grades, Assignments, Global Stats)
    - [x] Admin "What-If" Simulator
    - [x] **Simulation Fallback Mode** (Robustness Update)

## 📌 License
MIT License – Free for academic and research use....
