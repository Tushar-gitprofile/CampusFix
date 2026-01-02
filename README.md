# 🚀 CampusFix – Campus Facility & Complaint Management System

CampusFix is a **full-stack MERN application** designed to streamline campus facility issue reporting and resolution.  
Students can raise complaints with images, track their status in real time, and chat with administrators.  
Admins can manage complaints, update statuses, and notify students instantly via **real-time updates and email notifications**.

This project is built with **real-world architecture and workflows**, making it highly suitable for **interviews and production-level discussions**.

---

## ✨ Key Features

### 👨‍🎓 Student Features
- User authentication (JWT based)
- Raise complaints with category, priority & image upload
- View complaint status (Open → In Progress → Resolved)
- Real-time status updates using Socket.IO
- Complaint-wise real-time chat with admin
- Email notification when status changes

### 🧑‍💼 Admin Features
- Secure admin login (role-based access)
- View all complaints with filters & search
- Update complaint status
- Real-time notifications to students
- Email alerts on status updates
- Admin dashboard for complaint management

---

## 🛠️ Tech Stack

### Frontend
- React.js (Vite)
- Axios
- React Router
- Socket.IO Client
- Clean & responsive UI

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT Authentication
- Socket.IO
- NodeMailer (Ethereal for testing)
- Cloudinary (image uploads)

---

## 🏗️ Project Architecture

CampusFix/
│
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── utils/
│ ├── middlewares/
│ └── server.js
│
├── campusfix-frontend/
│ ├── src/
│ │ ├── pages/
│ │ ├── components/
│ │ ├── services/
│ │ └── App.jsx
│
└── README.md

yaml
Copy code

---

## 🔐 Authentication & Security

- Passwords hashed using **bcrypt**
- JWT used for secure authentication
- Role-based authorization (`student`, `admin`)
- Protected routes on both frontend and backend

---

## 📧 Email Notifications

- Implemented using **NodeMailer**
- Uses **Ethereal Email** for development/testing
- Email preview URLs are logged in backend terminal
- Can be easily switched to Gmail / SendGrid for production

---

## ⚡ Real-Time Features

- Socket.IO used for:
  - Live complaint status updates
  - Real-time chat between student & admin
- No page refresh required

---

## 🖼️ File Uploads

- Complaint images uploaded via **Cloudinary**
- Secure & scalable cloud storage

---

## 🚀 Getting Started

### 1️⃣ Clone Repository
```bash
git clone https://github.com/your-username/CampusFix.git
2️⃣ Backend Setup
bash
Copy code
cd backend
npm install
npm run dev
3️⃣ Frontend Setup
bash
Copy code
cd campusfix-frontend
npm install
npm run dev
🔧 Environment Variables (Backend)
Create a .env file inside backend:

env
Copy code
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
(Email credentials are not required for Ethereal testing)

🧪 Testing Email Notifications
Student creates a complaint

Admin updates complaint status

Backend logs a NodeMailer Preview URL

Open the URL to view the email content