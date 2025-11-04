import React from 'react'

const messages = [
  {
    id: 1,
    sender: 'Ms. Priya Sharma',
    subject: 'Science Lab Preparation',
    preview: 'Please remind Aarav to bring the robotics kit for the Tuesday lab.',
    time: 'Nov 3, 9:12 AM'
  },
  {
    id: 2,
    sender: 'Counseling Office',
    subject: 'Wellness Check-in',
    preview: 'We are hosting small group sessions on growth mindset next week.',
    time: 'Nov 2, 4:35 PM'
  }
]

const announcements = [
  { id: 1, title: 'Field Trip Consent Due', detail: 'Submit signed consent form for the science museum visit by Nov 6.' },
  { id: 2, title: 'Winter Break Camp', detail: 'Registration for STEAM Winter Camp closes Nov 20.' }
]

export default function Communication() {
  return (
    <div className="page">
      <section className="page-section two-col">
        <article className="card">
          <header className="section-header">
            <h3>Messages</h3>
            <span className="muted small">Reply via mobile app or email.</span>
          </header>
          <ul className="list">
            {messages.map((message) => (
              <li key={message.id}>
                <div className="list-title">{message.subject}</div>
                <div className="list-sub">{message.sender}</div>
                <div className="muted small">{message.preview}</div>
                <div className="muted tiny">{message.time}</div>
              </li>
            ))}
          </ul>
        </article>

        <article className="card">
          <header className="section-header">
            <h3>Announcements</h3>
          </header>
          <ul className="list">
            {announcements.map((announcement) => (
              <li key={announcement.id}>
                <div className="list-title">{announcement.title}</div>
                <div className="muted small">{announcement.detail}</div>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  )
}
