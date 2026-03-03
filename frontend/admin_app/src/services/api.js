/**
 * Admin API Service Layer
 * Centralized API calls for Admin dashboard with data management
 */

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8001'

class AdminAPIService {
  constructor() {
    this.token = localStorage.getItem('admin_token')
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
    localStorage.setItem('admin_token', data.access_token)
    return data
  }

  async getCurrentUser() {
    if (!this.token) throw new Error('No token found')

    const response = await fetch(`${API_BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${this.token}` },
    })

    if (response.status === 401) {
      localStorage.removeItem('admin_token')
      throw new Error('Unauthorized: Token expired')
    }

    if (!response.ok) throw new Error(`Failed to fetch user: ${response.status}`)
    return response.json()
  }

  // ================== DASHBOARD & ANALYTICS ==================
  async getDashboard() {
    if (!this.token) throw new Error('No token found')

    const response = await fetch(`${API_BASE}/api/admin/dashboard`, {
      headers: { Authorization: `Bearer ${this.token}` },
    })

    if (!response.ok) throw new Error(`Failed to fetch dashboard: ${response.status}`)
    return response.json()
  }

  async getAnalytics(timeRange = '30d') {
    if (!this.token) throw new Error('No token found')

    const response = await fetch(`${API_BASE}/api/admin/dashboard`, {
      headers: { Authorization: `Bearer ${this.token}` },
    })

    if (!response.ok) throw new Error(`Failed to fetch analytics: ${response.status}`)
    return response.json()
  }

  // ================== USER MANAGEMENT ==================
  async getStudents(page = 1, limit = 50) {
    if (!this.token) throw new Error('No token found')

    const response = await fetch(
      `${API_BASE}/api/students/`,
      {
        headers: { Authorization: `Bearer ${this.token}` },
      }
    )

    if (!response.ok) throw new Error(`Failed to fetch students: ${response.status}`)
    return response.json()
  }

  async getFaculty(page = 1, limit = 50) {
    if (!this.token) throw new Error('No token found')

    const response = await fetch(
      `${API_BASE}/api/faculty/`,
      {
        headers: { Authorization: `Bearer ${this.token}` },
      }
    )

    if (!response.ok) throw new Error(`Failed to fetch faculty: ${response.status}`)
    return response.json()
  }

  async createUser(userData) {
    if (!this.token) throw new Error('No token found')

    // Determine if student or faculty from userData
    const endpoint = userData.role === 'faculty' ? 'faculty' : 'students'
    const response = await fetch(`${API_BASE}/api/${endpoint}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) throw new Error(`Failed to create user: ${response.status}`)
    return { success: true, data: await response.json() }
  }

  async updateUser(userId, userData) {
    if (!this.token) throw new Error('No token found')

    // Determine endpoint from userData type
    const endpoint = userData.role === 'faculty' ? 'faculty' : 'students'
    const response = await fetch(`${API_BASE}/api/${endpoint}/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) throw new Error(`Failed to update user: ${response.status}`)
    return { success: true, data: await response.json() }
  }

  async deleteUser(userId) {
    if (!this.token) throw new Error('No token found')

    // Try deleting from both collections
    const response = await fetch(`${API_BASE}/api/students/${userId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${this.token}` },
    })

    if (!response.ok) throw new Error(`Failed to delete user: ${response.status}`)
    return { success: true, userId }
  }

  // ================== SYSTEM HEALTH ==================
  async getSystemHealth() {
    if (!this.token) throw new Error('No token found')

    const response = await fetch(`${API_BASE}/health`, {
      headers: { Authorization: `Bearer ${this.token}` },
    })

    if (!response.ok) throw new Error(`Failed to fetch system health: ${response.status}`)
    return response.json()
  }

  async getSystemAlerts() {
    if (!this.token) throw new Error('No token found')

    const response = await fetch(`${API_BASE}/api/admin/alerts`, {
      headers: { Authorization: `Bearer ${this.token}` },
    })

    if (!response.ok) throw new Error(`Failed to fetch alerts: ${response.status}`)
    return response.json()
  }

  // ================== AGI SCENARIOS ==================
  async simulateScenario(scenarioId, parameters = {}) {
    if (!this.token) throw new Error('No token found')

    const response = await fetch(`${API_BASE}/api/admin/scenarios/${scenarioId}/simulate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify(parameters),
    })

    if (!response.ok) throw new Error(`Failed to simulate scenario: ${response.status}`)
    return { success: true, data: await response.json() }
  }

  // ================== AI & INSIGHTS ==================
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

  // ================== UTILITY ==================
  logout() {
    this.token = null
    localStorage.removeItem('admin_token')
  }
}

export default new AdminAPIService()

