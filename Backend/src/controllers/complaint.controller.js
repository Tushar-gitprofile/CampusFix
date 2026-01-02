const Complaint = require("../models/Complaint");
const sendEmail = require("../utils/sendEmail");

exports.createComplaint = async (req, res) => {
  try {
    const title = req.body.title;
    const description = req.body.description;
    const category = req.body.category;
    const priority = req.body.priority || "Low";

    if (!title || !description || !category) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const complaint = await Complaint.create({
      title,
      description,
      category,
      priority,
      image: req.file ? req.file.path : null,
      createdBy: req.user.id,
    });

    // 📧 Email (already working)
    await sendEmail({
      to: req.user.email,
      subject: "CampusFix | Complaint Created",
      text: `Your complaint "${complaint.title}" has been registered.`,
    });

    // 🔔 REAL-TIME NOTIFICATION
    const io = req.app.get("io");
    io.emit("newComplaint", {
      id: complaint._id,
      title: complaint.title,
      category: complaint.category,
      priority: complaint.priority,
    });

    res.status(201).json({
      message: "Complaint created successfully",
      complaint,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      createdBy: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate(
      "createdBy",
      "name email role"
    );

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Allow only owner or admin
    if (
      complaint.createdBy._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
