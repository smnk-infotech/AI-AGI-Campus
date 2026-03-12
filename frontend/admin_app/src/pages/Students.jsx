import React, { useState, useEffect } from 'react'
import api from '../services/api'

export default function Students() {
  const [students, setStudents] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // New user state
  const [newUser, setNewUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    major: 'Computer Science',
    year: 1
  })

  async function loadStudents() {
    setLoading(true)
    try {
      const data = await api.getStudents()
      setStudents(data)
    } catch (e) {
      console.error('Failed to load students:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStudents()
  }, [])

  async function handleAddStudent(e) {
    e.preventDefault()
    try {
      await api.createUser({ ...newUser, role: 'student' })
      setShowModal(false)
      setNewUser({ first_name: '', last_name: '', email: '', major: 'Computer Science', year: 1 })
      loadStudents()
    } catch (e) {
      alert('Failed to add student: ' + e.message)
    }
  }

  return (
    <div className="page">
      <section className="card">
        <div className="section-header">
          <h3>Student Directory</h3>
          <button className="btn-secondary" onClick={() => setShowModal(true)}>Add Student</button>
        </div>
        
        {loading ? (
          <div className="p-4 muted">Loading student data...</div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>ID</th>
                  <th>Major</th>
                  <th>Year</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student.id}>
                    <td>{student.first_name} {student.last_name}</td>
                    <td><code style={{fontSize: '10px'}}>{student.id.split('-')[0]}...</code></td>
                    <td>{student.major}</td>
                    <td>Year {student.year}</td>
                    <td>{student.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Manual Add Modal */}
      {showModal && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', 
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '100%', maxWidth: 450, padding: 30 }}>
            <h3>Manual Student Enrollment</h3>
            <form onSubmit={handleAddStudent} style={{ display: 'flex', flexDirection: 'column', gap: 15, marginTop: 20 }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <input 
                  className="input" placeholder="First Name" required 
                  value={newUser.first_name} onChange={e => setNewUser({...newUser, first_name: e.target.value})}
                />
                <input 
                  className="input" placeholder="Last Name" required 
                  value={newUser.last_name} onChange={e => setNewUser({...newUser, last_name: e.target.value})}
                />
              </div>
              <input 
                className="input" type="email" placeholder="Student Email" required 
                value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})}
              />
              <div style={{ display: 'flex', gap: 10 }}>
                <input 
                  className="input" placeholder="Major" 
                  value={newUser.major} onChange={e => setNewUser({...newUser, major: e.target.value})}
                />
                <input 
                  className="input" type="number" placeholder="Year" 
                  value={newUser.year} onChange={e => setNewUser({...newUser, year: e.target.value})}
                />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Register Student</button>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
