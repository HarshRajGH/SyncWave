# SyncWave — Virtual Co-Studying & Focus Room Platform (MERN)

> **SyncWave** is a fullstack collaborative virtual study room platform designed for focused group productivity and academic momentum. It empowers students and developers to create synchronized study rooms ("Waves"), track session goals, stay focused with unified countdown timers, review milestone achievements, and collaborate in real-time.

---

## 📌 Project Overview

SyncWave eliminates isolation in remote learning by providing a digital co-working environment structured around time-boxed, distraction-free study sprints. Each "Wave" functions as a live study room where peers commit to shared and individual goals while maintaining synchronization.

The application has been converted from a client-side prototype into a complete **MERN (MongoDB, Express.js, React, Node.js)** fullstack architecture.

---

## 🛠️ Tech Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 (`18.3.1`) | SPA with functional components and hooks (`useState`, `useEffect`, `useCallback`, `useMemo`) |
| **Routing** | React Router v6 (`6.26.2`) | Declarative client-side routing with nested layouts and route guards |
| **Build Tool & Bundler**| Vite (`5.4.6`) | Fast HMR dev server and optimized Rollup production builds |
| **Styling** | Vanilla CSS3 | Modern CSS design tokens, responsive layout grids, glassmorphism, and dark theme |
| **Backend Runtime** | Node.js | Modular ES modules architecture |
| **Backend Framework** | Express.js (`4.21.0`) | REST API with modular controllers, routes, and error handling |
| **Database & ODM** | MongoDB & Mongoose (`8.6.3`) | Schemas, relations, and data persistence for Users, Waves, History, and Messages |
| **Authentication** | JWT (`jsonwebtoken`) & bcryptjs | Stateless token authentication with salted password hashing |

---

## 🚀 Current Features

### 1. **Authentication & Session Security**
- **User Registration**: Real-time form validation (name, email regex, 6+ character password).
- **Password Hashing**: Passwords securely hashed with `bcryptjs` before persisting to MongoDB.
- **JWT Authorization**: Stateless bearer token verification via `authMiddleware.js`.
- **User Profile Management**: Authenticated users can view and update their profile details (name, email).

### 2. **Interactive Dashboard & Discovery**
- **Dynamic Greeting & Metrics**: Time-of-day greetings alongside dynamic metric cards (Active Waves, Completed Waves, Students Online, Goals Completed) computed directly from MongoDB.
- **Real-Time Search & Filtering**: Multi-criteria search by wave name, subject, or description.
- **Subject Pills**: Instant category filtering (Data Structures, React, Operating Systems, etc.).
- **Wave Cards**: Live cards displaying subject tags, participant count, capacity limits, duration, host name, and avatar stacks.

### 3. **Wave Creation System**
- **Custom Modal Dialog**: Accessible modal with keyboard escape listeners and background scroll locking.
- **Configurable Sessions**:
  - Wave name and description.
  - Subject suggestions via datalist.
  - Duration selector (15, 30, 45, 60 minutes).
  - Participant capacity limits (2–12 members).
  - Multi-line checklist goal parser.

### 4. **Active Study Room (WaveRoom)**
- **Synchronized Countdown Timer**: Active countdown displayed in `MM:SS` format.
- **Interactive Goal Checklist**: Mark goals complete with PATCH updates to MongoDB.
- **Participant Roster**: Live attendee directory with active capacity tracking.
- **In-Room Chat REST API**: Group messaging persisted in MongoDB.
- **Session Completion Flow**: Completing or ending a wave automatically archives the session into MongoDB History and presents a summary milestone dialog.

### 5. **Study History & Milestones**
- **Session History Ledger**: Chronological log of completed waves, dates, goal completion ratios, and participant counts.
- **History Reset**: Danger zone option to clear historical study logs.

---

## 📂 Project Structure

```text
SyncWave/
├── server/                      # Express & MongoDB Backend
│   ├── config/
│   │   └── db.js                # MongoDB connection handler
│   ├── controllers/
│   │   ├── authController.js    # Register, login, profile endpoints
│   │   ├── waveController.js    # Wave CRUD, join, leave, goal toggle, end
│   │   ├── historyController.js # Session history tracking
│   │   └── messageController.js # Room chat messages API
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT verification & route protection
│   ├── models/
│   │   ├── User.js              # User schema with bcrypt hashing
│   │   ├── Wave.js              # Study wave & goal checklist schema
│   │   ├── History.js           # Completed study session records
│   │   └── Message.js           # Room group chat schema
│   ├── routes/
│   │   ├── authRoutes.js        # /api/auth
│   │   ├── waveRoutes.js        # /api/waves
│   │   ├── historyRoutes.js     # /api/history
│   │   └── messageRoutes.js     # /api/messages
│   ├── .env.example             # Server environment variables template
│   ├── .gitignore               # Server-specific ignore rules
│   ├── package.json             # Server dependencies & scripts
│   └── server.js                # Express app entry point
├── src/                         # React Frontend (Vite)
│   ├── components/              # UI presentation components
│   │   ├── Button.jsx
│   │   ├── ChatBox.jsx
│   │   ├── Modal.jsx
│   │   ├── Navbar.jsx
│   │   ├── ParticipantList.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── StatCard.jsx
│   │   └── WaveCard.jsx
│   ├── data/
│   │   └── mockData.js          # Shared constants & helper utilities
│   ├── layouts/
│   │   └── DashboardLayout.jsx  # Authenticated app shell
│   ├── pages/                   # Route views
│   │   ├── Dashboard.jsx
│   │   ├── DiscoverWaves.jsx
│   │   ├── History.jsx
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── Profile.jsx
│   │   ├── Register.jsx
│   │   ├── Settings.jsx
│   │   └── WaveRoom.jsx
│   ├── services/
│   │   └── api.js               # Centralized API service with fetch
│   ├── App.jsx                  # Main application state & route wiring
│   ├── index.css                # Global CSS variables & design system
│   └── main.jsx                 # Vite React DOM entry point
├── public/                      # Static assets & screenshots
├── .env.example                 # Frontend environment variables template
├── .gitignore                   # Project Git ignore rules
├── index.html                   # HTML template
├── package.json                 # Frontend dependencies & scripts
├── vite.config.js               # Vite bundler configuration
└── README.md                    # Project documentation
```

---

## ⚙️ Environment Variables Required

### Backend (`server/.env`)
Create a `server/.env` file with:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/syncwave
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
```

### Frontend (`.env`) *(Optional, defaults to `http://localhost:5000/api`)*
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🚀 Installation & Running the Project

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/try/download/community) running locally or MongoDB Atlas URI

### 2. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd server
npm install
cd ..
```

### 3. Run the Backend Server
```bash
cd server
npm start
# Server runs at http://localhost:5000
```
*(For development with auto-reload: `npm run dev`)*

### 4. Run the Frontend Client
In a separate terminal from project root:
```bash
npm run dev
# App runs at http://localhost:5173
```
