# AI + AGI Powered Educational Organization & Campus Control System

### **Vision: The Autonomous University of 2030**
This project represents a **paradigm shift** in educational management. It is not just a Learning Management System (LMS); it is an **Autonomous Campus Operating System**. By integrating **Artificial General Intelligence (AGI)** into the core of campus operations, we aim to create a self-optimizing educational environment where:
-   **Students** receive 24/7 personalized tutoring and wellbeing support.
-   **Faculty** are empowered by AI research assistants and automated administrative tasks.
-   **Administrators** possess "God Mode" oversight with predictive analytics and simulating policy changes before implementation.

---

## 🏗️ System Architecture
The platform is built as a **multi-tenant, distributed application** ensuring security, scalability, and role-specific user experiences.

### **Core Components**
1.  **Central Intelligence (Backend)**: A high-performance Python FastAPI server that manages the `campus.db` (SQLite) relational database and orchestrates AI agents.
2.  **Role-Specific Portals**: Three distinct React applications tailored for Students, Faculty, and Administrators.
3.  **The AGI Brain**: A dedicated service layer powered by **Google Gemini 2.5 Flash** (with robust simulation fallback) that handles complex reasoning, natural language understanding, and predictive modeling.

---

## 🚀 Key Features by Portal

### 🎓 Student Portal (`student_app`)
*Empowering learners with autonomy and intelligence.*
-   **AI Study Assistant**: A persistent chat interface that remembers context, helps with homework, and generates personalized **Learning Kits**.
-   **Face Verification Attendance**: Next-gen attendance system using webcam-based face recognition (verified against backend logic).
-   **Real-Time Schedule**: Dynamic weekly schedule fetching time slots directly from active course enrollments.
-   **Interactive Assignments**: View upcoming work, track deadlines, and simulate submission flows with state persistence.
-   **Holistic Wellbeing**: Integrated "Support Circle" and dynamic "Daily Inspiration" to support mental health.

### 👩‍🏫 Faculty Portal (`faculty_app`)
*Augmenting research and instruction.*
-   **Research Copilot**: An advanced AI agent designed to assist with grant writing, literature reviews, and experiment planning.
-   **Dynamic Advising Dashboard**: Automatically fetches and lists **real students** enrolled in the faculty's courses for targeted mentorship.
-   **Course Command Center**: Create and manage courses with instant availability to the student body.
-   **Automated Grading**: (Beta) AI-assisted grading workflows to reduce administrative burden.

### 🏢 Admin Portal (`admin_app`)
*Total operational awareness.*
-   **AGI "God Mode" Controller**: A conversational command interface. Ask *"How is the CS department performing?"* or *"Simulate a 10% enrollment increase"* and get data-backed answers.
-   **Global Operations Dashboard**: Live telemetry on active users, pending fees, and attendance anomalies.
-   **Pattern Detection**: The system autonomously flags at-risk students or underperforming departments.

---

## 🛠️ Technology Stack

### **Frontend Infrastructure** (Modern React Monorepo)
-   **Framework**: React 18 + Vite (Lightning-fast builds)
-   **Styling**: Custom CSS Variables, Glassmorphism UI, Responsive Grid Layouts
-   **Routing**: React Router v6 with Role-Based Access Control

### **Backend Infrastructure** (Async Python)
-   **API**: FastAPI (High-performance, auto-documenting)
-   **Database**: SQLite with **SQLAlchemy ORM** (Relational integrity, Foreign Keys)
-   **Authentication**: OAuth2 compliant JWT (JSON Web Tokens) with PBKDF2 hashing
-   **AI Layer**: `google-generativeai` SDK (Gemini 2.5 Flash) + Custom "Simulated Reality" fallback engine.

---

## ⚡ Getting Started (Local Development)

### Prerequisites
-   Node.js (v18+)
-   Python (v3.10+)

### 1. Backend Setup
The heart of the system.
```powershell
# Navigate to backend API directory
cd backend/api

# Create/Activate Virtual Environment
python -m venv .venv
.venv\Scripts\activate

# Install Dependencies
pip install -r requirements.txt

# Seed Database (Populate with Demo Data)
$env:PYTHONPATH="E:\AI-AGI-Campus"; .venv\Scripts\python.exe -m backend.api.seed_db

# Start Server (Port 8000)
python -m uvicorn backend.api.main:app --port 8000 --reload
```

### 2. Frontend Setup
Launch the three portals in separate terminals.

**Student App** (Port 5174):
```powershell
cd frontend/student_app
npm install
npm run dev
```
*   **Login**: `aarav.kumar@student.edu` / `password123`

**Faculty App** (Port 5175):
```powershell
cd frontend/faculty_app
npm install
npm run dev
```
*   **Login**: `dr.gupta@faculty.edu` / `password123`

**Admin App** (Port 5177):
```powershell
cd frontend/admin_app
npm install
npm run dev
```
*   **Login**: `admin@campus.edu` / `admin123`

---

## 📂 Project Structure
```text
root/
├── backend/
│   └── api/
│       ├── routers/          # REST API Endpoints (Auth, AI, Courses...)
│       ├── services/         # Business Logic & AGI Engine
│       ├── models_db.py      # Database Schema (SQLAlchemy)
│       └── main.py           # Application Entry Point
├── frontend/
│   ├── student_app/          # Student Experience React App
│   ├── faculty_app/          # Faculty Experience React App
│   └── admin_app/            # Operations Control React App
└── campus.db                 # Persistent SQLite Database
```

## ✅ Project Status (Jan 2026)
This project is **Feature Complete** for the Capstone requirements.
-   [x] **Full-Stack Integration**: Frontend <-> Backend <-> Database.
-   [x] **Real-Time Data**: No mocks; all data is relational and persistent.
-   [x] **AGI Integrated**: Agents are deployed and functional across all portals.
-   [x] **Simulation Fallback**: System remains usable even without external API connectivity.

---
*© 2026 AI-AGI Campus Team. Built for the Future of Education.*
