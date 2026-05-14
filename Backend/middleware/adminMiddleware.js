const Admin = require("../Models/Admin");

const adminMiddleware = async (req, res, next) => {
  try {

    // ✅ FIXED
    const clerkId = req.auth?.userId;

    console.log("🔑 Logged in Clerk ID:", clerkId);

    if (!clerkId) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    const admin = await Admin.findOne({ clerkId });

    console.log("📦 Admin from DB:", admin);

    if (!admin || !admin.isActive) {
      console.log("❌ Not an admin or inactive");

      return res.status(403).json({
        message: "Access denied. Admin only."
      });
    }

    console.log("✅ Admin access granted");

    req.admin = admin;
    next();

  } catch (error) {

    console.log("🔥 Error in adminMiddleware:", error);

    res.status(500).json({
      error: error.message
    });
  }
};

module.exports = adminMiddleware;