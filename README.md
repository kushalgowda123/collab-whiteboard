# 🧠 Collaborative Whiteboard Application

A real-time collaborative whiteboard web app built using the MERN stack with secure, token-based invite links, admin dashboard management, and persistent canvas storage.

---

## 🌐 Live Access (LAN Usage)

* Use your local IP (e.g. `http://192.168.31.182:5173`) instead of `localhost` when accessing from other devices on the same Wi-Fi network.

---

## 📁 Features

### ✅ Admin Dashboard

* Create whiteboard sessions by ID
* Send email invites with secure JWT tokens
* View and manage boards
* Download any whiteboard as an image (`.png`)

### ✅ Collaborative Whiteboard

* Real-time drawing sync via socket.io
* Multiple brush sizes
* Pen, eraser, and text tools
* Canvas automatically saved per board
* Token-authenticated board access
* Canvas data loaded on refresh

### ✅ Invite System

* Secure invite link via email using JWT
* Links contain encoded board ID and sender/receiver
* Auto-verification on open
* Invited users see admin name and can access whiteboard directly

### ✅ LAN Access

* Fully accessible from any device on the same Wi-Fi (e.g. phones, tablets)
* Uses local IP + port

---

## 📦 Tech Stack

* **Frontend:** React (Vite), Tailwind CSS
* **Backend:** Node.js, Express
* **Socket Communication:** socket.io
* **Email:** nodemailer (Gmail)
* **Database:** Optional (in-memory/file-based board storage)

---

## 🛠️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/whiteboard-app.git
cd whiteboard-app
```

### 2. Install dependencies

```bash
# Backend
cd api
npm install

# Frontend
cd ../client
npm install
```

### 3. Configure environment variables

Create a `.env` file in the `api/` directory:

```env
PORT=3000
JWT_SECRET=your_jwt_secret
EMAIL=your_gmail@gmail.com
EMAIL_PASS=your_app_password
```

### 4. Enable LAN access

#### Backend (`api/index.js`)

```js
server.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`Server running on ${process.env.PORT}`);
});
```

#### Frontend (`vite.config.js`)

```js
server: {
  host: true,
  port: 5173,
  proxy: {
    '/api': 'http://localhost:3000',
    '/socket.io': {
      target: 'http://localhost:3000',
      ws: true
    }
  }
}
```

### 5. Run the app

```bash
# Terminal 1: Start backend
cd api
npm run dev

# Terminal 2: Start frontend
cd ../client
npm run dev -- --host
```

---

## 📤 Folder Structure

```
whiteboard-app/
├── api/
│   ├── routes/
│   │   ├── invite.js
│   │   ├── download.js
│   │   └── whiteboard.js
│   ├── socket.js
│   ├── index.js
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── WhiteboardCanvas.jsx
│   │   │   └── InviteBoardRoute.jsx
│   │   ├── utils/
│   │   │   └── socket.js
│   ├── vite.config.js
```

---

## ✂️ Customization Tips

* You can **separate the Admin Dashboard** UI into a completely different route or repo without affecting the whiteboard functionality.
* Whiteboards are uniquely identified by `boardId`, so you can embed them anywhere securely using tokens.
* Invite flow can be integrated with any existing login system if needed.

---

## 🔐 Security Notes

* All invite links are signed JWTs and expire in 1 hour
* Only users with a valid token can join a board
* Boards are not listed publicly (access is token-based)

---

## 📧 Author

**Kushal MK**
Email: [kush43856@gmail.com](mailto:kush43856@gmail.com)
ID: 221ME130

---

## 📸 Example Invite Link (LAN):

```
http://192.168.31.182:5173/board/3?token=eyJhbGciOi...
```
