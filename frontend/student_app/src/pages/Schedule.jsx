import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function Schedule({ student }) {
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!student) return
    const fetchData = async () => {
      try {
        const data = await api.getDashboard(student.id)
        const courses = data.schedule || []

        const daysMap = { 'Mon': 'Monday', 'Tue': 'Tuesday', 'Wed': 'Wednesday', 'Thu': 'Thursday', 'Fri': 'Friday' }
        const week = { 'Monday': [], 'Tuesday': [], 'Wednesday': [], 'Thursday': [], 'Friday': [] }

        courses.forEach(c => {
          if (!c.time || c.time === 'TBD') {
            return
          }
          const parts = c.time.split(' ')
          if (parts.length < 2) return

          const daysPart = parts[0]
          const timePart = parts.slice(1).join(' ')

          const days = daysPart.split('/')
          days.forEach(d => {
            const cleanDay = d.trim()
            const fullDay = daysMap[cleanDay]
            if (fullDay && week[fullDay]) {
              week[fullDay].push({
                title: c.subject,
                time: timePart,
                location: c.location || "TBD"
              })
            }
          })
        })

        Object.keys(week).forEach(d => {
          week[d].sort((a, b) => a.time.localeCompare(b.time))
        })

        const builtSchedule = Object.keys(week).map(d => ({
          day: d,
          sessions: week[d]
        }))

        setSchedule(builtSchedule)
      } catch (e) {
        console.error('Failed to fetch schedule:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [student])

  if (loading) return <div className="page"><div className="p-4">Loading schedule...</div></div>

  const isEmpty = schedule.every(d => d.sessions.length === 0)

  return (
    <div className="page">
      <section className="page-section grid-auto">
        {schedule.map((day) => (
          <article key={day.day} className="card">
            <header className="section-header">
              <h3>{day.day}</h3>
            </header>
            <ul className="list">
              {day.sessions.length === 0 && <li className="p-2 muted tiny">No classes</li>}
              {day.sessions.map((block, idx) => (
                <li key={`${day.day}-${idx}`}>
                  <div className="list-title">{block.title}</div>
                  <div className="list-sub">{block.time}</div>
                  <div className="muted tiny">{block.location}</div>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      {isEmpty && (
        <section className="page-section" style={{ marginTop: '20px' }}>
          <div className="card p-4">
            <h4>Debug: Unscheduled Courses</h4>
            <p className="muted small">If you see courses here, the day parsing failed. If raw data is empty, check assignment.</p>
            <p className="muted">No schedule data likely found for this user.</p>
          </div>
        </section>
      )}
    </div>
  )
}
