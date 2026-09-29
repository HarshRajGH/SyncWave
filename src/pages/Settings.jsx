import React, { useState } from 'react';
import Button from '../components/Button';

export default function Settings({ onClearHistory }) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoScrollChat, setAutoScrollChat] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your completed study history? This action cannot be undone.')) {
      onClearHistory();
      setStatusMsg('Study history has been reset.');
      setTimeout(() => setStatusMsg(''), 3000);
    }
  };

  return (
    <section className="view">
      <div className="view-header">
        <div>
          <h1>Settings</h1>
          <p className="text-muted">Customize session controls, audio cues, and platform defaults.</p>
        </div>
      </div>

      <div className="form-card" style={{ maxWidth: '640px' }}>
        <h2 style={{ marginTop: 0 }}>Session Preferences</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.25rem' }}>
          <label className="checkbox-row" style={{ margin: 0 }}>
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
            />
            <div>
              <strong style={{ display: 'block', fontSize: '0.92rem', color: 'var(--color-ink)' }}>
                Session Timer Sound Alerts
              </strong>
              <span className="text-muted" style={{ fontSize: '0.82rem' }}>
                Play a subtle chime when study timer finishes or transitions.
              </span>
            </div>
          </label>

          <label className="checkbox-row" style={{ margin: 0 }}>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
            />
            <div>
              <strong style={{ display: 'block', fontSize: '0.92rem', color: 'var(--color-ink)' }}>
                Desktop & In-App Notifications
              </strong>
              <span className="text-muted" style={{ fontSize: '0.82rem' }}>
                Notify me when another student joins or sends a wave chat message.
              </span>
            </div>
          </label>

          <label className="checkbox-row" style={{ margin: 0 }}>
            <input
              type="checkbox"
              checked={autoScrollChat}
              onChange={(e) => setAutoScrollChat(e.target.checked)}
            />
            <div>
              <strong style={{ display: 'block', fontSize: '0.92rem', color: 'var(--color-ink)' }}>
                Auto-scroll Room Chat
              </strong>
              <span className="text-muted" style={{ fontSize: '0.82rem' }}>
                Keep study chat scrolled to the latest message automatically.
              </span>
            </div>
          </label>
        </div>

        <div style={{ borderTop: '1px solid var(--color-border)', margin: '1.75rem 0 1.25rem', paddingTop: '1.25rem' }}>
          <h2 style={{ fontSize: '1.05rem', color: 'var(--color-danger)' }}>Danger Zone</h2>
          <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
            Permanently clear local session tracking data stored on this device.
          </p>

          <Button variant="outline" onClick={handleClearHistory} style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}>
            Clear Study History
          </Button>

          {statusMsg && (
            <p style={{ color: 'var(--color-success)', fontSize: '0.85rem', marginTop: '0.75rem', fontWeight: 600 }}>
              {statusMsg}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
