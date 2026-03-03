import React, { useEffect, useState } from 'react'
import { BookOpen, Users, File, Clock, AlertTriangle, CheckCircle, TrendingUp, Calendar, Award, Target, Zap, ChevronRight } from 'lucide-react'
import api from '../services/api'

export default function Dashboard({ faculty }) {
  const [stats, setStats] = useState([])
  const [highlights, setHighlights] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!faculty) return
    const fetchData = async () => {
      try {
        const data = await api.getDashboard(faculty.id)
        setStats(data.stats)
        setHighlights(data.research_highlights)
        setNotifications(data.notifications.map((msg, i) => ({ id: i, message: msg, priority: 'normal' })))
      } catch (e) {
        console.error('Failed to fetch faculty dashboard:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [faculty])

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-6 animate-pulse">
        <div className="w-full max-w-4xl h-24 bg-teal-50 rounded-xl"></div>
        <div className="w-full max-w-4xl grid grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white rounded-xl shadow-sm"></div>)}
        </div>
      </div>
    )
  }

  return (
    <div className="faculty-dashboard w-full max-w-6xl mx-auto flex flex-col items-center gap-8">
      {/* Quick Actions Bar */}
      <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickActionCard
          icon={<File size={20} />}
          title="Grade Assignments"
          subtitle="12 pending"
          color="blue"
          urgent={true}
        />
        <QuickActionCard
          icon={<Users size={20} />}
          title="Student Meetings"
          subtitle="3 today"
          color="green"
        />
        <QuickActionCard
          icon={<Calendar size={20} />}
          title="Schedule Class"
          subtitle="Next: CS101"
          color="purple"
        />
        <QuickActionCard
          icon={<Award size={20} />}
          title="Submit Grades"
          subtitle="Due tomorrow"
          color="orange"
          urgent={true}
        />
      </div>

      {/* Key Metrics */}
      <section className="dashboard-grid w-full">
        {stats.map((stat, index) => (
          <MetricCard key={stat.id} stat={stat} index={index} />
        ))}
      </section>

      {/* Main Content Areas - Split Layout */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6 w-full">
          {/* Today's Schedule */}
          <section className="card-animated w-full">
            <header className="flex flex-col items-center mb-6 w-full relative">
              <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mb-3 border border-teal-100 shadow-sm">
                <Clock size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Today's Schedule</h3>
              <span className="absolute top-0 right-0 bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded-full font-bold">8:00 AM - 5:00 PM</span>
            </header>

            <div className="w-full flex flex-col gap-3 items-center">
              <ScheduleItem
                time="9:00 AM"
                title="CS101 - Data Structures"
                location="Room 204"
                type="lecture"
              />
              <ScheduleItem
                time="11:00 AM"
                title="Office Hours"
                location="Faculty Lounge"
                type="meeting"
              />
              <ScheduleItem
                time="2:00 PM"
                title="Research Meeting"
                location="Lab 3B"
                type="research"
              />
            </div>
          </section>

          {/* Research Highlights */}
          <section className="card-animated w-full">
            <header className="flex flex-col items-center mb-6 w-full">
              <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-3 border border-purple-100 shadow-sm">
                <Award size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Research Highlights</h3>
            </header>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              {highlights.length === 0 ? (
                <div className="col-span-full flex flex-col items-center py-6 text-gray-500">
                  <Award size={36} className="mb-2 opacity-50" />
                  <p>No active research projects</p>
                </div>
              ) : (
                highlights.map((item) => (
                  <ResearchItem key={item.id} item={item} />
                ))
              )}
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-6 w-full">
          {/* Priority Notifications */}
          <section className="card-animated w-full">
            <header className="flex flex-col items-center mb-6 w-full">
              <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 mb-3 border border-orange-100 shadow-sm">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Priority Notifications</h3>
              <span className="mt-2 bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full">{notifications.length} New</span>
            </header>

            <div className="w-full flex flex-col gap-3">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center py-6 text-green-600">
                  <CheckCircle size={36} className="mb-2 opacity-50" />
                  <p>All caught up!</p>
                </div>
              ) : (
                notifications.map((note) => (
                  <NotificationItem key={note.id} note={note} />
                ))
              )}
            </div>
          </section>

          {/* AI Assistant */}
          <AGIWidget faculty={faculty} />
        </div>
      </div>
    </div>
  )
}

