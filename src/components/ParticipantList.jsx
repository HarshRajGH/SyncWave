import React from 'react';
import { getInitials } from '../data/mockData';

export default function ParticipantList({ participants = [], max = null }) {
  if (!participants.length) {
    return <p className="text-muted" style={{ margin: 0, fontSize: '0.88rem' }}>No participants yet.</p>;
  }

  return (
    <ul className="participant-list">
      {participants.map((p) => (
        <li key={p.id || p.name}>
          <span className="status-dot" aria-hidden="true" />
          <span className="avatar avatar-sm">{getInitials(p.name)}</span>
          <span style={{ fontWeight: 500 }}>{p.name}</span>
        </li>
      ))}
      {max && participants.length >= max && (
        <li style={{ color: 'var(--color-danger)', fontSize: '0.8rem', fontWeight: 600 }}>
          Room at maximum capacity ({max}/{max})
        </li>
      )}
    </ul>
  );
}
