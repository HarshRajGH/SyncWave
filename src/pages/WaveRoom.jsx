import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ParticipantList from '../components/ParticipantList';
import ChatBox from '../components/ChatBox';
import ProgressBar from '../components/ProgressBar';
import Button from '../components/Button';

export default function WaveRoom({
  waves = [],
  currentUser,
  onToggleGoal,
  onEndWave,
}) {
  const { id } = useParams();
  const navigate = useNavigate();

  const wave = waves.find((w) => w.id === id);

  // If wave not found, redirect to dashboard
  useEffect(() => {
    if (!wave && waves.length > 0) {
      navigate('/dashboard');
    }
  }, [wave, waves, navigate]);

  // Session countdown timer state
  const initialSeconds = wave ? wave.duration * 60 : 1800;
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);
  const [quickNotes, setQuickNotes] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  // Seed default chat messages on mount
  useEffect(() => {
    if (wave && currentUser) {
      setChatMessages([
        {
          id: 'm1',
          author: wave.hostName || 'Host',
          text: "Welcome everyone! Let's start with the first goal.",
          me: wave.hostName === currentUser.name,
        },
        {
          id: 'm2',
          author: currentUser.name,
          text: 'Sounds good 👍 ready to focus.',
          me: true,
        },
      ]);
    }
  }, [wave?.id, currentUser?.name]);

  // Timer interval
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (wave) onEndWave(wave);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [wave, onEndWave]);

  if (!wave) {
    return (
      <div className="empty-state">
        <p>Loading Wave Room…</p>
      </div>
    );
  }

  // Format timer display MM:SS
  const mins = String(Math.floor(Math.max(secondsRemaining, 0) / 60)).padStart(2, '0');
  const secs = String(Math.max(secondsRemaining, 0) % 60).padStart(2, '0');

  // Goals progress
  const completedGoals = wave.goals.filter((g) => g.done).length;
  const totalGoals = wave.goals.length;

  const handleSendMessage = (text) => {
    const newMsg = {
      id: `msg-${Date.now()}`,
      author: currentUser.name,
      text,
      me: true,
    };
    setChatMessages((prev) => [...prev, newMsg]);

    // Simulated host reply after 900ms
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          author: wave.hostName || 'Study Lead',
          text: 'Noted! Keep pushing forward on the checklist.',
          me: false,
        },
      ]);
    }, 900);
  };

  return (
    <section id="view-room" className="view view-room">
      <div className="room-header">
        <div className="room-header-title">
          <div>
            <h1 id="roomWaveName">{wave.name}</h1>
            <p className="text-muted" id="roomWaveSubject" style={{ margin: '0.2em 0 0' }}>
              {wave.subject} · Hosted by {wave.hostName}
            </p>
          </div>
          <span className="live-dot">LIVE</span>
        </div>

        <div className="timer-chip" role="timer" aria-label="Time remaining">
          <span id="roomTimer">{mins}:{secs}</span>
          <span className="timer-label">remaining</span>
        </div>
      </div>

      <div className="room-grid">
        {/* Left Sidebar */}
        <aside className="room-sidebar">
          <section aria-labelledby="participantsHeading">
            <h2 id="participantsHeading" className="section-label" style={{ margin: '0 0 0.8rem' }}>
              Participants ({wave.participants.length}/{wave.max})
            </h2>
            <ParticipantList participants={wave.participants} max={wave.max} />
          </section>

          <section aria-labelledby="goalsHeading">
            <h2 id="goalsHeading" className="section-label" style={{ margin: '1.25rem 0 0.6rem' }}>
              Today's Goals
            </h2>

            <ProgressBar completed={completedGoals} total={totalGoals} />

            <ul className="goal-list">
              {wave.goals.length > 0 ? (
                wave.goals.map((g) => (
                  <li key={g.id} className={g.done ? 'is-done' : ''}>
                    <input
                      type="checkbox"
                      checked={g.done}
                      onChange={() => onToggleGoal(wave.id, g.id)}
                      aria-label={`Mark ${g.text} complete`}
                    />
                    <span>{g.text}</span>
                  </li>
                ))
              ) : (
                <li className="text-muted">No goals specified for this session.</li>
              )}
            </ul>

            <div className="field" style={{ marginTop: '1.25rem' }}>
              <label htmlFor="quickNotes">Quick notes</label>
              <textarea
                id="quickNotes"
                rows="3"
                placeholder="Jot down formulas, ideas, or reminders…"
                value={quickNotes}
                onChange={(e) => setQuickNotes(e.target.value)}
              />
            </div>
          </section>
        </aside>

        {/* Right Panel: Chat */}
        <ChatBox messages={chatMessages} onSendMessage={handleSendMessage} />
      </div>

      {/* Room Controls */}
      <div className="form-actions room-exit">
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          Leave Wave
        </Button>
        <Button variant="secondary" onClick={() => onEndWave(wave)}>
          End Wave now
        </Button>
      </div>
    </section>
  );
}
