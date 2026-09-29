import React, { useState, useMemo } from 'react';
import WaveCard from '../components/WaveCard';
import Button from '../components/Button';

export default function DiscoverWaves({ waves = [], currentUser, onJoinWave, onOpenCreateWave }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');

  const subjects = useMemo(() => {
    return [...new Set(waves.map((w) => w.subject))];
  }, [waves]);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return waves.filter((w) => {
      const matchSub = selectedSubject === 'all' || w.subject === selectedSubject;
      const matchSearch =
        !q ||
        w.name.toLowerCase().includes(q) ||
        w.subject.toLowerCase().includes(q) ||
        (w.description && w.description.toLowerCase().includes(q));
      return matchSub && matchSearch;
    });
  }, [waves, selectedSubject, searchTerm]);

  return (
    <section className="view view-dashboard">
      <div className="view-header">
        <div>
          <h1>Discover Waves</h1>
          <p className="text-muted">Find live study groups, sprint sessions, and co-working rooms.</p>
        </div>
        <Button variant="primary" onClick={onOpenCreateWave}>
          + Create Wave
        </Button>
      </div>

      <form className="filter-bar" onSubmit={(e) => e.preventDefault()} role="search">
        <div className="field field-inline">
          <label htmlFor="discoverSearch">Search by keyword</label>
          <input
            id="discoverSearch"
            type="search"
            placeholder="Type subject, topic, or keyword…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="field field-inline">
          <label htmlFor="discoverSubject">Subject</label>
          <select
            id="discoverSubject"
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

      <div className="filter-pills">
        <button
          type="button"
          className={`pill ${selectedSubject === 'all' ? 'is-active' : ''}`}
          onClick={() => setSelectedSubject('all')}
        >
          All Subjects
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

      <h2 className="section-label">All Sessions ({filtered.length})</h2>

      {filtered.length > 0 ? (
        <div className="wave-grid">
          {filtered.map((w) => (
            <WaveCard
              key={w.id}
              wave={w}
              onJoin={onJoinWave}
              isJoined={w.participants?.some((p) => p.id === currentUser?.id)}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <p>No active study waves found matching your criteria.</p>
          <Button variant="primary" onClick={onOpenCreateWave}>
            Start a new Wave
          </Button>
        </div>
      )}
    </section>
  );
}
