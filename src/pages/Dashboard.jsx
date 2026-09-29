import React, { useState, useMemo } from 'react';
import StatCard from '../components/StatCard';
import WaveCard from '../components/WaveCard';
import Button from '../components/Button';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Dashboard({
  currentUser,
  waves = [],
  history = [],
  onJoinWave,
  onOpenCreateWave,
  searchQuery = '',
  onSearchChange,
}) {
  const [selectedSubject, setSelectedSubject] = useState('all');

  // Compute subjects list from current waves
  const subjects = useMemo(() => {
    const list = [...new Set(waves.map((w) => w.subject))];
    return list;
  }, [waves]);

  // Filtered waves
  const filteredWaves = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return waves.filter((w) => {
      const matchSubject = selectedSubject === 'all' || w.subject === selectedSubject;
      const matchSearch =
        !q ||
        w.name.toLowerCase().includes(q) ||
        w.subject.toLowerCase().includes(q) ||
        (w.description && w.description.toLowerCase().includes(q));
      return matchSubject && matchSearch;
    });
  }, [waves, selectedSubject, searchQuery]);

  // Statistics
  const activeCount = waves.length;
  const completedCount = history.length;
  const onlineCount = waves.reduce((sum, w) => sum + (w.participants?.length || 0), 0);
  const goalsCount = history.reduce((sum, h) => sum + (h.goalsCompleted || 0), 0);

  const firstName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Scholar';

  return (
    <section id="view-dashboard" className="view view-dashboard">
      <div className="view-header">
        <div>
          <h1 id="welcomeHeading">{getGreeting()}, {firstName} 👋</h1>
          <p className="text-muted">Browse active Waves or start your own focused session.</p>
        </div>
        <Button variant="primary" onClick={onOpenCreateWave}>
          + Create Wave
        </Button>
      </div>

      <div className="stat-cards">
        <StatCard
          label="Active Waves"
          value={activeCount}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0" />
            </svg>
          }
        />
        <StatCard
          label="Completed Waves"
          value={completedCount}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          }
        />
        <StatCard
          label="Students Online"
          value={onlineCount}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
        />
        <StatCard
          label="Goals Completed"
          value={goalsCount}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          }
        />
      </div>

      <form className="filter-bar" onSubmit={(e) => e.preventDefault()} role="search" aria-label="Filter waves">
        <div className="field field-inline">
          <label htmlFor="waveSearch">Search waves</label>
          <input
            type="search"
            id="waveSearch"
            placeholder="Search by name, subject, or description…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="field field-inline">
          <label htmlFor="subjectFilter">Subject</label>
          <select
            id="subjectFilter"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="all">All subjects</option>
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </form>

      <div className="filter-pills" role="group" aria-label="Quick subject filters">
        <button
          type="button"
          className={`pill ${selectedSubject === 'all' ? 'is-active' : ''}`}
          onClick={() => setSelectedSubject('all')}
        >
          All
        </button>
        {subjects.map((s) => (
          <button
            key={s}
            type="button"
            className={`pill ${selectedSubject === s ? 'is-active' : ''}`}
            onClick={() => setSelectedSubject(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <h2 className="section-label">Active Waves</h2>

      {filteredWaves.length > 0 ? (
        <div className="wave-grid" aria-live="polite">
          {filteredWaves.map((wave) => (
            <WaveCard
              key={wave.id}
              wave={wave}
              onJoin={onJoinWave}
              isJoined={wave.participants?.some((p) => p.id === currentUser?.id)}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0" />
          </svg>
          <p>No waves match your search yet. Try a different keyword or create one.</p>
          <Button variant="primary" onClick={onOpenCreateWave}>
            + Create Wave
          </Button>
        </div>
      )}
    </section>
  );
}
