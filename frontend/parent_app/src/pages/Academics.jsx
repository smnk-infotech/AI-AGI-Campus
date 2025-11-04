import React from 'react'

const academicSummary = [
  { id: 1, course: 'Mathematics', grade: 'A', teacher: 'Mr. Omar Hassan', trend: 'Steady' },
  { id: 2, course: 'Science', grade: 'A-', teacher: 'Ms. Priya Sharma', trend: 'Improving' },
  { id: 3, course: 'English', grade: 'B+', teacher: 'Ms. Emily Carter', trend: 'Focus on writing' }
]

const upcomingAssessments = [
  { id: 1, title: 'Math - Algebra Mastery Quiz', date: 'Nov 10', format: 'In-class', prep: 'Practice workbook sets 4 & 5' },
  { id: 2, title: 'Science - Lab Report Submission', date: 'Nov 15', format: 'Digital', prep: 'Upload to portal by 9 PM' }
]

export default function Academics() {
  return (
    <div className="page">
      <section className="page-section">
        <article className="card">
          <header className="section-header">
            <h3>Course Performance</h3>
          </header>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Teacher</th>
                  <th>Current Grade</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {academicSummary.map((course) => (
                  <tr key={course.id}>
                    <td className="table-primary">{course.course}</td>
                    <td>{course.teacher}</td>
                    <td><span className="badge neutral">{course.grade}</span></td>
                    <td>{course.trend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      <section className="page-section two-col">
        <article className="card">
          <header className="section-header">
            <h3>Upcoming Assessments</h3>
          </header>
          <ul className="list">
            {upcomingAssessments.map((assessment) => (
              <li key={assessment.id}>
                <div className="list-title">{assessment.title}</div>
                <div className="list-sub">{assessment.date} · {assessment.format}</div>
                <div className="muted small">Prep: {assessment.prep}</div>
              </li>
            ))}
          </ul>
        </article>

        <article className="card">
          <header className="section-header">
            <h3>Support Recommendations</h3>
          </header>
          <ul className="list">
            <li>Schedule 1:1 check-in with English teacher to review essay rubric.</li>
            <li>Encourage 20 minutes of daily reading with comprehension reflection.</li>
            <li>Enroll in Math reinforcement session on Thursdays at 4 PM.</li>
          </ul>
        </article>
      </section>
    </div>
  )
}
