import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from './Button';
import { getInitials } from '../data/mockData';

export default function Navbar({
  currentUser,
  onLogout,
  searchQuery = '',
  onSearchChange,
  notificationCount = 0,
}) {
  const navigate = useNavigate();

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand" aria-label="SyncWave home">
          <svg className="brand-mark" viewBox="0 0 32 32" width="26" height="26" aria-hidden="true">
            <path
              d="M2 20c3-6 6-6 9 0s6 6 9 0 6-6 9 0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M2 26c3-6 6-6 9 0s6 6 9 0 6-6 9 0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.45"
            />
          </svg>
          <span>SyncWave</span>
        </Link>

        {currentUser && (
          <div className="topbar-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <input
              type="text"
              placeholder="Search waves…"
              value={searchQuery}
              onChange={(e) => {
                if (onSearchChange) onSearchChange(e.target.value);
                navigate('/dashboard');
              }}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                width: '100%',
                fontSize: '0.88rem',
                color: 'inherit',
                fontFamily: 'inherit',
              }}
            />
          </div>
        )}

        <div className="header-actions">
          {currentUser ? (
            <>
              <button
                type="button"
                className="icon-btn"
                aria-label="Notifications"
                title={`${notificationCount} Notifications`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 8a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 12 6 8Z" />
                  <path d="M9.5 17a2.5 2.5 0 0 0 5 0" />
                </svg>
              </button>

              <Link to="/profile" className="session-badge" style={{ textDecoration: 'none' }}>
                <span className="avatar">{getInitials(currentUser.name)}</span>
                <span>{currentUser.name.split(' ')[0]}</span>
              </Link>

              <Button variant="outline" onClick={onLogout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => navigate('/login')}>
                Log in
              </Button>
              <Button variant="primary" onClick={() => navigate('/register')}>
                Register
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
