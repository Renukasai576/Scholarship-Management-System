const User = require("../Models/User");

// ✅ POST /api/users/role
exports.setRole = async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const { role } = req.body;

    // 🛑 Validate role
    if (!["student", "partner"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role selected"
      });
    }

    let user = await User.findOne({ clerkId });

    // 🟢 First time login → save role
    if (!user) {
      user = await User.create({ clerkId, role });
      return res.status(200).json(user);
    }

    // 🔴 If trying different role → block
    if (user.role !== role) {
      return res.status(400).json({
        message: `You already registered as ${user.role}`
      });
    }

    // 🟢 Same role → allow
    return res.status(200).json(user);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ GET /api/users/me  (VERY IMPORTANT for Step 5)
exports.getMe = async (req, res) => {
  try {
    const clerkId = req.auth.userId;

    const user = await User.findOne({ clerkId });

    // 🟡 If user not found → return null (new user)
    if (!user) {
      return res.status(200).json(null);
    }

    // 🟢 Return existing user
    res.status(200).json(user);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};