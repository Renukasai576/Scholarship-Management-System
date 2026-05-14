import { useState, useEffect } from 'react';
import './AdminSupportTickets.css';

function AdminSupportTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [responseMessage, setResponseMessage] = useState('');
  const [respondingTo, setRespondingTo] = useState(null);
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0
  });

  // Fetch all tickets
  useEffect(() => {
    fetchTickets();
    fetchStats();
  }, [statusFilter, priorityFilter]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      let query = '/api/support-tickets/admin/all';
      const params = [];

      if (statusFilter !== 'all') params.push(`status=${statusFilter}`);
      if (priorityFilter !== 'all') params.push(`priority=${priorityFilter}`);

      if (params.length > 0) query += '?' + params.join('&');

      const response = await fetch(`http://localhost:5001${query}`);

      if (response.ok) {
        const data = await response.json();
        setTickets(data.tickets || []);
      } else {
        setError(`Failed to fetch tickets: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/support-tickets/admin/stats');

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Update ticket status
  const updateTicketStatus = async (ticketId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/support-tickets/admin/tickets/${ticketId}/status`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus })
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSelectedTicket(data.ticket);
        fetchTickets();
        fetchStats();
      } else {
        setError(`Failed to update status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setError(error.message);
    }
  };

  // Respond to ticket
  const handleRespond = async (e) => {
    e.preventDefault();
    if (!responseMessage.trim() || !respondingTo) return;

    try {
      const response = await fetch(
        `http://localhost:5001/api/support-tickets/admin/tickets/${respondingTo}/respond`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: responseMessage })
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSelectedTicket(data.ticket);
        setResponseMessage('');
        setRespondingTo(null);
        fetchTickets();
        fetchStats();
      } else {
        setError(`Failed to send response: ${response.status}`);
      }
    } catch (error) {
      console.error('Error responding to ticket:', error);
      setError(error.message);
    }
  };

  return (
    <div className="admin-support-tickets">
      {/* Header */}
      <div className="support-header">
        <h1>🎫 Support Tickets Management</h1>
        <p>Manage and respond to student support requests</p>
      </div>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-card">
          <span className="stat-icon">📊</span>
          <div>
            <p className="stat-label">Total Tickets</p>
            <p className="stat-value">{stats.totalTickets}</p>
          </div>
        </div>
        <div className="stat-card open">
          <span className="stat-icon">🔴</span>
          <div>
            <p className="stat-label">Open</p>
            <p className="stat-value">{stats.openTickets}</p>
          </div>
        </div>
        <div className="stat-card progress">
          <span className="stat-icon">⏳</span>
          <div>
            <p className="stat-label">In Progress</p>
            <p className="stat-value">{stats.inProgressTickets}</p>
          </div>
        </div>
        <div className="stat-card resolved">
          <span className="stat-icon">✅</span>
          <div>
            <p className="stat-label">Resolved</p>
            <p className="stat-value">{stats.resolvedTickets}</p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {/* Filters */}
      <div className="filters">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="tickets-container">
        {/* Tickets List */}
        <div className="tickets-list-panel">
          {loading ? (
            <div className="loading">Loading tickets...</div>
          ) : tickets.length === 0 ? (
            <div className="no-tickets">
              <p>📭 No tickets found</p>
            </div>
          ) : (
            <div className="tickets-list">
              {tickets.map(ticket => (
                <div
                  key={ticket._id}
                  className={`ticket-item ${selectedTicket?._id === ticket._id ? 'active' : ''}`}
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div className="ticket-list-header">
                    <h4>{ticket.subject}</h4>
                    <span className={`status-badge-small ${ticket.status}`}>
                      {ticket.status}
                    </span>
                  </div>
                  <p className="student-name">From: {ticket.studentName}</p>
                  <p className="issue-type">{ticket.issueType}</p>
                  <p className="message-preview">{ticket.message.substring(0, 60)}...</p>
                  <p className="ticket-date">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ticket Detail */}
        {selectedTicket && (
          <div className="ticket-detail-panel">
            <div className="detail-header">
              <h2>{selectedTicket.subject}</h2>
              <button
                className="btn-close"
                onClick={() => setSelectedTicket(null)}
              >
                ✕
              </button>
            </div>

            <div className="detail-content">
              {/* Student Info */}
              <div className="info-section">
                <h3>Student Information</h3>
                <p><strong>Name:</strong> {selectedTicket.studentName}</p>
                <p><strong>Email:</strong> {selectedTicket.studentEmail}</p>
                <p><strong>Student ID:</strong> {selectedTicket.studentId}</p>
              </div>

              {/* Ticket Info */}
              <div className="info-section">
                <h3>Ticket Details</h3>
                <p>
                  <strong>Issue Type:</strong> {selectedTicket.issueType}
                </p>
                <p>
                  <strong>Status:</strong>
                  <select
                    value={selectedTicket.status}
                    onChange={(e) => updateTicketStatus(selectedTicket._id, e.target.value)}
                    className="status-select"
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </p>
                <p>
                  <strong>Priority:</strong> {selectedTicket.priority}
                </p>
                <p>
                  <strong>Created:</strong> {new Date(selectedTicket.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Student Message */}
              <div className="info-section message-section">
                <h3>Student Message</h3>
                <div className="message-box">
                  {selectedTicket.message}
                </div>
              </div>

              {/* Admin Response */}
              {selectedTicket.adminResponse ? (
                <div className="info-section response-section">
                  <h3>✓ Admin Response</h3>
                  <div className="response-info">
                    <p>
                      <strong>Responded by:</strong> {selectedTicket.adminResponse.respondedBy}
                    </p>
                    <p>
                      <strong>Date:</strong> {new Date(selectedTicket.adminResponse.respondedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="message-box response-box">
                    {selectedTicket.adminResponse.message}
                  </div>
                  <button
                    className="btn-edit-response"
                    onClick={() => setRespondingTo(selectedTicket._id)}
                  >
                    ✏️ Edit Response
                  </button>
                </div>
              ) : (
                <div className="info-section">
                  <p className="no-response">No response yet</p>
                </div>
              )}

              {/* Response Form */}
              {respondingTo === selectedTicket._id && (
                <form className="response-form" onSubmit={handleRespond}>
                  <h3>Send Response to Student</h3>
                  <textarea
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
                    placeholder="Type your response here..."
                    rows="6"
                    required
                  ></textarea>
                  <div className="form-buttons">
                    <button type="submit" className="btn-send">
                      Send Response
                    </button>
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => setRespondingTo(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {!respondingTo && !selectedTicket.adminResponse && (
                <button
                  className="btn-respond"
                  onClick={() => setRespondingTo(selectedTicket._id)}
                >
                  💬 Respond to Student
                </button>
              )}
            </div>
          </div>
        )}

        {!selectedTicket && (
          <div className="no-selection">
            <p>👈 Select a ticket to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminSupportTickets;
