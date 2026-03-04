# 💬 Talkora

Talkora is a full-stack real-time chat application that enables users to communicate instantly through a secure and responsive messaging interface. It supports real-time one-to-one conversations, secure authentication, and efficient message storage.

The platform uses Steam API for instant communication and REST APIs for managing users and conversations, making it scalable and production-ready.

---

## 🚀 Live Demo  
https://talkora-9x17.onrender.com

---

## 📌 Key Features

- 🔐 User Authentication with secure HTTP-only cookie-based sessions
- 💬 Real-time messaging using Socket.io
- 👥 One-to-One Private Chat System
- 📂 Conversation Management
- 🗑️ Delete Messages / Conversations
- 🟢 Online / Offline User Status
- ⚡ Optimized REST APIs
- 📱 Fully Responsive UI for all devices

---

## 🛠️ Tech Stack

### Frontend
- React.js (Vite)
- React Router DOM
- Axios
- Context API (State Management)
- CSS (responsive, custom design)

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT (for authentication)
- Bcrypt.js (for password hashing)
- Stream (real-time communication)

---

## 🔧 Setup Instructions

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/yourusername/Talkora.git
cd talkora
```

### 2️⃣ Setup Server/Backend
```sh
cd server
npm install
```
```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_TOKEN_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```
```sh
npm start
```
