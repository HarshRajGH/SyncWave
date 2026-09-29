import React from 'react';

export default function StatCard({ label, value, icon, delta = null }) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <span className="stat-card-label">{label}</span>
        {icon && <span className="stat-card-icon">{icon}</span>}
      </div>
      <div className="stat-card-value">{value}</div>
      {delta && <div className="stat-card-delta">{delta}</div>}
    </div>
  );
}
