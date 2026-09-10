# 🌍 Wanderly – AI-Powered Travel Itinerary Planner
🔗 **Live Demo:** [wanderly-travel-planner](https://wanderly-frontend-r14cx0byt-ujjwalg2611s-projects.vercel.app)

A full-stack MERN travel planning application with AI itinerary generation, social features, expense tracking, and a beautiful modern UI.

---

## 🗂️ Project Structure

```
travel-planner/
├── backend/                   # Node.js + Express API
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js            # Register / Login / Profile
│   │   ├── trips.js           # CRUD + like/comment/collaborate
│   │   ├── itineraries.js     # Day-wise itinerary management
│   │   ├── expenses.js        # Expense tracking + split
│   │   ├── social.js          # Follow / Feed
│   │   ├── recommendations.js # Smart destination recommendations
│   │   └── dashboard.js       # Aggregated stats
│   ├── server.js              # Express + Socket.io server
│   └── package.json
│
└── frontend/                  # React 18 + Tailwind CSS
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   └── ui/
    │   │       ├── Sidebar.jsx    # Collapsible navigation
    │   │       ├── Header.jsx     # Search + notifications
    │   │       └── Layout.jsx     # Page wrapper
    │   ├── context/
    │   │   ├── AuthContext.jsx    # JWT auth state
    │   │   └── ThemeContext.jsx   # Dark / light mode
    │   ├── pages/
    │   │   ├── AuthPage.jsx       # Login + Register + Demo
    │   │   ├── Dashboard.jsx      # Stats + recent trips
    │   │   ├── TripsPage.jsx      # Trip list + create modal
    │   │   ├── NewTripPage.jsx    # 4-step trip wizard
    │   │   ├── TripDetail.jsx     # Itinerary + social + collab
    │   │   ├── ItineraryPage.jsx  # Timeline + Calendar views
    │   │   ├── ExplorePage.jsx    # Community trips discovery
    │   │   ├── SocialPage.jsx     # Follow + feed + community
    │   │   ├── ExpensesPage.jsx   # Budget tracker + charts
    │   │   ├── SavedPage.jsx      # Saved destinations + itineraries
    │   │   ├── RecommendationsPage.jsx  # AI-powered suggestions
    │   │   └── SettingsPage.jsx   # Profile + appearance + privacy
    │   ├── services/
    │   │   └── api.js             # Axios API service layer
    │   ├── App.jsx                # Router + protected routes
    │   ├── index.js               # React entry point
    │   └── index.css              # Tailwind + custom styles
    ├── tailwind.config.js
    ├── postcss.config.js
    └── package.json
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### 1. Backend

```bash
cd backend
npm install
npm run dev
# Runs on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

### 3. Demo Login

Click **"Try Demo Account"** on the login page — no signup needed!

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 Auth | Email signup/login with JWT, demo account |
| 🗺️ Trip Planning | Create trips with destination, dates, budget, interests |
| 🤖 AI Itinerary | Auto-generates day-wise morning/afternoon/evening plans |
| 📅 Itinerary Views | Timeline view + interactive Calendar view |
| 👥 Collaboration | Invite friends to co-edit trip itineraries |
| 🌍 Explore | Browse public trips shared by the community |
| 💬 Social | Follow travelers, like/comment on trips, activity feed |
| 💰 Expenses | Track costs by category with pie charts, split with friends |
| ⭐ Saved | Save favourite destinations and itineraries |
| 🧠 Recommendations | AI-curated destinations based on your interests |
| 🔔 Notifications | Trip reminders, weather & budget alerts |
| 🎨 Themes | Dark / Light mode toggle, custom accent colours |
| ⚙️ Settings | Profile, preferences, notification controls, privacy |
| 📱 Responsive | Mobile-friendly layout |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** – UI library
- **React Router v6** – Client-side routing
- **Tailwind CSS 3** – Utility-first styling
- **Recharts** – Budget & spending charts
- **Framer Motion** ready – Animation hooks in place
- **Lucide React** – Icon system
- **React Hot Toast** – Notification toasts
- **Axios** – HTTP client
- **Socket.io Client** – Real-time collaboration
- **date-fns** – Date formatting

### Backend
- **Node.js + Express** – REST API server
- **Socket.io** – Real-time collaboration rooms
- **JWT** – Stateless authentication
- **bcryptjs** – Password hashing
- **In-memory store** – Ready to swap for MongoDB

### Ready-to-Integrate APIs
- **Google Maps API** – Replace map placeholder in TripDetail
- **OpenWeather API** – Wire to weather notification system
- **OpenAI API** – Enhance AI itinerary generator in trips route

---

## 🔌 Environment Variables

Create `backend/.env`:

```env
PORT=5000
JWT_SECRET=your_super_secret_key_here
MONGODB_URI=mongodb://localhost:27017/wanderly   # optional
OPENAI_API_KEY=sk-...                            # optional
GOOGLE_MAPS_KEY=...                              # optional
```

---

## 🗄️ Switching to MongoDB

Replace the in-memory `db` object in `server.js` with Mongoose models:

```js
// server.js
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);
```

Each route's array operations map directly to Mongoose equivalents (`find`, `save`, `findByIdAndUpdate`, `deleteOne`).

---

## 🎨 Design System

| Token | Value | Usage |
|---|---|---|
| `sand-500` | `#c4842a` | Primary brand / CTA |
| `ocean-500` | `#2c9eef` | Secondary / info |
| `forest-500` | `#22c55e` | Success / nature |
| `dusk-500` | `#d946ef` | Accent / tags |
| `dark` | `#0f1923` | Dark mode background |

Custom fonts: **Playfair Display** (headings) · **DM Sans** (body) · **Cormorant Garamond** (accent)

---

## 📸 Pages Overview

1. **Auth** – Split-panel with floating destination cards animation
2. **Dashboard** – Stats grid, spending area chart, quick actions
3. **New Trip Wizard** – 4-step guided form with live preview
4. **Trip Detail** – Collapsible day cards, budget ring, comments
5. **Itinerary** – Timeline (all days) + Calendar (monthly grid)
6. **Explore** – Community trips with search + category filters
7. **Social** – Discover travelers, activity feed, follow system
8. **Expenses** – Donut chart, transaction list, add modal
9. **Saved** – Grid of bookmarked destinations & itineraries
10. **Recommendations** – Trending, AI suggestions, destination cards
11. **Settings** – Profile edit, theme picker, notification toggles

---

*Built with ❤️ — Wanderly Travel Planner*
