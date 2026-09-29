import React, { useState } from 'react';
import Button from '../components/Button';
import { getInitials } from '../data/mockData';

export default function Profile({ currentUser, onUpdateProfile, history = [] }) {
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [isSaved, setIsSaved] = useState(false);

  const totalSessions = history.length;
  const totalGoals = history.reduce((sum, h) => sum + (h.goalsCompleted || 0), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    onUpdateProfile({
      ...currentUser,
      name: name.trim(),
      email: email.trim().toLowerCase(),
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <section className="view">
      <div className="view-header">
        <div>
          <h1>My Profile</h1>
          <p className="text-muted">Manage your personal details, academic preferences, and credentials.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
        {/* Profile Info Card */}
        <div className="form-card" style={{ maxWidth: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <span className="avatar" style={{ width: '56px', height: '56px', fontSize: '1.4rem' }}>
              {getInitials(currentUser?.name || 'User')}
            </span>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.25rem' }}>{currentUser?.name || 'Student'}</h2>
              <p className="text-muted" style={{ margin: '0.2em 0 0', fontSize: '0.88rem' }}>
                {currentUser?.email || ''}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="profName">Display Name</label>
              <input
                id="profName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="profEmail">Email Address</label>
              <input
                id="profEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
              {isSaved && (
                <span style={{ color: 'var(--color-success)', fontSize: '0.88rem', fontWeight: 600 }}>
                  Profile updated successfully!
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Academic Stats summary card */}
        <div className="form-card" style={{ maxWidth: 'none' }}>
          <h2 style={{ marginTop: 0 }}>Academic Momentum</h2>
          <p className="text-muted" style={{ fontSize: '0.88rem', marginBottom: '1.25rem' }}>
            Milestones tracked from your active study sessions.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>Completed Waves</span>
              <strong style={{ color: 'var(--color-accent-dark)' }}>{totalSessions} sessions</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>Goals Completed</span>
              <strong style={{ color: 'var(--color-success)' }}>{totalGoals} goals</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>Study Status</span>
              <span className="live-dot" style={{ background: 'var(--color-success-tint)', color: 'var(--color-success)' }}>
                ACTIVE SCHOLAR
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
