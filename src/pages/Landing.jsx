import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';

export default function Landing({ currentUser, onLogout, waves = [] }) {
  const navigate = useNavigate();

  const activeCount = waves.length;
  const onlineCount = waves.reduce((sum, w) => sum + (w.participants?.length || 0), 0);

  return (
    <>
      <Navbar currentUser={currentUser} onLogout={onLogout} />
      <main id="main-content">
        <section id="view-landing" className="view view-landing">
          <div className="landing-grid">
            <div className="landing-copy">
              <h1>Study together. Stay synchronized.</h1>
              <p className="lede">
                Connect with students in focused, real-time study sessions called Waves — one shared timer, one shared goal list, one shared room.
              </p>

              <div className="cta-row">
                <Button
                  variant="primary"
                  onClick={() => navigate(currentUser ? '/dashboard' : '/register')}
                >
                  + Create a Wave
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate(currentUser ? '/waves' : '/login')}
                >
                  Join a Wave
                </Button>
              </div>

              <dl className="stat-row">
                <div>
                  <dt>Active waves</dt>
                  <dd>{activeCount}</dd>
                </div>
                <div>
                  <dt>Students online</dt>
                  <dd>{onlineCount}</dd>
                </div>
              </dl>
            </div>

            <div className="landing-visual" aria-hidden="true">
              <svg viewBox="0 0 220 220" className="hero-ring">
                <circle cx="110" cy="110" r="92" className="ring-track" />
                <circle cx="110" cy="110" r="92" className="ring-progress" />
                <text x="110" y="104" className="ring-time" textAnchor="middle">
                  28:00
                </text>
                <text x="110" y="126" className="ring-label" textAnchor="middle">
                  DSA Revision
                </text>
              </svg>
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <p>SyncWave — a focused space to study, together.</p>
      </footer>
    </>
  );
}
