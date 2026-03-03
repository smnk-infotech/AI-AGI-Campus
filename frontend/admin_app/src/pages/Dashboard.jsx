import React, { useEffect, useState } from 'react'
import {
  Activity, Calendar, Shield, Server, Zap, ArrowUpRight, ArrowDownRight
} from 'lucide-react'
import api from '../services/api'

export default function Dashboard() {
  const [stats, setStats] = useState([])
  const [events, setEvents] = useState([])
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getDashboard()
        setStats(data.stats || [])
        setEvents(data.events || [])
        setAlerts(data.alerts || [])
      } catch (err) {
        console.error('Failed to fetch admin dashboard:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const getDateInfo = () => {
    const date = new Date()
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`
  }

  if (loading) return (
    <div className="w-full h-96 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="admin-dashboard w-full max-w-7xl mx-auto flex flex-col items-center gap-8">
      <div className="greeting-card w-full relative overflow-hidden rounded-3xl p-12 bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-700 shadow-2xl animate-fadeIn">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl -z-10"></div>
        <div className="relative z-10 flex flex-col items-center gap-6 text-center">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center text-4xl animate-wave border border-white/30">👋</div>
          <div>
            <h1 className="text-5xl font-black text-white mb-3 animate-slideInDown">{getGreeting()}, Administrator!</h1>
            <p className="text-xl text-teal-50/90 font-medium mb-4">Ready to optimize today's operations?</p>
            <p className="text-lg text-white/80 italic font-semibold max-w-2xl mx-auto leading-relaxed">"The best management is leading by example. Your decisions shape the future of this campus. 🎯"</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <div className="px-5 py-2.5 rounded-full bg-white/15 backdrop-blur-xl border border-white/30 text-white font-semibold text-sm flex items-center gap-2 hover:bg-white/25 transition-all duration-300 cursor-default"><Calendar size={18} />{getDateInfo()}</div>
            <div className="px-5 py-2.5 rounded-full bg-white/15 backdrop-blur-xl border border-white/30 text-white font-semibold text-sm flex items-center gap-2 hover:bg-white/25 transition-all duration-300 cursor-default"><Shield size={18} />Admin Control Panel</div>
          </div>
        </div>
      </div>

      <section className="dashboard-grid w-full animate-staggerIn grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.length ? stats.map((stat, index) => (
          <KPICard key={stat.label || index} stat={stat} index={index} />
        )) : (
          <div className="text-center text-gray-400 w-full col-span-full">No statistics available</div>
        )}
      </section>

      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="flex flex-col gap-6 animate-slideInLeft">
          <section className="card-modern-gradient w-full">
            <header className="flex flex-col items-center mb-8 w-full">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center text-white mb-4 border border-blue-400/50 shadow-lg shadow-blue-500/30 animate-float">
                <Server size={28} />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">System Health</h3>
            </header>

            <div className="w-full flex flex-col gap-3">
              <HealthMetric label="API Latency" value="24ms" status="excellent" />
              <HealthMetric label="Database" value="99.9%" status="excellent" />
              <HealthMetric label="Load" value="45%" status="good" />
            </div>
          </section>
        </div>

        <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
          <AGIWidget />
        </div>
      </div>
    </div>
  )
}

function KPICard({ stat = {}, index = 0 }) {
  const gradientList = [
    'from-rose-400 to-pink-500',
    'from-indigo-400 to-violet-500',
    'from-emerald-400 to-teal-500',
    'from-amber-400 to-orange-500'
  ]
  const gradient = gradientList[index % gradientList.length]

  const Icon = Activity

  return (
    <div className="kpi-card group p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:shadow-xl transition-all duration-300">
      <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center text-white mb-4 border border-white/50 shadow-lg`}> 
        <Icon size={24} />
      </div>
      <div className="metric-value text-3xl font-black text-transparent bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text mb-1">{stat.value ?? '—'}</div>
      <div className="metric-label text-gray-400 font-semibold text-sm">{stat.label ?? 'Metric'}</div>
      {typeof stat.trend === 'number' && (
        <div className={`mt-3 inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full ${stat.trend > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
          {stat.trend > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {Math.abs(stat.trend)}%
        </div>
      )}
    </div>
  )
}

function HealthMetric({ label, value, status }) {
  const statusColor = status === 'excellent' ? 'from-emerald-400 to-teal-500' : 'from-amber-400 to-orange-500'
  const bgColor = status === 'excellent' ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'
  const textColor = status === 'excellent' ? 'text-emerald-700' : 'text-amber-700'
  
  return (
    <div className={`health-metric group w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-300 hover:shadow-lg ${bgColor}`}>
      <span className={`text-sm font-semibold ${textColor}`}>{label}</span>
      <div className="flex items-center gap-3">
        <span className={`text-lg font-black bg-gradient-to-r ${statusColor} bg-clip-text text-transparent`}>{value}</span>
        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${statusColor} shadow-lg shadow-current/50 animate-statusPulse`}></div>
      </div>
    </div>
  )
}

function AGIWidget() {
  return (
    <div className="card-modern-gradient w-full bg-gradient-to-br from-slate-800 via-purple-900 to-slate-900 border-purple-500/40 hover:border-purple-400/60 transition-all duration-300 animate-slideInUp">
      <header className="flex flex-col items-center mb-6 text-center">
        <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-600 rounded-2xl flex items-center justify-center text-white mb-4 border border-amber-400/50 shadow-lg shadow-amber-500/30 animate-float">
          <Zap size={28} />
        </div>
        <h3 className="font-bold text-transparent bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-xl">Strategic Compass</h3>
      </header>
      <div className="w-full bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl p-5 rounded-xl border border-white/20 text-center hover:border-white/40 transition-all duration-300 group">
        <p className="text-sm text-amber-100/90 italic font-medium leading-relaxed">"Detected 12% increase in library usage. Suggest expanding bandwidth for Sector C."</p>
        <button className="mt-4 text-sm bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white px-6 py-2 rounded-full font-bold transition-all duration-300 shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/50 transform hover:scale-105">
          Simulate Impact
        </button>
      </div>
    </div>
  )
}
