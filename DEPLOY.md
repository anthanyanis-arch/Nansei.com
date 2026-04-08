# NANSEI Organics — Deployment Guide

## Project Structure
```
agri store/
├── pages/          ← Frontend HTML pages
├── js/             ← Shared JS (config.js lives here)
├── backend/        ← Node.js/Express API
└── render.yaml     ← Render deployment config
```

---

## Step 1 — Deploy the Backend (Render)

1. Push this repo to GitHub (make sure `.env` is gitignored ✅)
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo
4. Set **Root Directory** → `backend`
5. Set **Build Command** → `npm install`
6. Set **Start Command** → `npm start`
7. Add these **Environment Variables** in the Render dashboard:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | your MongoDB Atlas connection string |
| `JWT_SECRET` | 64-char random hex (run: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`) |
| `JWT_EXPIRE` | `30d` |
| `EMAIL_HOST` | `smtp.gmail.com` |
| `EMAIL_PORT` | `587` |
| `EMAIL_USER` | your Gmail address |
| `EMAIL_PASSWORD` | your Gmail App Password (16 chars, no spaces) |
| `EMAIL_FROM` | `Nansai Organics <your-gmail@gmail.com>` |
| `FRONTEND_URL` | your frontend URL (e.g. `https://nansei.netlify.app`) |
| `GOOGLE_CLIENT_ID` | from Google Cloud Console |

8. Click **Deploy** — your API will be live at `https://nansei-backend.onrender.com`

---

## Step 2 — Update Frontend Config

Open `js/config.js` and set your deployed backend URL:

```js
const PRODUCTION_API = 'https://nansei-backend.onrender.com/api';
```

---

## Step 3 — Deploy the Frontend (Netlify — recommended)

1. Go to [netlify.com](https://netlify.com) → **Add new site** → **Import from Git**
2. Connect your GitHub repo
3. Set **Publish directory** → `pages`  *(or leave blank to serve from root)*
4. Click **Deploy site**
5. Your site will be live at `https://your-site.netlify.app`

> **Alternative:** GitHub Pages → Settings → Pages → Source: `main` branch → `/pages` folder

---

## Step 4 — MongoDB Atlas Setup

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free **M0** cluster
3. **Database Access** → Add user with password
4. **Network Access** → Add IP `0.0.0.0/0` (allow all — required for Render)
5. **Connect** → Drivers → Copy the connection string
6. Replace `<password>` with your DB user password
7. Paste into Render's `MONGODB_URI` env var

---

## Step 5 — Google OAuth Setup

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a project → **APIs & Services** → **Credentials**
3. **Create OAuth 2.0 Client ID** → Web application
4. Add **Authorized JavaScript origins**:
   - `http://localhost:5500`
   - `https://your-site.netlify.app`
5. Copy the **Client ID** → paste into Render env var `GOOGLE_CLIENT_ID`
6. Also update `pages/login.html` line: `const GOOGLE_CLIENT_ID = 'your-id...'`

---

## Local Development

```bash
# 1. Install backend dependencies
cd backend
npm install

# 2. Copy env file and fill in your values
cp .env.example .env

# 3. Start backend
npm run dev

# 4. Open frontend
# Use VS Code Live Server or any static server on port 5500
# Open: http://localhost:5500/pages/index.html
```

---

## Security Checklist Before Going Live

- [ ] `.env` is in `.gitignore` and NOT committed
- [ ] `JWT_SECRET` is a strong random 64-char hex (not the default)
- [ ] MongoDB Atlas IP whitelist is set correctly
- [ ] `FRONTEND_URL` env var is set to your actual domain
- [ ] Google OAuth origins include your production domain
- [ ] Gmail App Password is set (not your real Gmail password)
