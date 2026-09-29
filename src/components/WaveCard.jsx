import React from 'react';
import Button from './Button';
import { getInitials } from '../data/mockData';

export default function WaveCard({ wave, onJoin, isJoined = false }) {
  const isFull = wave.participants.length >= wave.max;
  const shownParticipants = wave.participants.slice(0, 3);
  const extraParticipants = wave.participants.length - shownParticipants.length;

  return (
    <article className="wave-card">
      <div className="wave-card-top">
        <h3>{wave.name}</h3>
        <span className="subject-tag">{wave.subject}</span>
      </div>

      <p className="wave-desc">{wave.description || 'Focused study and sprint session.'}</p>

      <div className="wave-meta">
        <span className={isFull ? 'wave-full' : ''}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
          </svg>
          {wave.participants.length}/{wave.max}
        </span>
        <span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3.5 2" />
          </svg>
          {wave.duration} min
        </span>
      </div>

      <div className="wave-card-footer">
        <div className="avatar-stack">
          {shownParticipants.map((p) => (
            <span key={p.id || p.name} className="avatar avatar-sm" title={p.name}>
              {getInitials(p.name)}
            </span>
          ))}
          {extraParticipants > 0 && (
            <span className="avatar avatar-sm avatar-more">+{extraParticipants}</span>
          )}
        </div>

        <Button
          variant="primary"
          disabled={isFull && !isJoined}
          onClick={() => onJoin(wave.id)}
        >
          {isJoined ? 'Enter Room' : isFull ? 'Wave full' : 'Join Wave'}
        </Button>
      </div>
    </article>
  );
}
