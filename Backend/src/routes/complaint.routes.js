const express = require("express");
const router = express.Router();

const {
  createComplaint,
  getMyComplaints,
  getComplaintById,
} = require("../controllers/complaint.controller");

const { protect } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

router.post("/", protect, upload.single("image"), createComplaint);
router.get("/my", protect, getMyComplaints);
router.get("/:id", protect, getComplaintById);

module.exports = router;
