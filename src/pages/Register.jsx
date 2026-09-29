import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register({ onRegister, currentUser, onLogout }) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [formNote, setFormNote] = useState({ text: '', type: '' });

  const validate = () => {
    const errs = {};
    if (!name.trim()) {
      errs.name = 'Please enter your name.';
    }

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      setFormNote({ text: 'Please fix the highlighted fields.', type: 'is-error' });
      return;
    }

    const result = onRegister({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    });

    if (result.success) {
      setFormNote({ text: 'Account created! Redirecting to dashboard…', type: 'is-success' });
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } else {
      setFormNote({ text: result.message || 'An error occurred during registration.', type: 'is-error' });
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
                className="tab-btn"
                role="tab"
                aria-selected="false"
                onClick={() => navigate('/login')}
              >
                Log in
              </button>
              <button
                type="button"
                className="tab-btn is-active"
                role="tab"
                aria-selected="true"
              >
                Register
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
                <legend className="visually-hidden">Create a SyncWave account</legend>

                <div className="field">
                  <label htmlFor="regName">Name</label>
                  <input
                    type="text"
                    id="regName"
                    name="name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    aria-invalid={!!errors.name}
                    aria-describedby="regNameError"
                    placeholder="e.g. Harsh Raj"
                  />
                  <p className="field-error" id="regNameError" aria-live="polite">
                    {errors.name || ''}
                  </p>
                </div>

                <div className="field">
                  <label htmlFor="regEmail">Email</label>
                  <input
                    type="email"
                    id="regEmail"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={!!errors.email}
                    aria-describedby="regEmailError"
                    placeholder="e.g. harsh.raj@university.edu"
                  />
                  <p className="field-error" id="regEmailError" aria-live="polite">
                    {errors.email || ''}
                  </p>
                </div>

                <div className="field">
                  <label htmlFor="regPassword">Password</label>
                  <input
                    type="password"
                    id="regPassword"
                    name="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={!!errors.password}
                    aria-describedby="regPasswordError regPasswordHint"
                    placeholder="At least 6 characters"
                  />
                  <p className="field-hint" id="regPasswordHint">
                    Must be at least 6 characters.
                  </p>
                  <p className="field-error" id="regPasswordError" aria-live="polite">
                    {errors.password || ''}
                  </p>
                </div>

                <Button variant="primary" block type="submit">
                  Create account
                </Button>

                {formNote.text && (
                  <p className={`form-note ${formNote.type}`} aria-live="polite">
                    {formNote.text}
                  </p>
                )}

                <p className="text-muted" style={{ fontSize: '0.85rem', textAlign: 'center', marginTop: '1.25rem' }}>
                  Already have an account?{' '}
                  <Link to="/login" style={{ fontWeight: 600 }}>
                    Log in here
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
