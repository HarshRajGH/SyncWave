import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login({ onLogin, currentUser, onLogout }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [formNote, setFormNote] = useState('');

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email is required.';
    } else if (!EMAIL_RE.test(email.trim())) {
      errs.email = 'Enter a valid email address.';
    }

    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setFormNote('Please fix the highlighted fields.');
      return;
    }

    const success = await onLogin(email.trim().toLowerCase(), password, remember);
    if (success) {
      setFormNote('');
      navigate('/dashboard');
    } else {
      setFormNote('Incorrect email or password. Please check your credentials or register a new account.');
    }
  };

  return (
    <>
      <Navbar currentUser={currentUser} onLogout={onLogout} />
      <main id="main-content">
        <section className="view view-auth">
          <div className="auth-card">
            <div className="tab-row" role="tablist" aria-label="Authentication mode">
              <button
                type="button"
                className="tab-btn is-active"
                role="tab"
                aria-selected="true"
              >
                Log in
              </button>
              <button
                type="button"
                className="tab-btn"
                role="tab"
                aria-selected="false"
                onClick={() => navigate('/register')}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
                <legend className="visually-hidden">Log in to SyncWave</legend>

                <div className="field">
                  <label htmlFor="loginEmail">Email</label>
                  <input
                    type="email"
                    id="loginEmail"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={!!errors.email}
                    aria-describedby="loginEmailError"
                    placeholder="e.g. harsh.raj@university.edu"
                  />
                  <p className="field-error" id="loginEmailError" aria-live="polite">
                    {errors.email || ''}
                  </p>
                </div>

                <div className="field">
                  <label htmlFor="loginPassword">Password</label>
                  <input
                    type="password"
                    id="loginPassword"
                    name="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={!!errors.password}
                    aria-describedby="loginPasswordError"
                    placeholder="••••••••"
                  />
                  <p className="field-error" id="loginPasswordError" aria-live="polite">
                    {errors.password || ''}
                  </p>
                </div>

                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <span>Keep me logged in on this device</span>
                </label>

                <Button variant="primary" block type="submit">
                  Log in
                </Button>

                {formNote && (
                  <p className="form-note is-error" aria-live="polite">
                    {formNote}
                  </p>
                )}

                <p className="text-muted" style={{ fontSize: '0.85rem', textAlign: 'center', marginTop: '1.25rem' }}>
                  Don't have an account yet?{' '}
                  <Link to="/register" style={{ fontWeight: 600 }}>
                    Register here
                  </Link>
                </p>
              </fieldset>
            </form>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <p>SyncWave — a focused space to study, together.</p>
      </footer>
    </>
  );
}
