const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const { getComplaintMessages } = require("../controllers/chat.controller");

router.get("/complaints/:complaintId/messages", protect, getComplaintMessages);

module.exports = router;
