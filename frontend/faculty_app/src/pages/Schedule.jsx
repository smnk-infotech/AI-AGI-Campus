import React, { useEffect, useState } from 'react'

export default function Schedule({ faculty }) {
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!faculty) return
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:8001/api/faculty/${faculty.id}/dashboard`)
        if (res.ok) {
          const data = await res.json()
          const courses = data.courses || []

          // Parse "Mon/Wed 10:00 AM" -> Mon: 10AM, Wed: 10AM
          const daysMap = { 'Mon': 'Monday', 'Tue': 'Tuesday', 'Wed': 'Wednesday', 'Thu': 'Thursday', 'Fri': 'Friday' }
          const week = { 'Monday': [], 'Tuesday': [], 'Wednesday': [], 'Thursday': [], 'Friday': [] }

          courses.forEach(c => {
            if (!c.schedule || c.schedule === 'TBD') return
            // Split "Mon/Wed 10:00 AM" -> ["Mon/Wed", "10:00", "AM"]
            const parts = c.schedule.split(' ')
            if (parts.length < 2) return

            const daysPart = parts[0] // Mon or Mon/Wed
            const timePart = parts.slice(1).join(' ') // 10:00 AM

            const days = daysPart.split('/')
            days.forEach(d => {
              const cleanDay = d.trim()
              const fullDay = daysMap[cleanDay]
              if (fullDay && week[fullDay]) {
                week[fullDay].push({
                  title: c.title,
                  code: c.code,
                  time: timePart,
                  location: c.location || "TBD"
                })
              }
            })
          })

          // Sort by time (simple filtered sort)
          Object.keys(week).forEach(d => {
            week[d].sort((a, b) => a.time.localeCompare(b.time))
          })

          const builtSchedule = Object.keys(week).map(d => ({
            day: d,
            sessions: week[d]
          }))

          setSchedule(builtSchedule)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [faculty])

  if (loading) return <div className="page"><div className="p-4">Loading schedule...</div></div>

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
              {day.sessions.map((session, idx) => (
                <li key={`${day.day}-${idx}`}>
                  <div className="list-title">{session.title}</div>
                  <div className="list-sub">{session.time}</div>
                  <div className="muted small">{session.location}</div>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </div>
  )
}
