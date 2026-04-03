const SupportTicket = require("../Models/SupportTicket");

// ✅ Student: Create Support Ticket
exports.createTicket = async (req, res) => {
  try {
    const { name, email, issueType, message } = req.body;
    const studentId = req.auth.userId;

    if (!name || !email || !issueType || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newTicket = new SupportTicket({
      studentId,
      studentEmail: email,
      studentName: name,
      issueType,
      subject: `${issueType.charAt(0).toUpperCase() + issueType.slice(1)} Issue`,
      message,
      status: "open",
      priority: issueType === "status" ? "high" : "medium"
    });

    await newTicket.save();
    res.status(201).json({
      success: true,
      message: "Support ticket created successfully",
      ticket: newTicket
    });
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Student: Get My Tickets
exports.getMyTickets = async (req, res) => {
  try {
    const studentId = req.auth.userId;
    
    const tickets = await SupportTicket.find({ studentId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      tickets
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Student: Get Single Ticket
exports.getTicketById = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const studentId = req.auth.userId;

    const ticket = await SupportTicket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    // ✅ Check if ticket belongs to student
    if (ticket.studentId !== studentId) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    res.status(200).json({
      success: true,
      ticket
    });
  } catch (error) {
    console.error("Error fetching ticket:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Admin: Get All Tickets
exports.getAllTickets = async (req, res) => {
  try {
    const { status, issueType, priority } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (issueType) query.issueType = issueType;
    if (priority) query.priority = priority;

    const tickets = await SupportTicket.find(query)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tickets.length,
      tickets
    });
  } catch (error) {
    console.error("Error fetching all tickets:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Admin: Update Ticket Status
exports.updateTicketStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status, priority } = req.body;

    if (!["open", "in-progress", "resolved", "closed"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const ticket = await SupportTicket.findByIdAndUpdate(
      ticketId,
      { 
        status,
        ...(priority && { priority }),
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    res.status(200).json({
      success: true,
      message: "Ticket status updated",
      ticket
    });
  } catch (error) {
    console.error("Error updating ticket status:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Admin: Respond to Ticket
exports.respondToTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { message } = req.body;
    const adminName = req.auth?.user?.firstName || "Admin";

    if (!message) {
      return res.status(400).json({ error: "Response message is required" });
    }

    const ticket = await SupportTicket.findByIdAndUpdate(
      ticketId,
      {
        adminResponse: {
          message,
          respondedBy: adminName,
          respondedAt: new Date()
        },
        status: "in-progress",
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    res.status(200).json({
      success: true,
      message: "Response sent to student",
      ticket
    });
  } catch (error) {
    console.error("Error responding to ticket:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Admin: Get Ticket Stats
exports.getTicketStats = async (req, res) => {
  try {
    const totalTickets = await SupportTicket.countDocuments();
    const openTickets = await SupportTicket.countDocuments({ status: "open" });
    const resolvedTickets = await SupportTicket.countDocuments({ status: "resolved" });
    const inProgressTickets = await SupportTicket.countDocuments({ status: "in-progress" });

    res.status(200).json({
      success: true,
      stats: {
        totalTickets,
        openTickets,
        inProgressTickets,
        resolvedTickets
      }
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Student: Close Ticket
exports.closeTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const studentId = req.auth.userId;

    const ticket = await SupportTicket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    if (ticket.studentId !== studentId) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    ticket.status = "closed";
    ticket.updatedAt = Date.now();
    await ticket.save();

    res.status(200).json({
      success: true,
      message: "Ticket closed",
      ticket
    });
  } catch (error) {
    console.error("Error closing ticket:", error);
    res.status(500).json({ error: error.message });
  }
};
