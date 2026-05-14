import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import './StudentServices.css';

function StudentServices() {
  const { isLoaded, userId, getToken } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [activeTab, setActiveTab] = useState('help'); // 'help' or 'tickets'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    issue: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [myTickets, setMyTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [ticketsError, setTicketsError] = useState(null);

  // FAQs data
  const faqs = [
    {
      id: 1,
      question: 'How to apply?',
      answer: 'To apply for scholarships, navigate to the Scholarships section, browse available scholarships, and click "Apply Now". Fill out the required information including personal details and academic records.'
    },
    {
      id: 2,
      question: 'Documents needed?',
      answer: 'You will typically need: Academic transcripts, ID proof, proof of income, essays or personal statements, and letters of recommendation. Specific requirements may vary by scholarship.'
    },
    {
      id: 3,
      question: 'When is the deadline?',
      answer: 'Deadlines vary by scholarship. Check the detailed scholarship page for specific application deadlines. We recommend applying well before the deadline.'
    },
    {
      id: 4,
      question: 'How long does the review process take?',
      answer: 'The review process typically takes 2-4 weeks. You can track your application status on your dashboard.'
    }
  ];

  // Common issues data
  const commonIssues = [
    {
      title: 'Unable to upload documents',
      solution: 'Ensure files are in PDF or JPG format and less than 5MB. Try refreshing the page and uploading again.'
    },
    {
      title: 'Application status stuck',
      solution: 'Wait 24 hours for the system to update. If still stuck, contact support with your application ID.'
    },
    {
      title: 'Password reset issues',
      solution: 'Check your email spam folder. If you don\'t receive the reset link, use the "Can\'t log in?" option on the login page.'
    },
    {
      title: 'Profile not saving',
      solution: 'Ensure all required fields are filled. Try logging out and logging back in. Clear browser cache if problem persists.'
    }
  ];

  // Step-by-step guide
  const steps = [
    {
      number: 1,
      title: 'Create Account',
      description: 'Sign up with your email and create a secure password'
    },
    {
      number: 2,
      title: 'Complete Profile',
      description: 'Fill in your personal and academic information'
    },
    {
      number: 3,
      title: 'Browse Scholarships',
      description: 'Explore available scholarships matching your profile'
    },
    {
      number: 4,
      title: 'Submit Application',
      description: 'Apply with required documents and personal statement'
    },
    {
      number: 5,
      title: 'Track Status',
      description: 'Monitor your application progress on the dashboard'
    }
  ];

  // ✅ Fetch my tickets
  useEffect(() => {
    if (isLoaded && userId && activeTab === 'tickets') {
      fetchMyTickets();
    }
  }, [isLoaded, userId, activeTab]);

  const fetchMyTickets = async () => {
    try {
      setTicketsLoading(true);
      setTicketsError(null);
      const token = await getToken();
      const response = await fetch('https://scholarship-management-system-runz.onrender.com/api/support-tickets/my-tickets', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMyTickets(data.tickets || []);
      } else {
        setTicketsError(`Failed to fetch tickets: ${response.status}`);
        console.error('Failed to fetch tickets:', response.status);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setTicketsError(error.message);
    } finally {
      setTicketsLoading(false);
    }
  };

  // ✅ Get auth token

  // Filter FAQs based on search
  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredIssues = commonIssues.filter(issue =>
    issue.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle FAQ expansion
  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  // Handle form input
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.issue && formData.message) {
      try {
        setLoading(true);
        setFormError(null);
        const token = await getToken();
        const response = await fetch('https://scholarship-management-system-runz.onrender.com/api/support-tickets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            issueType: formData.issue,
            message: formData.message
          })
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Ticket created:', data.ticket);
          setFormSubmitted(true);
          setFormData({ name: '', email: '', issue: '', message: '' });
          setTimeout(() => setFormSubmitted(false), 3000);
          // Refresh tickets
          fetchMyTickets();
        } else {
          const errorMsg = `Failed to create ticket: ${response.status}`;
          setFormError(errorMsg);
          console.error(errorMsg);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        setFormError(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // Close ticket
  const handleCloseTicket = async (ticketId) => {
    try {
      const token = await getToken();
      const response = await fetch(`https://scholarship-management-system-runz.onrender.com/api/support-tickets/${ticketId}/close`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchMyTickets();
        setSelectedTicket(null);
      } else {
        console.error('Error closing ticket:', response.status);
      }
    } catch (error) {
      console.error('Error closing ticket:', error);
    }
  };

  return (
    <div className="student-services">
      {/* Header */}
      <div className="services-header">
        <h1>🆘 Student Help Desk</h1>
        <p>Find answers and get support for your scholarship journey</p>
      </div>

      {/* Tab Navigation */}
      <div className="tab-nav">
        <button
          className={`tab-btn ${activeTab === 'help' ? 'active' : ''}`}
          onClick={() => setActiveTab('help')}
        >
          📚 Help & FAQs
        </button>
        <button
          className={`tab-btn ${activeTab === 'tickets' ? 'active' : ''}`}
          onClick={() => setActiveTab('tickets')}
        >
          🎫 My Support Tickets ({myTickets.length})
        </button>
      </div>

      {/* Help Tab */}
      {activeTab === 'help' && (
        <>
          {/* Search Bar */}
          <div className="search-section">
            <div className="search-container">
              <input
                type="text"
                className="search-bar"
                placeholder="🔍 Search your issue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="services-content">
            {/* Left Column */}
            <div className="left-column">
              {/* FAQs Section */}
              <section className="section faq-section">
                <h2>❓ Frequently Asked Questions</h2>
                <div className="faqs">
                  {filteredFAQs.map(faq => (
                    <div key={faq.id} className="faq-item">
                      <div
                        className={`faq-question ${expandedFAQ === faq.id ? 'expanded' : ''}`}
                        onClick={() => toggleFAQ(faq.id)}
                      >
                        <span className="faq-icon">{expandedFAQ === faq.id ? '▼' : '▶'}</span>
                        <h3>{faq.question}</h3>
                      </div>
                      {expandedFAQ === faq.id && (
                        <div className="faq-answer">
                          <p>{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Common Issues */}
              <section className="section issues-section">
                <h2>📂 Common Issues</h2>
                <div className="issues">
                  {filteredIssues.map((issue, index) => (
                    <div key={index} className="issue-card">
                      <h3>{issue.title}</h3>
                      <p>{issue.solution}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="right-column">
              {/* How It Works */}
              <section className="section how-it-works">
                <h2>🧭 How It Works</h2>
                <div className="steps">
                  {steps.map(step => (
                    <div key={step.number} className="step">
                      <div className="step-number">{step.number}</div>
                      <div className="step-content">
                        <h3>{step.title}</h3>
                        <p>{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Contact Form */}
              <section className="section contact-section">
                <h2>📩 Still Need Help?</h2>
                <p className="contact-subtitle">Contact our support team</p>
                
                {formSubmitted && (
                  <div className="success-message">
                    ✓ Message sent successfully! We'll get back to you soon.
                  </div>
                )}

                {formError && (
                  <div className="error-message">
                    ⚠️ {formError}
                  </div>
                )}

                <form className="contact-form" onSubmit={handleFormSubmit}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                  />
                  <select
                    name="issue"
                    value={formData.issue}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">Select issue type...</option>
                    <option value="application">Application Issue</option>
                    <option value="account">Account Issue</option>
                    <option value="document">Document Upload</option>
                    <option value="status">Status Inquiry</option>
                    <option value="other">Other</option>
                  </select>
                  <textarea
                    name="message"
                    placeholder="Describe your issue..."
                    rows="5"
                    value={formData.message}
                    onChange={handleFormChange}
                    required
                  ></textarea>
                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Support Request'}
                  </button>
                </form>
              </section>
            </div>
          </div>
        </>
      )}

      {/* Tickets Tab */}
      {activeTab === 'tickets' && (
        <div className="tickets-section">
          {ticketsError && (
            <div className="error-message">
              ⚠️ {ticketsError}
            </div>
          )}
          {ticketsLoading ? (
            <div className="loading">Loading your support tickets...</div>
          ) : myTickets.length === 0 ? (
            <div className="no-tickets">
              <p>📭 You haven't submitted any support tickets yet.</p>
              <button onClick={() => setActiveTab('help')} className="btn-link">
                Go back to submit a ticket
              </button>
            </div>
          ) : (
            <div className="tickets-grid">
              {!selectedTicket ? (
                <div className="tickets-list">
                  {myTickets.map(ticket => (
                    <div
                      key={ticket._id}
                      className={`ticket-card ${ticket.status}`}
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <div className="ticket-header">
                        <h3>{ticket.subject}</h3>
                        <span className={`status-badge ${ticket.status}`}>
                          {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                        </span>
                      </div>
                      <p className="ticket-type">
                        <strong>Issue Type:</strong> {ticket.issueType}
                      </p>
                      <p className="ticket-preview">{ticket.message.substring(0, 100)}...</p>
                      <p className="ticket-date">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </p>
                      {ticket.adminResponse && (
                        <div className="admin-response-indicator">
                          ✓ Admin has responded
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="ticket-detail">
                  <button
                    className="btn-back"
                    onClick={() => setSelectedTicket(null)}
                  >
                    ← Back to tickets
                  </button>

                  <div className="ticket-info">
                    <h2>{selectedTicket.subject}</h2>
                    <div className="ticket-meta">
                      <span className={`status-badge ${selectedTicket.status}`}>
                        {selectedTicket.status.toUpperCase()}
                      </span>
                      <span className="priority-badge">
                        Priority: {selectedTicket.priority.toUpperCase()}
                      </span>
                      <span className="date">
                        {new Date(selectedTicket.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="ticket-content">
                      <h3>Your Issue</h3>
                      <p>{selectedTicket.message}</p>
                    </div>

                    {selectedTicket.adminResponse && (
                      <div className="admin-response">
                        <h3>🤝 Admin Response</h3>
                        <div className="response-header">
                          <strong>Responded by: {selectedTicket.adminResponse.respondedBy}</strong>
                          <span>
                            {new Date(selectedTicket.adminResponse.respondedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p>{selectedTicket.adminResponse.message}</p>
                      </div>
                    )}

                    {selectedTicket.status !== 'closed' && (
                      <button
                        className="btn-close-ticket"
                        onClick={() => handleCloseTicket(selectedTicket._id)}
                      >
                        ✓ Close Ticket
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default StudentServices;