import React from 'react';

export default function ProgressBar({ completed = 0, total = 0, showText = true, className = '' }) {
  const percentage = total > 0 ? Math.min(Math.round((completed / total) * 100), 100) : 0;

  return (
    <div className={`progress-container ${className}`}>
      <div className="progress-track" role="progressbar" aria-valuenow={percentage} aria-valuemin="0" aria-valuemax="100">
        <span style={{ width: `${percentage}%` }} />
      </div>
      {showText && (
        <p className="goal-progress">
          {completed} / {total} completed ({percentage}%)
        </p>
      )}
    </div>
  );
}
