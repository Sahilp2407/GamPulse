# 🏏 GamePulse - Live Sports Dashboard

GamePulse is a **premium, real-time sports analytics platform** built with the MERN stack (MongoDB, Express, React, Node.js). It features immediate score updates via Socket.IO, a secure admin panel for match management, and a high-fidelity "dark mode" UI designed for professional use.

---

## 🚀 Key Features

### 🖥️ Frontend (React + Vite)
- **Live Scoreboard:** Real-time updates for runs, wickets, overs, and run rates without page refresh.
- **Premium UI/UX:** Glassmorphism design, neon accents, and deep navy aesthetics (No emojis used).
- **Interactive Dashboard:** Live match status, recent activity feeds, and featured match cards.
- **Player Stats:** Detailed visuals for batsmen (Runs, Balls, SR) and bowlers (Overs, Wickets, Economy).
- **"On Strike" Indicators:** Visual cues highlighting the active batsman.
- **Responsive Design:** Fully optimized for desktop and mobile viewing.

### ⚙️ Backend (Node.js + Express)
- **Real-Time Engine:** Built with **Socket.IO** to broadcast scores and commentary instantly to all connected clients.
- **Secure Admin Panel:** JWT-based authentication for admins to manage matches.
- **Match Management APIs:** Endpoints to update scores, wickets, and player stats.
- **Commentary System:** Admin can broadcast custom commentary messages in real-time.
- **Database:** MongoDB schemas for `Games`, `Players`, `MatchStats`, and `Commentaries`.

---

## 🛠️ Tech Stack

- **Frontend:** React, React Router, Lucide React (Icons), CSS3 (Variables & Animations).
- **Backend:** Node.js, Express.js, Socket.IO.
- **Database:** MongoDB (Mongoose ODM).
- **Authentication:** JSON Web Tokens (JWT).
- **Tooling:** Vite, Nodemon, Concurrently.

---

## 📂 Project Structure

```bash
MERN-Product/
├── src/                      # Frontend Source
│   ├── components/           # Reusable UI Components
│   ├── pages/                # Main Application Pages
│   │   ├── Dashboard.jsx     # Overview & Live Feeds
│   │   ├── LiveMatch.jsx     # Main Match Interface
│   │   ├── AdminPanel.jsx    # Admin Controls (Protected)
│   │   └── PlayerStats.jsx   # Detailed Analytics
│   ├── index.css             # Global Styles (Premium Dark Theme)
│   ├── App.jsx               # Routes & Layouts
│   └── socket.js             # Socket.IO Client Configuration
│
├── backend/                  # Backend Source
│   ├── config/               # DB Connection
│   ├── models/               # Mongoose Schemas (Game, Player, Commentary)
│   ├── routes/               # API Routes (Auth, Admin, Game)
│   ├── server.js             # Server Entry Point & Socket Setup
│   └── .env                  # Environment Variables
```

---

## ⚙️ How to Run Locally

### 1. Prerequisites
- Node.js installed (`v16+`)
- MongoDB running locally or Atlas URI

### 2. Setup Backend
```bash
cd backend
npm install
npm run dev
# Server runs on http://localhost:5002
```

### 3. Setup Frontend
Open a new terminal:
```bash
cd ..
npm install
npm run dev
# App runs on http://localhost:5173
```

---

## 🔑 Admin Access

To manage live scores, navigate to **/admin** and use the following demo credentials:

- **Email:** `admin@gamepulse.com`
- **Password:** `admin123`

### Admin Capabilities:
- **Update Score:** Add runs (1, 2, 3, 4, 6) or custom values.
- **Update Wickets:** Fall wickets to trigger "All Out" status.
- **Broadcast Commentary:** Send live text updates to all viewers.

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/admin-login` | Admin Login & JWT Generation | No |
| **POST** | `/api/admin/update-score` | Update runs/wickets for live match | **Yes** |
| **POST** | `/api/commentary/:matchId` | Broadcast new commentary | **Yes** |
| **GET** | `/api/game/live` | Fetch current match data | No |
| **GET** | `/api/players/:matchId` | Get player statistics | No |

---

## 🎨 UI Design Philosophy
The application follows a strict **"No Emoji, Professional Sports"** aesthetic:
- **Dark Mode Only:** Reduces eye strain and emphasizes data.
- **Lucide Icons:** Clean, vector-based icons instead of text emojis.
- **Glassmorphism:** Translucent cards (`backdrop-filter`) for depth.
- **Animations:** Subtle pulses for "Live" indicators and smooth score transitions.

---
**Developed by:** [Your Name/Team]
**Version:** 1.0.0
