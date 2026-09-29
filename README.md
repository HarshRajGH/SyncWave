# SyncWave — Virtual Co-Studying & Focus Room Platform

> **SyncWave** is a collaborative virtual study room platform designed for focused group productivity and academic momentum. It empowers students and developers to create synchronized study rooms ("Waves"), track session goals, stay focused with unified countdown timers, and review milestone achievements.

---

## 📌 Project Overview

SyncWave eliminates isolation in remote learning by providing a digital co-working environment structured around time-boxed, distraction-free study sprints. Each "Wave" functions as a live study room where peers commit to shared and individual goals while maintaining synchronization.

---

## 🚀 Features Currently Implemented

### 1. **Authentication & Session Management**
- **Client-Side Authentication**: Controlled login and registration forms with real-time validation (email regex, password length constraints, and error messaging).
- **Persistent Sessions**: "Remember Me" credential preservation and session persistence across browser reloads via client storage.
- **Route Guarding**: Unauthenticated users trying to access protected views (`/dashboard`, `/waves`, etc.) are automatically redirected to the login flow.

### 2. **Interactive Dashboard & Discovery**
- **Dynamic Greeting & Metrics**: Time-of-day greetings ("Good morning / afternoon / evening") alongside dynamic metric cards (Active Waves, Completed Waves, Students Online, Goals Completed).
- **Multi-Criteria Search & Filtering**: Instant live search by session name, subject, or description.
- **Subject Pills**: Quick-filter category pills (Data Structures, React, Operating Systems, etc.) with dynamic active state toggles.
- **Wave Cards**: Live cards displaying subject tags, participant count, capacity ceilings, duration, host information, and dynamic avatar stacks.

### 3. **Wave Creation System**
- **Custom Modal Dialog**: Accessible modal with keyboard escape listeners and background scroll locking.
- **Configurable Sessions**:
  - Wave name and description (with character counter).
  - Subject suggestions via integrated datalist.
  - Duration selector (15, 30, 45, 60 minutes).
  - Participant capacity limits (2–12 members).
  - Multi-line checklist goal parser.

### 4. **Active Study Room (WaveRoom)**
- **Synchronized Countdown Timer**: Active countdown displayed in `MM:SS` format derived from the wave duration.
- **Interactive Goal Checklist**: Mark goals complete in real-time with an accompanying visual progress bar and completion percentage.
- **Participant Roster**: Live attendee directory indicating active status and room capacity warnings.
- **Session Chat**: In-room group chat interface with auto-scrolling log.
- **Session Completion Flow**: Completing or ending a wave automatically logs the session into the history ledger and presents a completion milestone dialog.

### 5. **Study History & Milestones**
- **Session History Ledger**: Chronological log of completed waves, record dates, goal completion ratios, and participant counts.
- **Profile Management**: Editable display name, email, and dynamic academic momentum statistics.
- **Preferences & Danger Zone**: Toggle interface for timer sound alerts, desktop notifications, auto-scroll chat, and data reset.
- **Cross-Tab Synchronization**: Real-time cross-tab state updates using window storage events.
- **Toast Notifications**: Floating toast notification stack for application feedback.

---

## 🛠️ Tech Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 (`18.3.1`) | Functional components, custom hooks (`useState`, `useEffect`, `useCallback`, `useMemo`) |
| **Routing** | React Router v6 (`6.26.2`) | Declarative client-side routing with nested layouts and route guards |
| **Build Tool & Bundler**| Vite (`5.4.6`) | Fast HMR dev server and optimized Rollup production builds |
| **Styling** | Vanilla CSS3 | Modern CSS design system, CSS custom properties, responsive layout grids, dark/glassmorphic aesthetics |
| **State & Persistence** | Browser Storage API | Structured client storage persistence with cross-tab event listeners |

---

## 📂 Project Structure

```text
syncwave/
├── public/
│   └── images/              # Project diagrams & documentation assets
├── src/
│   ├── components/          # Reusable UI presentation components
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
│   │   └── mockData.js      # Initial seed waves, storage keys & helpers
│   ├── layouts/
│   │   └── DashboardLayout.jsx # Authenticated app shell (Navbar + Sidebar + Outlet)
│   ├── pages/               # Route views
│   │   ├── Dashboard.jsx
│   │   ├── DiscoverWaves.jsx
│   │   ├── History.jsx
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── Profile.jsx
│   │   ├── Register.jsx
│   │   ├── Settings.jsx
│   │   └── WaveRoom.jsx
│   ├── App.jsx              # Central state management, routes & modal containers
│   ├── index.css            # Global CSS variables, design tokens & responsive styles
│   └── main.jsx             # DOM mounting entry point with BrowserRouter
├── .env.example             # Template for environment configuration
├── .gitignore               # Comprehensive Git ignore rules
├── index.html               # Main HTML entry template
├── package.json             # Dependencies and build scripts
├── vite.config.js           # Vite development and build settings
└── README.md                # Project documentation
```

---

## ⚙️ Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (Version 18.0.0 or higher recommended)
- `npm` (bundled with Node.js) or `yarn` / `pnpm`

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd syncwave
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables (Optional):**
   ```bash
   cp .env.example .env
   ```

---

## 💻 Available Scripts

In the project directory, you can run:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the local development server at `http://localhost:5173/` with hot module replacement (HMR). |
| `npm run build` | Compiles and bundles production-ready assets into the `dist/` directory. |
| `npm run preview` | Locally serves the production build for testing prior to deployment. |

---

## 📊 Current Project Status

- **Status**: **Frontend MVP Complete (Ready for Backend Integration)**
- **Current Data Layer**: LocalStorage / In-Memory Mock State (simulated cross-tab persistence)
- **Next Phase (Upcoming)**:
  - Implementation of backend API (Node.js/Express or Python/FastAPI).
  - Secure user authentication with password hashing (bcrypt) and JWT tokens.
  - Database persistence (PostgreSQL / MongoDB).
  - Real-time WebSockets (Socket.io) for live multi-user room synchronization and chat.
  - Web Audio API integration for timer alert chimes.
