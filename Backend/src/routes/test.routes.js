const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

// Any logged-in user
router.get("/", protect, (req, res) => {
  res.json({
    message: "Authenticated user access ✅",
    role: req.user.role,
  });
});

// Only admin
router.get("/admin", protect, authorize("admin"), (req, res) => {
  res.json({
    message: "Admin access granted 👑",
  });
});

// Staff & Admin
router.get("/staff", protect, authorize("staff", "admin"), (req, res) => {
  res.json({
    message: "Staff/Admin access granted 🛠️",
  });
});

module.exports = router;
