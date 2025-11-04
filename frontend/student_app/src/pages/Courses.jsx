import React from 'react'

const courses = [
  {
    id: 1,
    title: 'Mathematics - Algebra II',
    instructor: 'Mr. Omar Hassan',
    credits: 3,
    progress: '89%',
    nextMilestone: 'Quiz · Nov 10'
  },
  {
    id: 2,
    title: 'Science - Robotics Lab',
    instructor: 'Dr. Maya Iyer',
    credits: 4,
    progress: '92%',
    nextMilestone: 'Prototype Demo · Nov 14'
  },
  {
    id: 3,
    title: 'English - World Literature',
    instructor: 'Ms. Emily Carter',
    credits: 3,
    progress: '85%',
    nextMilestone: 'Essay Draft · Nov 16'
  }
]

export default function Courses() {
  return (
    <div className="page">
      <section className="page-section">
        <article className="card">
          <header className="section-header">
            <h3>Current Courses</h3>
          </header>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Instructor</th>
                  <th>Credits</th>
                  <th>Progress</th>
                  <th>Next Milestone</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td className="table-primary">{course.title}</td>
                    <td>{course.instructor}</td>
                    <td>{course.credits}</td>
                    <td>
                      <span className="badge neutral">{course.progress}</span>
                    </td>
                    <td>{course.nextMilestone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </div>
  )
}
