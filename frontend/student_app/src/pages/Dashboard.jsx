import React, { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle, Clock } from 'lucide-react'
import api from '../services/api'

export default function Dashboard({ student }) {
  const [stats, setStats] = useState(null)
  const [deadlines, setDeadlines] = useState([])
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!student?.id) return

    const fetchDashboard = async () => {
      try {
        const data = await api.getDashboard(student.id)
        setStats(data)

        // Mock data - replace with real API calls
        setDeadlines([
          { id: 1, title: 'CS101 Assignment 3', course: 'Intro to CS', dueDate: 'Mar 5', overdue: false },
          { id: 2, title: 'MATH201 Project', course: 'Calculus II', dueDate: 'Mar 8', overdue: false },
          { id: 3, title: 'ENG102 Essay', course: 'English Comp', dueDate: 'Feb 25', overdue: true },
        ])

        setSchedule([
          { id: 1, time: '09:00 - 10:30', title: 'Introduction to CS', location: 'Room 101' },
          { id: 2, time: '11:00 - 12:30', title: 'Calculus II', location: 'Room 205' },
          { id: 3, time: '14:00 - 15:30', title: 'English Composition', location: 'Room 308' },
          { id: 4, time: '16:00 - 17:00', title: 'Office Hours', location: 'CS Building' },
        ])
      } catch (err) {
        console.error('Failed to fetch dashboard', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [student?.id])

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in flex flex-col items-center">
        <div className="w-full max-w-4xl h-48 bg-teal-50 rounded-2xl animate-pulse"></div>
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-white rounded-xl shadow-sm animate-pulse"></div>)}
        </div>
      </div>
    )
  }

  // Calculate attendance percentage for the ring
  const attStat = stats?.stats?.find(s => s.label === 'Attendance')
  const attendancePercentage = attStat ? parseInt(attStat.value) : 100

  const renderAttendanceRing = () => {
    const radius = 90
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (attendancePercentage / 100) * circumference

    return (
      <div className="attendance-ring-container campus-card">
        <svg
          className="attendance-ring"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="attendance-ring-circle attendance-ring-background"
            cx="100"
            cy="100"
            r={radius}
          />
          <circle
            className="attendance-ring-circle attendance-ring-progress"
            cx="100"
            cy="100"
            r={radius}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: offset,
              transform: 'rotate(-90deg)',
              transformOrigin: '100px 100px',
            }}
          />
        </svg>
        <div className="attendance-ring-text">{attendancePercentage}%</div>
        <div className="attendance-ring-label">Attendance Rate</div>
      </div>
    )
  }

  return (
    <div className="container">
      {/* Stats Overview */}
      <div className="stats-grid">
        {stats?.stats?.map(stat => (
          <div key={stat.id} className="stat-card interactive">
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid">
        {/* Teal Attendance Ring */}
        <div className="grid-4">
          {renderAttendanceRing()}
        </div>

        {/* Upcoming Deadlines */}
        <div className="grid-4">
          <div className="campus-card">
            <h3 className="heading-3 mb-lg flex items-center gap-md">
              <Clock size={20} style={{ color: 'var(--teal-primary)' }} />
              Upcoming Deadlines
            </h3>
            <div className="deadlines-container">
              {deadlines.map((deadline) => (
                <div
                  key={deadline.id}
                  className={`deadline-item interactive ${deadline.overdue ? 'overdue' : ''}`}
                >
                  <div className="deadline-dot" />
                  <div className="deadline-content">
                    <div className="deadline-title">{deadline.title}</div>
                    <div className="deadline-course">{deadline.course}</div>
                  </div>
                  <div className="deadline-date">
                    {deadline.overdue ? (
                      <span style={{ color: '#ef4444', fontWeight: 700 }}>OVERDUE</span>
                    ) : (
                      deadline.dueDate
                    )}
                  </div>
                </div>
              ))}
              {deadlines.length === 0 && (
                <div className="text-center text-secondary">No upcoming deadlines</div>
              )}
            </div>
          </div>
        </div>

        {/* Today's Schedule Preview */}
        <div className="grid-4">
          <div className="campus-card">
            <h3 className="heading-3 mb-lg">Today's Schedule</h3>
            <div className="flex-column gap-md">
              {schedule.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  className="interactive"
                  style={{
                    padding: 'var(--gap-md)',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-normal)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 15px var(--teal-glow)'
                  }}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                >
                  <div className="schedule-time">{item.time}</div>
                  <div className="schedule-title">{item.title}</div>
                  <div className="schedule-location">{item.location}</div>
                </div>
              ))}
              <button className="btn btn-secondary" style={{ marginTop: 'var(--gap-md)' }}>
                View Full Schedule
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Schedule Grid */}
      <div className="section mt-2xl">
        <div className="section-header">
          <h2 className="section-title">This Week's Classes</h2>
        </div>
        <div className="schedule-grid">
          {schedule.map((item) => (
            <div key={item.id} className="schedule-card interactive">
              <div className="schedule-time">{item.time}</div>
              <div className="schedule-title">{item.title}</div>
              <div className="schedule-location">{item.location}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="section mt-2xl">
        <div className="section-header">
          <h2 className="section-title">Quick Actions</h2>
        </div>
        <div className="grid gap-lg">
          <button className="btn btn-primary grid-3 interactive">
            Download Materials
          </button>
          <button className="btn btn-secondary grid-3 interactive">
            Message Instructor
          </button>
          <button className="btn btn-secondary grid-3 interactive">
            View Grades
          </button>
          <button className="btn btn-secondary grid-3 interactive">
            Request Help
          </button>
        </div>
      </div>
    </div>
  )
}
