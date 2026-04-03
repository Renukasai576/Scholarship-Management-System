const express = require("express");
const router = express.Router();
const { requireAuth } = require("@clerk/express");
const supportTicketController = require("../Controllers/SupportTicketController");

// ✅ Middleware to ensure user is authenticated
const authMiddleware = requireAuth();

// ========== Admin Routes (BEFORE dynamic routes) ==========
// Get ticket stats (admin only)
router.get("/admin/stats", supportTicketController.getTicketStats);

// Get all tickets (admin only)
router.get("/admin/all", supportTicketController.getAllTickets);

// Update ticket status (admin only)
router.patch("/admin/tickets/:ticketId/status", supportTicketController.updateTicketStatus);

// Respond to ticket (admin only)
router.post("/admin/tickets/:ticketId/respond", supportTicketController.respondToTicket);

// ========== Student Routes ==========
// Create support ticket
router.post("/", authMiddleware, supportTicketController.createTicket);

// Get my tickets
router.get("/my-tickets", authMiddleware, supportTicketController.getMyTickets);

// Get single ticket
router.get("/:ticketId", authMiddleware, supportTicketController.getTicketById);

// Close ticket
router.patch("/:ticketId/close", authMiddleware, supportTicketController.closeTicket);

module.exports = router;
