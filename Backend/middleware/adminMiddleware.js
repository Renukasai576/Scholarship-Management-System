const Admin = require("../Models/Admin");
const User = require("../Models/User");

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

    let admin = await Admin.findOne({ clerkId });
    console.log("📦 Admin from DB:", admin);

    if (!admin || !admin.isActive) {
      const user = await User.findOne({ clerkId, role: "admin" });
      console.log("📦 User admin fallback:", user);

      if (!user) {
        console.log("❌ Not an admin or inactive");

        return res.status(403).json({
          message: "Access denied. Admin only."
        });
      }

      admin = user;
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