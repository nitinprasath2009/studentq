import { useState, type FormEvent } from 'react';
import { IDENTITY_BY_ROLE } from '@studentq/console-ui';

/**
 * Login (docs/impl/03-screens.md §4). This app is School Admin-only
 * (ADR-0008) — there is no other account to sign into here. No backend
 * exists yet — any non-empty password signs in as the fixture identity.
 */
export function Login({ onSignedIn }: { onSignedIn: () => void }) {
  const identity = IDENTITY_BY_ROLE.SCHOOL_ADMIN;
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!password.trim()) {
      setError('Enter a password.');
      return;
    }
    setError(null);
    onSignedIn();
  }

  return (
    <div className="screen screen--auth">
      <div className="auth-card">
        <p className="brand">studentQ</p>
        <h1>Sign in — School Admin</h1>
        <p className="muted">{identity.displayName}</p>

        <form onSubmit={submit} noValidate>
          <label className="field">
            <span>Email</span>
            <input type="email" value={identity.email} readOnly />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>

          {error && <p className="field-error">{error}</p>}

          <button type="submit" className="btn btn--primary">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
