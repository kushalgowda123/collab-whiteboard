🧠 Collaborative Whiteboard Application

A full-featured real-time collaborative whiteboard app built using the MERN stack with secure, token-based invite links, admin dashboard management, persistent canvas storage, and socket.io-powered real-time drawing sync.

⸻

🌐 Access from Any Device (LAN Ready)

To access this project from other devices (like your phone or another PC on the same Wi-Fi network), use your machine’s local IP address instead of localhost, e.g.:

http://192.168.31.182:5173


⸻

✨ Features

✅ Admin Dashboard (Modular & Replaceable)
	•	Invite users to boards via email using JWT-based links
	•	Manage multiple boards
	•	View and open specific boards by ID
	•	Download board content as .png
	•	Easily separable: The Admin Dashboard UI can be modularized or deployed independently without impacting the collaborative whiteboard system.

✅ Whiteboard Canvas
	•	Real-time multi-user drawing with socket.io
	•	Pen, Eraser, and Text input tools
	•	Adjustable brush size and color picker
	•	Auto-save canvas every few seconds
	•	Load board content based on board ID
	•	Drawing data scoped by board using socket.join()

✅ Invite System
	•	Secure email invitations using JWT
	•	Invite token includes sender & receiver identity and board ID
	•	Invite links expire in 1 hour
	•	Token auto-verifies and renders board for invited users

✅ Download & Persistence
	•	Boards are saved and loaded based on board ID
	•	Can download .png of current board state
	•	Saved boards are stored as image files in the backend

✅ LAN & Cross-Device Access
	•	Works seamlessly across devices on the same Wi-Fi network
	•	Supports React Dev Server and Express server over local IP

⸻

🏗️ Tech Stack
	•	Frontend: React (Vite), Tailwind CSS
	•	Backend: Node.js, Express.js
	•	Real-Time Communication: socket.io
	•	Email Service: nodemailer with Gmail
	•	Auth: JWT-based invite tokens
	•	Storage: PNG snapshots stored locally on server

⸻

🛠️ Setup & Development

1. Clone the Repository

git clone https://github.com/your-username/whiteboard-app.git
cd whiteboard-app

2. Install Dependencies

# Backend
cd api
npm install

# Frontend
cd ../client
npm install

3. Setup Environment Variables

In api/.env:

PORT=3000
JWT_SECRET=your_jwt_secret_key
EMAIL=your_gmail@gmail.com
EMAIL_PASS=your_app_password

4. Enable LAN Support

In api/index.js:

server.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`Server running on ${process.env.PORT}`);
});

In vite.config.js:

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

5. Run the Application

# Terminal 1 - Start the backend
cd api
npm run dev

# Terminal 2 - Start the frontend
cd ../client
npm run dev -- --host

Then access: http://192.168.31.182:5173 from any device on the same network.

⸻

📁 Folder Structure

whiteboard-app/
├── api/
│   ├── routes/
│   │   ├── invite.js
│   │   ├── download.js
│   │   └── whiteboard.js
│   ├── socket.js
│   ├── index.js
│   ├── .env
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── WhiteboardCanvas.jsx
│   │   │   └── InviteBoardRoute.jsx
│   │   ├── utils/
│   │   │   └── socket.js
│   ├── vite.config.js


⸻

🔒 Security
	•	All invite links use JWT and expire after 1 hour
	•	Only invited users can access a board via the token
	•	Token includes boardId, sender email, receiver email, and sender name
	•	Boards are private — no public listing

⸻

🔧 Customization

✅ Admin Dashboard Can Be Split

The AdminDashboard.jsx is built in a modular way — it can be:
	•	Extracted into a separate UI/project
	•	Replaced with a different UI entirely
	•	Embedded into any internal tool (e.g. CRM, dashboard)

✅ The Whiteboard is Standalone

The collaborative WhiteboardCanvas.jsx works purely based on boardId and a valid token. It does not depend on the admin interface.

⸻

📧 Developer Info

Author: Kushal MK
Email: kushalgowda44664@gmail.com

⸻

🔗 Sample Invite Link (use LAN IP on other devices)

http://192.168.31.182:5173/board/3?token=eyJhbGciOi...


⸻

✅ Final Notes

This project is built to be secure, lightweight, and highly modular. Feel free to fork, extend, or rebrand the Admin Dashboard independently from the whiteboard logic. It’s an ideal foundation for collaborative tools, ed-tech platforms, or internal team brainstorming utilities.
