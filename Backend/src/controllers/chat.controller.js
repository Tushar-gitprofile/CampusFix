const Message = require("../models/Message");

exports.getComplaintMessages = async (req, res) => {
  try {
    const { complaintId } = req.params;

    const messages = await Message.find({ complaint: complaintId })
      .populate("sender", "name role")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
