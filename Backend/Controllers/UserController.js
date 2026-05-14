const User = require("../Models/User");

// ✅ POST /api/users/role
exports.setRole = async (req, res) => {
  try {

    // ✅ FIXED
    const clerkId = req.auth?.userId;

    const { role } = req.body;

    if (!["student", "partner"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role selected"
      });
    }

    let user = await User.findOne({ clerkId });

    if (!user) {
      user = await User.create({ clerkId, role });
      return res.status(200).json(user);
    }

    if (user.role !== role) {
      return res.status(400).json({
        message: `You already registered as ${user.role}`
      });
    }

    return res.status(200).json(user);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ GET /api/users/me
exports.getMe = async (req, res) => {
  try {

    // ✅ FIXED
    const clerkId = req.auth?.userId;

    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(200).json(null);
    }

    res.status(200).json(user);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};