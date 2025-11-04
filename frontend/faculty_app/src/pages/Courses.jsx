import React from 'react'

const courses = [
  {
    id: 1,
    name: 'Physics - Mechanics',
    code: 'PHY101',
    section: 'A2',
    room: 'Science A201',
    modality: 'In-Person',
    enrollment: 36,
    ta: 'Jordan Lee'
  },
  {
    id: 2,
    name: 'Mathematics - Linear Algebra',
    code: 'MTH240',
    section: 'B1',
    room: 'Math B102',
    modality: 'Hybrid',
    enrollment: 42,
    ta: 'Emma Rodriguez'
  },
  {
    id: 3,
    name: 'Computer Science - Algorithms',
    code: 'CSE330',
    section: 'C3',
    room: 'Innovation Lab 3',
    modality: 'Online',
    enrollment: 28,
    ta: 'Priya Patel'
  }
]

export default function Courses() {
  return (
    <div className="page">
      <section className="page-section">
        <div className="card">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Code</th>
                  <th>Section</th>
                  <th>Room</th>
                  <th>Modality</th>
                  <th>Enrollment</th>
                  <th>Teaching Assistant</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td>
                      <div className="table-primary">{course.name}</div>
                    </td>
                    <td>{course.code}</td>
                    <td>{course.section}</td>
                    <td>{course.room}</td>
                    <td>
                      <span className="badge neutral">{course.modality}</span>
                    </td>
                    <td>{course.enrollment}</td>
                    <td>{course.ta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}
