import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import {
  STORAGE_KEYS,
  INITIAL_WAVES,
  SUBJECT_SUGGESTIONS,
  readStorage,
  writeStorage,
} from './data/mockData';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DiscoverWaves from './pages/DiscoverWaves';
import WaveRoom from './pages/WaveRoom';
import History from './pages/History';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

// Components
import Modal from './components/Modal';
import Button from './components/Button';

export default function App() {
  const navigate = useNavigate();

  // --- Auth State ---
  const [currentUser, setCurrentUser] = useState(() => {
    const session = readStorage(STORAGE_KEYS.session, null);
    if (session) return session;
    const rememberedEmail = localStorage.getItem(STORAGE_KEYS.remember);
    if (rememberedEmail) {
      const users = readStorage(STORAGE_KEYS.users, []);
      return users.find((u) => u.email === rememberedEmail) || null;
    }
    return null;
  });

  // --- Waves State ---
  const [waves, setWaves] = useState(() => {
    const saved = readStorage(STORAGE_KEYS.waves, null);
    if (saved && Array.isArray(saved) && saved.length > 0) return saved;
    writeStorage(STORAGE_KEYS.waves, INITIAL_WAVES);
    return INITIAL_WAVES;
  });

  // --- History State ---
  const [history, setHistory] = useState(() => {
    return readStorage(STORAGE_KEYS.history, []);
  });

  // --- Users State ---
  const [users, setUsers] = useState(() => {
    return readStorage(STORAGE_KEYS.users, []);
  });

  // --- UI States ---
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [completedWave, setCompletedWave] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Form state for Create Wave modal
  const [newWaveName, setNewWaveName] = useState('');
  const [newWaveSubject, setNewWaveSubject] = useState('');
  const [newWaveDuration, setNewWaveDuration] = useState('30');
  const [newWaveMax, setNewWaveMax] = useState('5');
  const [newWaveDesc, setNewWaveDesc] = useState('');
  const [newWaveGoals, setNewWaveGoals] = useState('');
  const [createErrors, setCreateErrors] = useState({});

  // Sync auth class with document body for navbar/sidebar responsive styles
  useEffect(() => {
    document.body.classList.toggle('is-authed', !!currentUser);
  }, [currentUser]);

  // Persist state changes
  useEffect(() => {
    writeStorage(STORAGE_KEYS.waves, waves);
  }, [waves]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.history, history);
  }, [history]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.users, users);
  }, [users]);

  // Listen for storage changes across tabs
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === STORAGE_KEYS.waves) {
        setWaves(readStorage(STORAGE_KEYS.waves, []));
      }
      if (e.key === STORAGE_KEYS.history) {
        setHistory(readStorage(STORAGE_KEYS.history, []));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // --- Toast Manager ---
  const showToast = useCallback((message, type = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type, visible: false }]);

    requestAnimationFrame(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, visible: true } : t))
      );
    });

    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, visible: false } : t))
      );
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 250);
    }, 3200);
  }, []);

  // --- Auth Handlers ---
  const handleLogin = (email, password, remember) => {
    const found = users.find((u) => u.email === email && u.password === password);
    if (found) {
      setCurrentUser(found);
      writeStorage(STORAGE_KEYS.session, found);
      if (remember) {
        localStorage.setItem(STORAGE_KEYS.remember, email);
      } else {
        localStorage.removeItem(STORAGE_KEYS.remember);
      }
      showToast(`Welcome back, ${found.name.split(' ')[0]}!`);
      return true;
    }
    return false;
  };

  const handleRegister = ({ name, email, password }) => {
    const exists = users.some((u) => u.email === email);
    if (exists) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser = { id: `user-${Date.now()}`, name, email, password };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    writeStorage(STORAGE_KEYS.session, newUser);
    showToast(`Account created! Welcome to SyncWave, ${name}!`);
    return { success: true };
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.session);
    showToast('Logged out.');
    navigate('/');
  };

  const handleUpdateProfile = (updated) => {
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    writeStorage(STORAGE_KEYS.session, updated);
    showToast('Profile updated successfully.');
  };

  // --- Wave Handlers ---
  const handleJoinWave = (waveId) => {
    const target = waves.find((w) => w.id === waveId);
    if (!target) return;

    if (!currentUser) {
      navigate('/login');
      return;
    }

    const isAlreadyParticipant = target.participants.some((p) => p.id === currentUser.id);

    if (!isAlreadyParticipant) {
      if (target.participants.length >= target.max) {
        showToast('This study wave has reached maximum capacity.', 'error');
        return;
      }
      const updatedWave = {
        ...target,
        participants: [...target.participants, { id: currentUser.id, name: currentUser.name }],
      };
      setWaves((prev) => prev.map((w) => (w.id === waveId ? updatedWave : w)));
    }

    showToast(`Joined "${target.name}".`);
    navigate(`/waves/${waveId}`);
  };

  const handleToggleGoal = (waveId, goalId) => {
    setWaves((prev) =>
      prev.map((w) => {
        if (w.id !== waveId) return w;
        return {
          ...w,
          goals: w.goals.map((g) => (g.id === goalId ? { ...g, done: !g.done } : g)),
        };
      })
    );
  };

  const handleEndWave = (wave) => {
    const goalsCompleted = wave.goals.filter((g) => g.done).length;
    const historyEntry = {
      id: `hist-${Date.now()}`,
      waveName: wave.name,
      subject: wave.subject,
      duration: wave.duration,
      goalsCompleted,
      goalsTotal: wave.goals.length,
      participants: wave.participants.length,
      completedAt: Date.now(),
    };

    setHistory((prev) => [historyEntry, ...prev]);
    setWaves((prev) => prev.filter((w) => w.id !== wave.id));
    setCompletedWave(historyEntry);
  };

  const handleClearHistory = () => {
    setHistory([]);
    writeStorage(STORAGE_KEYS.history, []);
    showToast('History cleared.');
  };

  // --- Create Wave Form Submit ---
  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const errs = {};

    if (!newWaveName.trim()) errs.name = 'Give your Wave a name.';
    if (!newWaveSubject.trim()) errs.subject = 'Subject is required.';
    const maxVal = Number(newWaveMax);
    if (isNaN(maxVal) || maxVal < 2 || maxVal > 12) errs.max = 'Choose between 2 and 12 participants.';

    if (Object.keys(errs).length > 0) {
      setCreateErrors(errs);
      return;
    }

    const goalsParsed = newWaveGoals.trim()
      ? newWaveGoals
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean)
          .map((text, idx) => ({ id: `g${idx}`, text, done: false }))
      : [];

    const newWave = {
      id: `wave-${Date.now()}`,
      name: newWaveName.trim(),
      subject: newWaveSubject.trim(),
      duration: Number(newWaveDuration),
      max: maxVal,
      description: newWaveDesc.trim(),
      goals: goalsParsed,
      participants: [{ id: currentUser.id, name: currentUser.name }],
      hostName: currentUser.name,
      createdAt: Date.now(),
    };

    setWaves((prev) => [newWave, ...prev]);

    // Reset Form
    setNewWaveName('');
    setNewWaveSubject('');
    setNewWaveDuration('30');
    setNewWaveMax('5');
    setNewWaveDesc('');
    setNewWaveGoals('');
    setCreateErrors({});
    setIsCreateOpen(false);

    showToast(`Wave "${newWave.name}" created.`);
    navigate(`/waves/${newWave.id}`);
  };

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <Landing
              currentUser={currentUser}
              onLogout={handleLogout}
              waves={waves}
            />
          }
        />
        <Route
          path="/login"
          element={
            <Login
              onLogin={handleLogin}
              currentUser={currentUser}
              onLogout={handleLogout}
            />
          }
        />
        <Route
          path="/register"
          element={
            <Register
              onRegister={handleRegister}
              currentUser={currentUser}
              onLogout={handleLogout}
            />
          }
        />

        {/* Authenticated Dashboard Shell Layout */}
        <Route
          element={
            <DashboardLayout
              currentUser={currentUser}
              onLogout={handleLogout}
              onOpenCreateWave={() => setIsCreateOpen(true)}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          }
        >
          <Route
            path="/dashboard"
            element={
              <Dashboard
                currentUser={currentUser}
                waves={waves}
                history={history}
                onJoinWave={handleJoinWave}
                onOpenCreateWave={() => setIsCreateOpen(true)}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            }
          />
          <Route
            path="/waves"
            element={
              <DiscoverWaves
                waves={waves}
                currentUser={currentUser}
                onJoinWave={handleJoinWave}
                onOpenCreateWave={() => setIsCreateOpen(true)}
              />
            }
          />
          <Route
            path="/waves/:id"
            element={
              <WaveRoom
                waves={waves}
                currentUser={currentUser}
                onToggleGoal={handleToggleGoal}
                onEndWave={handleEndWave}
              />
            }
          />
          <Route
            path="/history"
            element={
              <History
                history={history}
                onOpenCreateWave={() => setIsCreateOpen(true)}
              />
            }
          />
          <Route
            path="/profile"
            element={
              <Profile
                currentUser={currentUser}
                onUpdateProfile={handleUpdateProfile}
                history={history}
              />
            }
          />
          <Route
            path="/settings"
            element={<Settings onClearHistory={handleClearHistory} />}
          />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Landing currentUser={currentUser} onLogout={handleLogout} waves={waves} />} />
      </Routes>

      {/* --- Create Wave Modal --- */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create your Wave"
      >
        <p className="text-muted" style={{ margin: '-0.5rem 0 1.25rem', fontSize: '0.88rem' }}>
          Set a clear, time-boxed goal — a Wave works best focused on one topic.
        </p>

        <form onSubmit={handleCreateSubmit} noValidate>
          <div className="field">
            <label htmlFor="modalWaveName">Wave name</label>
            <input
              type="text"
              id="modalWaveName"
              placeholder="e.g. MERN Stack Microservices"
              value={newWaveName}
              onChange={(e) => setNewWaveName(e.target.value)}
              aria-invalid={!!createErrors.name}
            />
            {createErrors.name && (
              <p className="field-error">{createErrors.name}</p>
            )}
          </div>

          <div className="field">
            <label htmlFor="modalWaveSubject">Subject</label>
            <input
              type="text"
              id="modalWaveSubject"
              list="subjectListSuggestions"
              placeholder="Select or type subject…"
              value={newWaveSubject}
              onChange={(e) => setNewWaveSubject(e.target.value)}
              aria-invalid={!!createErrors.subject}
            />
            <datalist id="subjectListSuggestions">
              {SUBJECT_SUGGESTIONS.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
            {createErrors.subject && (
              <p className="field-error">{createErrors.subject}</p>
            )}
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="modalWaveDuration">Duration</label>
              <select
                id="modalWaveDuration"
                value={newWaveDuration}
                onChange={(e) => setNewWaveDuration(e.target.value)}
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="modalWaveMax">Max Participants</label>
              <input
                type="number"
                id="modalWaveMax"
                min="2"
                max="12"
                value={newWaveMax}
                onChange={(e) => setNewWaveMax(e.target.value)}
                aria-invalid={!!createErrors.max}
              />
              {createErrors.max && (
                <p className="field-error">{createErrors.max}</p>
              )}
            </div>
          </div>

          <div className="field">
            <label htmlFor="modalWaveDesc">Description</label>
            <textarea
              id="modalWaveDesc"
              rows="3"
              maxLength={200}
              placeholder="What specific tasks are you tackling?"
              value={newWaveDesc}
              onChange={(e) => setNewWaveDesc(e.target.value)}
            />
            <p className="field-hint" style={{ textAlign: 'right' }}>
              {newWaveDesc.length} / 200
            </p>
          </div>

          <div className="field">
            <label htmlFor="modalWaveGoals">Goals for this session</label>
            <textarea
              id="modalWaveGoals"
              rows="2"
              placeholder="One goal per line, e.g.&#10;Arrays&#10;Linked List"
              value={newWaveGoals}
              onChange={(e) => setNewWaveGoals(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create Wave
            </Button>
          </div>
        </form>
      </Modal>

      {/* --- Wave Completed Dialog Modal --- */}
      {completedWave && (
        <Modal
          isOpen={true}
          onClose={() => {
            setCompletedWave(null);
            navigate('/dashboard');
          }}
          title="Wave completed"
          maxWidth="400px"
        >
          <p className="complete-name" style={{ fontSize: '1.05rem', margin: '0 0 1rem' }}>
            {completedWave.waveName}
          </p>
          <dl className="complete-stats">
            <div>
              <dt>Goals completed</dt>
              <dd>{completedWave.goalsCompleted}/{completedWave.goalsTotal}</dd>
            </div>
            <div>
              <dt>Participants</dt>
              <dd>{completedWave.participants}</dd>
            </div>
            <div>
              <dt>Duration</dt>
              <dd>{completedWave.duration} min</dd>
            </div>
          </dl>
          <Button
            variant="primary"
            block
            onClick={() => {
              setCompletedWave(null);
              navigate('/dashboard');
            }}
          >
            Back to Dashboard
          </Button>
        </Modal>
      )}

      {/* --- Toast Stack Notifications --- */}
      <div className="toast-stack" id="toastStack" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast toast-${t.type} ${t.visible ? 'is-visible' : ''}`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </>
  );
}
