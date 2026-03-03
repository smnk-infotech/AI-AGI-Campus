# Frontend-Backend Connection Guide

## Overview

The AI-AGI Campus system uses a **centralized API service pattern** for all frontend-backend communication. Each portal (Student, Faculty, Admin) has a dedicated API service class that handles all HTTP requests with proper authentication and error handling.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           Backend (FastAPI)                         │
│                         http://localhost:8001                       │
│                                                                     │
│  ┌─────────────┐  ┌────────────┐  ┌─────────────┐  ┌──────────┐  │
│  │ /api/auth   │  │ /api/students│  │ /api/faculty│  │ /api/admin│ │
│  │ token, me   │  │ dashboard   │  │ dashboard   │  │ dashboard │ │
│  └─────────────┘  └────────────┘  └─────────────┘  └──────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              /api/ai - AI/AGI Integration                    │  │
│  │         Messages, Chat, Simulations                          │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │         Database (SQLite - campus.db)                        │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
        ▲                    ▲                    ▲
        │ HTTP + JWT        │ HTTP + JWT        │ HTTP + JWT
        │ Requests          │ Requests          │ Requests
        │                    │                    │
┌───────┴──────┐   ┌─────────┴────────┐   ┌──────┴───────────┐
│  Student App │   │  Faculty App     │   │   Admin App      │
│  :5174       │   │  :5175           │   │   :5177          │
│              │   │                  │   │                  │
│ • src/       │   │ • src/           │   │ • src/           │
│   services/  │   │   services/      │   │   services/      │
│   api.js     │   │   api.js         │   │   api.js         │
│              │   │                  │   │                  │
│ • Pages use  │   │ • Pages use      │   │ • Pages use      │
│   API class  │   │   API class      │   │   API class      │
└──────────────┘   └──────────────────┘   └──────────────────┘
```

---

## API Service Classes

Each frontend app has a dedicated API service in `src/services/api.js`:

### Student API Service
```javascript
import api from '@/services/api'

// Login
const { access_token, role } = await api.login(email, password)

// Fetch current user
const user = await api.getCurrentUser()

// Fetch dashboard
const dashboard = await api.getDashboard(studentId)

// Send message to AI
const response = await api.sendAIMessage('Help with calculus')
```

### Faculty API Service
```javascript
import api from '@/services/api'

// All auth methods same as above
const user = await api.getCurrentUser()

// Fetch faculty-specific dashboard
const dashboard = await api.getDashboard(facultyId)

// Get enrolled students
const students = await api.getStudents(facultyId)

// Send message to Research Copilot
const response = await api.sendAIMessage('Help with grant writing')
```

### Admin API Service
```javascript
import api from '@/services/api'

// All auth methods
const user = await api.getCurrentUser()

// Get admin dashboard with KPIs
const dashboard = await api.getDashboard()

// Fetch analytics
const analytics = await api.getAnalytics('enrollment')

// Query students with filters
const students = await api.getStudents({ status: 'at-risk' })

// Send to AGI Controller
const response = await api.sendAIMessage('Simulate 10% enrollment increase')

// Run scenario simulation
const simulation = await api.simulateScenario({ change: 'tuition +5%' })
```

---

## Configuration

### Environment Variables

Each app supports configuration via `.env` files (copy from `.env.example`):

```bash
# Student, Faculty, or Admin app
cd frontend/{app_name}
cp .env.example .env
```

**Available variables:**
- `VITE_API_BASE`: Backend URL (default: `http://localhost:8001`)
- `VITE_DEBUG`: Enable debug logging (default: `false`)
- `VITE_API_TIMEOUT`: Request timeout in ms (default: `30000`)

### CORS Configuration

The backend (`backend/api/main.py`) already allows CORS requests from all frontend ports:

```python
origins = [
    "http://localhost:5173",  # Homepage
    "http://localhost:5174",  # Student App
    "http://localhost:5175",  # Faculty App
    "http://localhost:5176",  # Parent App
    "http://localhost:5177",  # Admin App
]
```

---

## Authentication Flow

### 1. **Login**
```
User enters email/password
    ↓
Frontend: api.login(email, password)
    ↓
Backend: POST /api/auth/token
    ↓
Backend returns: { access_token, token_type, id, role, name }
    ↓
Frontend: localStorage.setItem('X_token', access_token)
```

### 2. **Session Persistence**
```
Page reload
    ↓
App checks localStorage for token
    ↓
If found: api.getCurrentUser()
    ↓
Backend: GET /api/auth/me (with Bearer token)
    ↓
Verify token JWT signature
    ↓
Return user object or 401 Unauthorized
```

### 3. **API Requests**
```
Any API call
    ↓
Service method retrieves token from localStorage
    ↓
Method adds Authorization header: "Bearer {token}"
    ↓
Backend: Dependency verifies JWT
    ↓
Proceed if valid, return 401 if expired/invalid
```

---

## Example: Using API Service in Components

### React Component (Student Dashboard)
```jsx
import React, { useEffect, useState } from 'react'
import api from '@/services/api'

export default function Dashboard({ student }) {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!student) return
    
    const fetchDashboard = async () => {
      try {
        const data = await api.getDashboard(student.id)
        setDashboard(data)
      } catch (error) {
        console.error('Failed to fetch dashboard:', error)
        // Handle error (show toast, redirect, etc.)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [student])

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1>Welcome, {student.first_name}</h1>
      <p>GPA: {dashboard.gpa}</p>
      <p>Credits: {dashboard.total_credits}</p>
    </div>
  )
}
```

