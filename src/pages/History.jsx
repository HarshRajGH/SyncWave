import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

export default function History({ history = [], onOpenCreateWave }) {
  const navigate = useNavigate();

  return (
    <section id="view-history" className="view view-history">
      <div className="view-header">
        <div>
          <h1>My Study History</h1>
          <p className="text-muted">A permanent record of study sessions, sprints, and completed goals.</p>
        </div>
        <Button variant="primary" onClick={onOpenCreateWave}>
          + Create Wave
        </Button>
      </div>

      {history.length > 0 ? (
        <ul className="history-list">
          {history.map((h) => {
            const dateStr = h.completedAt
              ? new Date(h.completedAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Recently completed';

            return (
              <li key={h.id}>
                <div>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--color-ink)' }}>
                    {h.waveName}
                  </strong>
                  <p className="text-muted" style={{ margin: '0.2em 0 0', fontSize: '0.86rem' }}>
                    {h.subject} · {h.duration} min · {dateStr}
                  </p>
                </div>
                <span className="history-badge">
                  {h.goalsCompleted}/{h.goalsTotal} goals · {h.participants} participants
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <div id="historyEmpty" className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3.5 2" />
          </svg>
          <p>You haven't completed a Wave yet — finish one to see your milestones and achievements here.</p>
          <Button variant="primary" onClick={() => navigate('/waves')}>
            Browse Active Waves
          </Button>
        </div>
      )}
    </section>
  );
}
