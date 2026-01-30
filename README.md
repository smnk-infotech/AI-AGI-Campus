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


Team Work Plan: Smart Campus Brain
Project Phase: Phase 2 (Enhancement & Production Readiness) Team Size: 4 Members

This document outlines the specific tasks for each team member to work on in parallel using Antigravity/Copilot, and the Git workflow to ensure smooth collaboration.

👥 Role Assignments & Tasks
🧑‍💻 Member 1: The AI Architect (Backend - AI Focus)
Goal: Upgrade the "Simulated" tools in 
agi_engine.py
 to use real reasoning data.

Task 1.1 (Real Simulation): Modify 
tool_simulate_event
. Instead of returning a static string, make it query the 
AttendanceDB
 and 
EnrollmentDB
 to calculate actual impact (e.g., if simulating a "System Outage", check how many students would be affected based on schedule).
Task 1.2 (Gemini Integration): Ensure valid API Key handling. Update the fallback logic to only trigger on 401/503 errors, not just when the key is missing. Add robust error logging to 
AGILogs
.
Task 1.3 (New Tool): Add a tool_suggest_intervention that scans 
StudentDB
 for students with GPA < 2.0 and suggests specific study plans.
🎨 Member 2: The Frontend Lead (UI/UX)
Goal: Enhance the user experience and visual feedback mechanism.

Task 2.1 (Offline UI Indicators): In frontend/student_app, add a visible "AI Offline / Simulation Mode" badge in the UI when the backend reports it is using fallback logic.
Task 2.2 (Professor Dashboard): In frontend/faculty_app, replace the text list of "At Risk Students" with a visual Chart (Bar/Pie) showing the distribution of risk levels (High/Medium/Low).
Task 2.3 (Accessibility): Run a pass on all forms (Login, Assignment Submission) to ensure they support keyboard navigation and screen readers.
⚙️ Member 3: The Backend Engineer (Infrastructure)
Goal: Prepare the system for deployment and scalability.

Task 3.1 (Dockerization): Create a Dockerfile for the Backend and a separate Dockerfile for the Frontend. Create a docker-compose.yml to spin up the whole stack with one command.
Task 3.2 (Database Migration): Create a script to migrate from SQLite (campus.db) to PostgreSQL. Update database.py to read connection strings from .env.
Task 3.3 (API Documentation): Enhance main.py metadata (Titles, Summaries, Response Models) so the Swagger UI (/docs) is fully descriptive for external developers.
🛡️ Member 4: The QA & Security Lead (Testing)
Goal: Establish a robust safety net and CI pipeline.

Task 4.1 (Unit Testing): Convert the standalone verify_*.py scripts into a standard pytest suite inside a tests/ directory.
Task 4.2 (Input Validation): Audit routers/auth.py and routers/students.py. Ensure no SQL injection or invalid data can be passed. Add Pydantic validators for Email formats and Password strength.
Task 4.3 (CI Pipeline): Create a .github/workflows/test.yml file that automatically runs the new pytest suite and npm test whenever a teammate pushes code.
🔄 Collaboration Workflow (Git Flow)
Since you are all working on the same project, you MUST use branches to avoid overwriting each other's work.

1. Setup (Everyone)
Clone the repository: git clone <repo-url>
NEVER work directly on the main (or master) branch.
2. The Cycle (One Feature at a Time)
Each member follows this loop for every single task:

Create a Branch:
Name it descriptively: git checkout -b feature/member2-dashboard-charts
Code with AI:
Use Antigravity/Copilot to generate the code for your specific task.
Example: Member 4 asks "Write a pytest test case for the login function in auth.py".
Verify Locally:
Run the app and make sure your specific change works.
Run start_campus.bat to ensure you didn't break the build.
Commit & Push:
git add .
git commit -m "Added charts to faculty dashboard"
git push origin feature/member2-dashboard-charts
Pull Request (PR):
Go to GitHub. You will see a "Compare & pull request" button.
Create the PR.
CRITICAL: Ask another member to review your code (e.g., Member 3 reviews Member 2).
Merge:
Once approved, merge the PR into main.
Everyone else runs git pull origin main to get your changes.
3. Handling Conflicts
If two members edit the same file (e.g., models_db.py):

The second person to merge will get a Merge Conflict.
How to solve:
git pull origin main (into your branch).
VS Code will highlight the conflict.
Choose "Accept Current", "Accept Incoming", or "Keep Both".
Commit the fix and push again.