### Login Component
```jsx
import api from '@/services/api'

async function handleLogin(e) {
  e.preventDefault()
  try {
    const { access_token } = await api.login(email, password)
    localStorage.setItem('student_token', access_token)
    setToken(access_token)
    navigate('/')
  } catch (error) {
    setError('Invalid credentials')
  }
}
```

---

## Backend Endpoints Reference

### Authentication
- `POST /api/auth/token` - Login (returns JWT)
- `GET /api/auth/me` - Get current user profile

### Student Endpoints
- `GET /api/students/{id}/dashboard` - Dashboard stats, schedule, alerts
- `GET /api/students/{id}/courses` - Enrolled courses
- `GET /api/students/{id}/assignments` - Assignments and deadlines
- `GET /api/students/{id}/attendance` - Attendance records

### Faculty Endpoints
- `GET /api/faculty/{id}/dashboard` - Faculty dashboard
- `GET /api/faculty/{id}/courses` - Taught courses
- `GET /api/faculty/{id}/students` - Enrolled students

### Admin Endpoints
- `GET /api/admin/dashboard` - Admin KPI dashboard
- `GET /api/admin/analytics?metric=X` - Analytics data
- `GET /api/admin/students` - All students (with filters)
- `GET /api/admin/faculty` - All faculty

### AI Endpoints
- `POST /api/ai/messages` - Send message to AGI (accepts role: student/faculty/admin)
- `POST /api/admin/simulate` - Run scenario simulation (admin only)

---

## Error Handling

The API service provides consistent error messages:

```javascript
try {
  const data = await api.getDashboard(studentId)
} catch (error) {
  console.error(error.message) // "Failed to fetch dashboard"
  
  // Handle specific status codes
  if (error.status === 401) {
    // Redirect to login
  } else if (error.status === 404) {
    // Show "Not found" message
  } else {
    // Show generic error
  }
}
```

---

## Development Workflow

### 1. Start Backend
```powershell
cd backend/api
.venv\Scripts\activate
python -m uvicorn backend.api.main:app --port 8001 --reload
```

### 2. Start Frontends
```powershell
# Terminal 1: Student App
cd frontend/student_app
npm install
npm run dev

# Terminal 2: Faculty App
cd frontend/faculty_app
npm install
npm run dev

# Terminal 3: Admin App
cd frontend/admin_app
npm install
npm run dev
```

### 3. Or Use Bundled Script
```powershell
# All-in-one launcher
./start_campus.bat
```

---

## Testing API Endpoints

### Using Browser DevTools
1. Open any portal (http://localhost:5174)
2. Open DevTools (F12)
3. Console tab
4. Import and test:
```javascript
import api from './services/api'

// Check health
api.healthCheck().then(healthy => console.log(healthy))

// Test after login
api.getCurrentUser().then(user => console.log(user))

// Fetch dashboard
api.getDashboard('student-id').then(data => console.log(data))
```

### Using cURL (PowerShell)
```powershell
# Login
$loginResponse = Invoke-WebRequest -Uri 'http://localhost:8001/api/auth/token' `
  -Method POST `
  -Headers @{'Content-Type'='application/x-www-form-urlencoded'} `
  -Body 'username=aarav.kumar@student.edu&password=password123'

$token = ($loginResponse.Content | ConvertFrom-Json).access_token

# Use token
$dashboardResponse = Invoke-WebRequest -Uri 'http://localhost:8001/api/students/{id}/dashboard' `
  -Headers @{'Authorization'="Bearer $token"}

$dashboardResponse.Content | ConvertFrom-Json
```

---

## Production Deployment

When deploying to production:

1. **Update `VITE_API_BASE`** in `.env` to production backend URL
2. **Update CORS origins** in `backend/api/main.py`
3. **Enable HTTPS** and update token storage (consider secure HttpOnly cookies)
4. **Set appropriate timeouts** for slower networks

Example production `.env`:
```bash
VITE_API_BASE=https://api.campus.edu
VITE_API_TIMEOUT=45000
```

---

## Troubleshooting

### CORS Error
**Problem**: "Access to XMLHttpRequest denied"
- **Solution**: Check `VITE_API_BASE` matches backend allowed origins in `main.py`

### 401 Unauthorized
**Problem**: "Bearer token invalid or expired"
- **Solution**: Check localStorage has valid token; call `api.getCurrentUser()` to verify

### Network Timeout
**Problem**: "Failed to fetch"
- **Solution**: Verify backend is running; check `VITE_API_TIMEOUT` is sufficient

### "api is not defined"
**Problem**: Can't import API service
- **Solution**: Ensure path alias `@/services/api` is configured in `vite.config.js`

---

## File Structure

```
frontend/{app_name}/
├── .env.example                 # Configuration template
├── .env                         # Local config (git-ignored)
├── vite.config.js              # Vite configuration
├── src/
│   ├── services/
│   │   └── api.js              # ← Centralized API service
│   ├── pages/
│   │   ├── Dashboard.jsx        # Uses: api.getDashboard()
│   │   ├── Courses.jsx          # Uses: api.getCourses()
│   │   ├── Login.jsx            # Uses: api.login()
│   │   └── ...
│   └── App.jsx                  # Uses: api.getCurrentUser()
└── package.json
```

---

## Next Steps

- [ ] Copy `.env.example` to `.env` in each frontend app
- [ ] Run `npm install` in each frontend app
- [ ] Test login flow in each app
- [ ] Verify all dashboard endpoints return data
- [ ] Test AI message endpoint
- [ ] Deploy to production with proper environment variables

---

**Questions?** Check the API service implementation in `src/services/api.js` for the complete list of available methods.
