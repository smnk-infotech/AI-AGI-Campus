import React, { useState, useEffect } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8001'

export default function Courses({ student }) {
  const [myCourses, setMyCourses] = useState([])
  const [allCourses, setAllCourses] = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    if (!student) return
    setLoading(true)
    try {
      const [my, all] = await Promise.all([
        fetch(`${API_BASE}/api/courses/my/${student.id}`).then(r => r.json()),
        fetch(`${API_BASE}/api/courses/`).then(r => r.json())
      ])
      setMyCourses(my || [])
      setAllCourses(all || [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [student])

  async function enroll(courseId) {
    if (!student) return
    try {
      const res = await fetch(`${API_BASE}/api/courses/${courseId}/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: student.id })
      })
      if (res.ok) {
        alert("Enrolled!")
        load()
      } else {
        const d = await res.json()
        alert(d.message || "Failed")
      }
    } catch (e) { console.error(e) }
  }

  // Filter out already enrolled courses from "Available"
  const available = allCourses.filter(c => !myCourses.find(m => m.id === c.id))

  if (!student) return <div className="py-8 text-center text-gray-500">Please log in to view courses.</div>

  return (
    <div className="space-y-8">
      <section>
        <header className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">My Courses</h3>
        </header>
        <div className="card-animated fade-in-up" style={{ animationDelay: '0.1s' }}>
          <ul className="space-y-4">
            {myCourses.map((c, i) => (
              <li key={c.id} className="border-b border-gray-100 pb-4 last:border-b-0 hover:bg-slate-50 p-2 rounded-lg transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">{c.name}</div>
                    <div className="text-gray-600 text-sm mt-1">{c.description}</div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium border border-green-200">{c.code}</span>
                </div>
              </li>
            ))}
            {myCourses.length === 0 && <div className="text-gray-500 py-8 text-center italic">You are not enrolled in any courses.</div>}
          </ul>
        </div>
      </section>

      <section>
        <header className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Available Courses</h3>
        </header>
        <div className="card-animated fade-in-up" style={{ animationDelay: '0.2s' }}>
          <ul className="space-y-4">
            {available.map((c, i) => (
              <li key={c.id} className="border-b border-gray-100 pb-4 last:border-b-0 hover:bg-slate-50 p-2 rounded-lg transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{c.name}</div>
                    <div className="text-gray-600 text-sm mt-1">{c.description}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium border border-cyan-200">{c.code}</span>
                    <button className="btn btn-primary" onClick={() => enroll(c.id)}>Enroll</button>
                  </div>
                </div>
              </li>
            ))}
            {!loading && available.length === 0 && <div className="text-gray-500 py-8 text-center italic">No other courses available.</div>}
          </ul>
        </div>
      </section>
    </div>
  )
}
