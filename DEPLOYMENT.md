# 🚀 Deployment Guide for GamePulse

This guide will help you deploy the **GamePulse** application (Frontend + Backend) for free using **Render** (Backend) and **Vercel** (Frontend).

---

## 🏗️ 1. Prepare Your Code (Already Done)
- The backend is configured to listen on `process.env.PORT`.
- The frontend is configured to use `VITE_API_URL` environment variable.
- **Push your code to GitHub** before proceeding.

---

## 🔙 2. Deploy Backend (Node.js/Express) on Render

1.  **Sign up/Login** to [Render.com](https://render.com/).
2.  Click **"New +"** -> **"Web Service"**.
3.  Connect your GitHub repository.
4.  **Configure the Service:**
    *   **Name:** `gamepulse-backend`
    *   **Root Directory:** `backend` (Important!)
    *   **Runtime:** `Node`
    *   **Build Command:** `npm install`
    *   **Start Command:** `npm start`
    *   **Plan:** Free
5.  **Environment Variables:**
    Add the following variables in the "Environment" tab:
    *   `MONGO_URI`: Your MongoDB Connection String (from Atlas).
    *   `JWT_SECRET`: A secure random string (e.g., `mysecretkey123`).
    *   `NODE_ENV`: `production`
6.  Click **"Create Web Service"**.
7.  **Copy the Backend URL** (e.g., `https://gamepulse-backend.onrender.com`) once deployed.

---

## 🖥️ 3. Deploy Frontend (React/Vite) on Vercel

1.  **Sign up/Login** to [Vercel.com](https://vercel.com/).
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your GitHub repository.
4.  **Configure the Project:**
    *   **Framework Preset:** Vite
    *   **Root Directory:** `.` (Default is fine, or leave empty if it auto-detects `vite.config.js`).
    *   **Build Command:** `npm run build`
        *   *Note:* Since this is a monorepo, Vercel might need `cd src && ...` if not configured. But standard Vite setup usually works if `package.json` is in root.
        *   **Wait!** Your `package.json` is in the root `MERN-Product` folder. Vercel should detect it.
5.  **Environment Variables:**
    Add the following variable:
    *   `VITE_API_URL`: Paste your **Render Backend URL** here (e.g., `https://gamepulse-backend.onrender.com`).
6.  Click **"Deploy"**.

---

## ✅ 4. Final Steps

1.  Once Vercel deploys, open your new website URL.
2.  Go to `/admin`, login with `admin@gamepulse.com` / `admin123`.
3.  Check if you can update scores. If the socket connects successfully, you are live!

### 💡 Troubleshooting
- **CORS Error:** If the frontend can't talk to the backend, go to `backend/server.js` and update `cors` origin to your specific Vercel URL instead of `*`.
- **Socket Disconnects:** Render free tier spins down after inactivity. The first request might take 50 seconds.
