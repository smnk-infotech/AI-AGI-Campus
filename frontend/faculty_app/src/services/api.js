/**
 * Faculty API Service Layer
 * Centralized API calls with immediate state updates for instant user feedback
 */

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8001'

class FacultyAPIService {
  constructor() {
    this.token = localStorage.getItem('faculty_token')
  }

  // ================== AUTH ==================
  async login(email, password) {
    const formData = new URLSearchParams()
    formData.append('username', email)
    formData.append('password', password)

    const response = await fetch(`${API_BASE}/api/auth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    })

    if (!response.ok) throw new Error(`Login failed: ${response.status}`)

    const data = await response.json()
    this.token = data.access_token
    localStorage.setItem('faculty_token', data.access_token)
    return data
  }

  async getCurrentUser() {
    if (!this.token) throw new Error('No token found')

    const response = await fetch(`${API_BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${this.token}` },
    })

    if (response.status === 401) {
      localStorage.removeItem('faculty_token')
      throw new Error('Unauthorized: Token expired')
    }

    if (!response.ok) throw new Error(`Failed to fetch user: ${response.status}`)
    return response.json()
  }

  // ================== DASHBOARD & DATA ==================
  async getDashboard(facultyId) {
    if (!this.token) throw new Error('No token found')

    const response = await fetch(`${API_BASE}/api/faculty/${facultyId}/dashboard`, {
      headers: { Authorization: `Bearer ${this.token}` },
    })

    if (!response.ok) throw new Error(`Failed to fetch dashboard: ${response.status}`)
    return response.json()
  }

  async getCourses(facultyId) {
    if (!this.token) throw new Error('No token found')

    const response = await fetch(`${API_BASE}/api/courses/`, {
      headers: { Authorization: `Bearer ${this.token}` },
    })

    if (!response.ok) throw new Error(`Failed to fetch courses: ${response.status}`)
    // Filter to only courses taught by this faculty
    const allCourses = await response.json()
    return allCourses.filter(c => c.faculty_id === facultyId)
  }

  async getStudents(courseId) {
    if (!this.token) throw new Error('No token found')

    const response = await fetch(`${API_BASE}/api/students/`, {
      headers: { Authorization: `Bearer ${this.token}` },
    })

    if (!response.ok) throw new Error(`Failed to fetch students: ${response.status}`)
    return response.json()
  }

  // ================== ATTENDANCE & GRADING ==================
  async markAttendance(courseId, studentId, status) {
    if (!this.token) throw new Error('No token found')

    const response = await fetch(
      `${API_BASE}/api/attendance/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({
          student_id: studentId,
          status: status,
        }),
      }
    )

    if (!response.ok) throw new Error(`Failed to mark attendance: ${response.status}`)

    // Return success + immediate state update signal
    return { success: true, studentId, status }
  }

  async updateGrade(courseId, studentId, grade) {
    if (!this.token) throw new Error('No token found')

    const response = await fetch(
      `${API_BASE}/api/admin/grades`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({
          student_id: studentId,
          course_id: courseId,
          grade: grade,
        }),
      }
    )

    if (!response.ok) throw new Error(`Failed to update grade: ${response.status}`)
    return { success: true, studentId, grade }
  }

  // ================== AI & RESEARCH ==================
  async sendAIMessage(input, context = 'general') {
    if (!this.token) throw new Error('No token found')

    const response = await fetch(`${API_BASE}/api/ai/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: input,
          },
        ],
      }),
    })

    if (!response.ok) throw new Error(`Failed to send message: ${response.status}`)
    return response.json()
  }

  async executeAIAction(tool, args = {}) {
    if (!this.token) throw new Error('No token found')

    const response = await fetch(`${API_BASE}/api/ai/actions/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({ tool, args }),
    })

    if (!response.ok) throw new Error(`Failed to execute action: ${response.status}`)
    return response.json()
  }

  // ================== UTILITY ==================
  logout() {
    this.token = null
    localStorage.removeItem('faculty_token')
  }
}

export default new FacultyAPIService()
