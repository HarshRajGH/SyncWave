import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login({ onLogin, onGoogleAuth, currentUser, onLogout }) {
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

    const res = await onLogin(email.trim().toLowerCase(), password, remember);
    if (res && res.success) {
      setFormNote('');
      navigate('/dashboard');
    } else {
      setFormNote(res?.message || 'No account found or incorrect credentials. Please register first.');
    }
  };

  const handleGoogleClick = async () => {
    if (onGoogleAuth) {
      const googleEmail = prompt('Enter your Google Account email for Google Sign-In:');
      if (!googleEmail || !googleEmail.trim()) return;
      const googleName = prompt('Enter your Display Name:') || googleEmail.split('@')[0];
      const res = await onGoogleAuth({
        email: googleEmail.trim().toLowerCase(),
        name: googleName.trim(),
        googleId: `google-user-${Date.now()}`,
      });
      if (res && res.success) {
        navigate('/dashboard');
      }
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

                <div style={{ textAlign: 'center', margin: '1.2rem 0 0.8rem', color: 'var(--color-muted)', fontSize: '0.85rem' }}>
                  <span>— or —</span>
                </div>

                <Button
                  variant="outline"
                  block
                  type="button"
                  onClick={handleGoogleClick}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with Google</span>
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
