const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");
const {
  getAllComplaints,
  updateComplaintStatus,
} = require("../controllers/admin.controller");

// View all complaints
router.get(
  "/complaints",
  protect,
  authorize("admin", "staff"),
  getAllComplaints
);

// Update complaint status
router.put(
  "/complaints/:id/status",
  protect,
  authorize("admin", "staff"),
  updateComplaintStatus
);

module.exports = router;
