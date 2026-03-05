const Admin = require("../Models/Admin");

const adminMiddleware = async (req, res, next) => {
  try {
    const clerkId = req.auth.userId;

    const admin = await Admin.findOne({ clerkId });

    if (!admin || !admin.isActive) {
      return res.status(403).json({
        message: "Access denied. Admin only."
      });
    }

    req.admin = admin;
    next();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = adminMiddleware;