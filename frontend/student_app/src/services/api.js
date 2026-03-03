// Student App API Service
// Centralized API configuration and methods

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8001'

class StudentAPIService {
  constructor() {
    this.baseUrl = API_BASE
  }

  // Get auth token from localStorage
  getToken() {
    return localStorage.getItem('student_token')
  }

  // Build headers with auth token
  getHeaders(includeAuth = true) {
    const headers = { 'Content-Type': 'application/json' }
    if (includeAuth) {
      const token = this.getToken()
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }
    return headers
  }

  // Auth endpoints
  async login(email, password) {
    const formData = new URLSearchParams()
    formData.append('username', email)
    formData.append('password', password)

    const response = await fetch(`${this.baseUrl}/api/auth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData
    })

    if (!response.ok) {
      throw new Error('Login failed')
    }

    return response.json()
  }

  async getCurrentUser() {
    const response = await fetch(`${this.baseUrl}/api/auth/me`, {
      headers: this.getHeaders()
    })

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('student_token')
      }
      throw new Error('Failed to fetch user')
    }

    return response.json()
  }

  // Student endpoints
  async getDashboard(studentId) {
    const response = await fetch(`${this.baseUrl}/api/students/${studentId}/dashboard`, {
      headers: this.getHeaders()
    })

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard')
    }

    return response.json()
  }

  async getCourses(studentId) {
    const response = await fetch(`${this.baseUrl}/api/courses/my/${studentId}`, {
      headers: this.getHeaders()
    })

    if (!response.ok) {
      throw new Error('Failed to fetch courses')
    }

    return response.json()
  }

  async getAssignments(studentId) {
    const response = await fetch(`${this.baseUrl}/api/assignments/`, {
      headers: this.getHeaders()
    })

    if (!response.ok) {
      throw new Error('Failed to fetch assignments')
    }

    return response.json()
  }

  async getAttendance(studentId) {
    const response = await fetch(`${this.baseUrl}/api/attendance/student/${studentId}`, {
      headers: this.getHeaders()
    })

    if (!response.ok) {
      throw new Error('Failed to fetch attendance')
    }

    return response.json()
  }

  // AI endpoints
  async sendAIMessage(message, role = 'student') {
    const response = await fetch(`${this.baseUrl}/api/ai/messages`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: message,
          },
        ],
      })
    })

    if (!response.ok) {
      throw new Error('Failed to send message to AI')
    }

    return response.json()
  }

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseUrl}/health`)
      return response.ok
    } catch {
      return false
    }
  }
}

export default new StudentAPIService()
