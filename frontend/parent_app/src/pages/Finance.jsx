import React from 'react'

const invoices = [
  { id: 1, description: 'Term 2 Tuition', amount: '₹48,000', dueDate: 'Nov 20, 2025', status: 'Pending' },
  { id: 2, description: 'Robotics Lab Fee', amount: '₹4,500', dueDate: 'Paid Oct 15, 2025', status: 'Paid' }
]

const paymentMethods = [
  { id: 1, type: 'Credit Card', details: '•••• 8824 · Expires 12/26', default: true },
  { id: 2, type: 'UPI', details: 'aarav.parent@upi', default: false }
]

export default function Finance() {
  return (
    <div className="page">
      <section className="page-section">
        <article className="card">
          <header className="section-header">
            <h3>Invoices</h3>
            <span className="muted small">Keep your payments up to date to maintain enrollment status.</span>
          </header>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="table-primary">{invoice.description}</td>
                    <td>{invoice.amount}</td>
                    <td>{invoice.dueDate}</td>
                    <td>
                      <span className={invoice.status === 'Paid' ? 'badge success' : 'badge neutral'}>
                        {invoice.status}
                      </span>
                    </td>
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
            <h3>Saved Payment Methods</h3>
          </header>
          <ul className="list">
            {paymentMethods.map((method) => (
              <li key={method.id}>
                <div className="list-title">{method.type}</div>
                <div className="muted small">{method.details}</div>
                {method.default ? <span className="badge success">Default</span> : null}
              </li>
            ))}
          </ul>
        </article>

        <article className="card">
          <header className="section-header">
            <h3>Support</h3>
          </header>
          <p className="muted small">For billing questions contact <strong>finance@aiagicampus.com</strong> or call +91 80 1234 5678.</p>
          <p className="muted small">Payment receipts are available in the mobile app under Documents.</p>
        </article>
      </section>
    </div>
  )
}
