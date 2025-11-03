import React from 'react'

function Hero(){
  return (
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-content">
          <h1>Modern school management with intelligent automation</h1>
          <p className="lead">An all-in-one platform for administrators, faculty, students and parents — attendance, grading, communication and analytics powered by AI.</p>
          <div className="hero-ctas">
            <a className="btn btn-primary" href="/contact">Request a demo</a>
            <a className="btn btn-ghost" href="/features">Explore features</a>
          </div>
        </div>
        <div className="hero-visual" aria-hidden>
          <div className="mock-window">
            <div className="mock-header"></div>
            <div className="mock-body">
              <div className="mock-stats">
                <div className="mstat"><strong>1,248</strong><div>Students</div></div>
                <div className="mstat"><strong>92%</strong><div>Avg Attendance</div></div>
                <div className="mstat"><strong>78</strong><div>Teachers</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Features(){
  const items = [
    {title:'Unified Dashboard', text:'Single pane of glass for school operations — attendance, grading, payroll and reports.'},
    {title:'AI Insights', text:'Predict student outcomes, spot at-risk students, and automate routine tasks.'},
    {title:'Parent & Student Portals', text:'Secure, role-based portals for communication and progress tracking.'},
    {title:'Schedules & Exams', text:'Timetables, exam scheduling and automatic grading workflows.'},
  ]

  return (
    <section id="features" className="section container">
      <h2>Features that scale with your school</h2>
      <p className="muted">Everything you need to run academic and administrative operations efficiently.</p>
      <div className="features-grid">
        {items.map((it, i)=> (
          <div key={i} className="card feature-card">
            <h3>{it.title}</h3>
            <p className="muted">{it.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Stats(){
  const stats = [
    {label:'Students', value:'1,248'},
    {label:'Teachers', value:'78'},
    {label:'Campuses', value:'6'},
    {label:'Countries', value:'2'},
  ]
  return (
    <section className="section stats container">
      {stats.map((s,i)=> (
        <div key={i} className="stat">
          <div className="stat-value">{s.value}</div>
          <div className="stat-label muted">{s.label}</div>
        </div>
      ))}
    </section>
  )
}

function Testimonials(){
  const items = [
    {name:'Principal R. Sharma', quote:'AI‑AGI Campus helped us reduce administrative overhead by 60% and improved parent engagement.'},
    {name:'Ms. K. Patel', quote:'Analytics helped identify students who needed early interventions — results improved.'},
  ]
  return (
    <section className="section container">
      <h2>Trusted by schools</h2>
      <div className="testimonials">
        {items.map((t,i)=> (
          <blockquote key={i} className="card testimonial">
            <p>"{t.quote}"</p>
            <footer className="muted">— {t.name}</footer>
          </blockquote>
        ))}
      </div>
    </section>
  )
}

export default function Home(){
  return (
    <>
      <Hero />
      <Features />
      <Stats />
      <Testimonials />
    </>
  )
}