// Quick Action Cards
function QuickActionCard({ icon, title, subtitle, color, urgent = false }) {
  const colorClasses = {
    blue: 'hover:border-blue-300 hover:shadow-blue-100',
    green: 'hover:border-green-300 hover:shadow-green-100',
    purple: 'hover:border-purple-300 hover:shadow-purple-100',
    orange: 'hover:border-orange-300 hover:shadow-orange-100'
  }

  return (
    <div className={`card-action group w-full ${colorClasses[color]} relative overflow-hidden`}>
      {urgent && <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full m-2 animate-pulse"></div>}
      <div className={`w-10 h-10 rounded-full bg-${color}-50 text-${color}-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h4 className="font-bold text-gray-900 text-sm mb-1">{title}</h4>
      <p className="text-gray-500 text-xs">{subtitle}</p>
    </div>
  )
}

// Metric Cards
function MetricCard({ stat, index }) {
  const getIcon = (label) => {
    const icons = {
      'Students': Users,
      'Courses': BookOpen,
      'Assignments': File,
      'Research': Award
    }
    return icons[label] || Target
  }

  const Icon = getIcon(stat.label)

  return (
    <div className="card-metric group" style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="metric-icon-wrapper group-hover:bg-teal-100 group-hover:text-teal-700 transition-colors">
        <Icon size={24} />
      </div>
      <div className="metric-value">{stat.value}</div>
      <div className="metric-label">{stat.label}</div>
      {stat.detail && <div className="mt-2 text-xs text-teal-600 font-medium bg-teal-50 px-2 py-1 rounded-full">{stat.detail}</div>}
    </div>
  )
}

function ScheduleItem({ time, title, location, type }) {
  const typeColors = {
    lecture: 'border-l-4 border-l-blue-500 bg-blue-50/50',
    meeting: 'border-l-4 border-l-green-500 bg-green-50/50',
    research: 'border-l-4 border-l-purple-500 bg-purple-50/50'
  }

  return (
    <div className={`w-full flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:shadow-md transition-all cursor-pointer ${typeColors[type]}`}>
      <div className="flex flex-col items-start gap-1">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{time}</span>
        <h4 className="font-bold text-gray-900">{title}</h4>
        <span className="text-xs text-gray-500 flex items-center gap-1">📍 {location}</span>
      </div>
      <ChevronRight size={16} className="text-gray-400" />
    </div>
  )
}

function ResearchItem({ item }) {
  return (
    <div className="card-action p-4 items-start text-left hover:scale-[1.02] transition-transform w-full">
      <div className="flex justify-between w-full mb-2">
        <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${item.status === 'Running' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{item.status}</span>
        <span className="text-xs font-mono text-gray-500">{item.amount}</span>
      </div>
      <h4 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">{item.title}</h4>
      <p className="text-xs text-gray-400">{item.org}</p>
    </div>
  )
}

function NotificationItem({ note }) {
  const colorClass = note.priority === 'high' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-gray-50 text-gray-700 border-gray-100'
  return (
    <div className={`w-full p-3 rounded-lg border text-sm font-medium text-left hover:shadow-sm cursor-pointer transition-all ${colorClass}`}>
      {note.message}
    </div>
  )
}

function AGIWidget({ faculty }) {
  const [insight, setInsight] = useState(null)

  useEffect(() => {
    // Demo Mock
    setTimeout(() => {
      setInsight({
        analysis: "Student engagement in 'Data Structures' dropped by 15% this week.",
        decision: "Schedule a review session covering 'Binary Trees'.",
        explanation: "Quiz scores correlated with attendance drop."
      })
    }, 1000)
  }, [])

  if (!insight) return <div className="card-animated h-48 animate-pulse bg-teal-50/50"></div>

  return (
    <div className="card-animated bg-gradient-to-b from-white to-teal-50 border-teal-200">
      <header className="flex flex-col items-center mb-4 text-center">
        <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white mb-2 shadow-lg shadow-teal-500/30">
          <Zap size={20} />
        </div>
        <h3 className="font-bold text-gray-900">AI Teaching Assistant</h3>
      </header>

      <div className="w-full bg-white p-4 rounded-xl border border-teal-100 shadow-sm text-center">
        <div className="mb-3">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">Insight</span>
          <p className="text-sm font-medium text-gray-800 mt-1">{insight.analysis}</p>
        </div>
        <div className="pt-3 border-t border-teal-50">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">Recommended Action</span>
          <p className="text-sm font-bold text-teal-800 mt-1">{insight.decision}</p>
        </div>
      </div>
    </div>
  )
}
