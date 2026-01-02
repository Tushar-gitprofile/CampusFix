const Complaint = require("../models/Complaint");
const sendEmail = require("../utils/sendEmail");

/**
 * @desc    Get all complaints (Admin)
 * @route   GET /api/admin/complaints
 * @access  Admin
 */
exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    console.error("GET ALL COMPLAINTS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Update complaint status (Admin)
 * @route   PUT /api/admin/complaints/:id/status
 * @access  Admin
 */
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const complaint = await Complaint.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Update complaint
    complaint.status = status;
    complaint.updatedBy = req.user.id;
    await complaint.save();

    /* ================= EMAIL NOTIFICATION ================= */

    console.log("📧 Triggering email to:", complaint.createdBy.email);

    await sendEmail({
      to: complaint.createdBy.email,
      subject: "CampusFix | Complaint Status Updated",
      text: `Hello ${complaint.createdBy.name},

Your complaint "${complaint.title}" has been updated to "${status}".

Regards,
CampusFix Team`,
    });

    console.log("✅ sendEmail() completed");

    /* ================= REAL-TIME SOCKET EVENT ================= */

    const io = req.app.get("io");
    if (io) {
      io.emit("statusUpdated", {
        complaintId: complaint._id,
        status: complaint.status,
      });
    }

    res.json({
      message: "Complaint status updated successfully",
      complaint,
    });
  } catch (error) {
    console.error("UPDATE COMPLAINT STATUS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
