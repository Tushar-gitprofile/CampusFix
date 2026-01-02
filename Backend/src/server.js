const dotenv = require("dotenv");
dotenv.config();

const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const Message = require("./models/Message");
const Complaint = require("./models/Complaint");
const jwt = require("jsonwebtoken");

// Connect DB
connectDB();

const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Make io available
app.set("io", io);

// 🔐 SOCKET AUTH MIDDLEWARE
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication required"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded; // { id, role }
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.user.id);

  // Join complaint room (SECURE)
  socket.on("joinComplaint", async ({ complaintId }) => {
    const complaint = await Complaint.findById(complaintId);

    if (!complaint) return;

    const isOwner = complaint.createdBy.toString() === socket.user.id;

    const isAdmin =
      socket.user.role === "admin" || socket.user.role === "staff";

    if (!isOwner && !isAdmin) {
      console.log("⛔ Unauthorized room access");
      return;
    }

    socket.join(complaintId);
    console.log(`👥 User joined complaint room: ${complaintId}`);
  });

  // Send message (SECURE)
  socket.on("sendMessage", async ({ complaintId, text }) => {
    if (!text) return;

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) return;

    const isOwner = complaint.createdBy.toString() === socket.user.id;

    const isAdmin =
      socket.user.role === "admin" || socket.user.role === "staff";

    if (!isOwner && !isAdmin) return;

    const message = await Message.create({
      complaint: complaintId,
      sender: socket.user.id,
      text,
    });

    io.to(complaintId).emit("newMessage", {
      id: message._id,
      sender: socket.user.id,
      text,
      createdAt: message.createdAt,
    });
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.user.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
