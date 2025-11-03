import React, { useState } from 'react'

export default function Contact(){
  const [form, setForm] = useState({name:'', email:'', school:'', message:''})
  const [status, setStatus] = useState('')

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value})
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setStatus('Submitting...')
    
    // Simulate API call
    setTimeout(() => {
      setStatus('Thank you! We will contact you within 24 hours.')
      setForm({name:'', email:'', school:'', message:''})
    }, 1000)
  }

  return (
    <div className="page-content container">
      <h1>Contact Us</h1>
      <p className="lead">Get in touch with our team — we're here to help.</p>

      <div className="contact-layout">
        <section className="card contact-form">
          <h2>Request a Demo</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name *</label>
              <input 
                type="text" 
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                required 
                placeholder="Your full name"
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input 
                type="email" 
                name="email" 
                value={form.email} 
                onChange={handleChange} 
                required 
                placeholder="you@school.edu"
              />
            </div>

            <div className="form-group">
              <label>School / Institution</label>
              <input 
                type="text" 
                name="school" 
                value={form.school} 
                onChange={handleChange} 
                placeholder="School name"
              />
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea 
                name="message" 
                value={form.message} 
                onChange={handleChange} 
                rows="4"
                placeholder="Tell us about your needs..."
              />
            </div>

            <button type="submit" className="btn btn-primary">Send Message</button>
            {status && <p className="status-message">{status}</p>}
          </form>
        </section>

        <aside className="contact-info">
          <section className="card">
            <h3>Sales</h3>
            <p>Email: <a href="mailto:sales@ai-agi-campus.com">sales@ai-agi-campus.com</a></p>
            <p>Phone: +1 (555) 123-4567</p>
          </section>

          <section className="card">
            <h3>Support</h3>
            <p>Email: <a href="mailto:support@ai-agi-campus.com">support@ai-agi-campus.com</a></p>
            <p>Knowledge Base: <a href="/docs">docs.ai-agi-campus.com</a></p>
          </section>

          <section className="card">
            <h3>Office</h3>
            <p>123 Education Drive<br/>Tech City, TC 12345<br/>United States</p>
          </section>
        </aside>
      </div>
    </div>
  )
}
