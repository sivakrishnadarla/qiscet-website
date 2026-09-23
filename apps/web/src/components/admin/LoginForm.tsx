'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function LoginForm({ showDefaults }: { showDefaults: boolean }) {
  const router = useRouter();
  const [username, setUsername] = useState(showDefaults ? 'admin' : '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/cms-api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not sign in.');
      router.replace('/admin');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign in.');
      setBusy(false);
    }
  }

  return (
    <div className="admin-root flex min-h-screen items-center justify-center bg-navy-950 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-lift">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-saffron-600">QISCET Ongole</p>
        <h1 className="mt-1 font-display text-2xl font-extrabold text-navy-900">Staff CMS</h1>
        <p className="mt-2 text-sm leading-6 text-ink-soft">Create and edit pages, blog posts and gallery photographs. Pages are written in an answer-engine format so Google and AI tools can cite them.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="label">Username</span>
            <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required />
          </label>
          <label className="block">
            <span className="label">Password</span>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
          </label>
          {error ? <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
          <button className="btn-primary w-full" disabled={busy} type="submit">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Sign in
          </button>
        </form>
        {showDefaults ? (
          <div className="mt-5 rounded-2xl bg-navy-50 p-4 text-xs leading-5 text-navy-800">
            <p className="font-bold">Local preview only</p>
            <p className="mt-1">Admin: <span className="font-mono">admin</span> / <span className="font-mono">qiscet-admin</span></p>
            <p>Staff: <span className="font-mono">staff</span> / <span className="font-mono">qiscet-staff</span></p>
            <p className="mt-2 text-ink-muted">Set CMS_ADMIN_PASSWORD and CMS_STAFF_PASSWORD before this site is public. These defaults do not work on Vercel.</p>
          </div>
        ) : (
          <p className="mt-5 text-xs text-ink-muted">Accounts are set with CMS_ADMIN_USER / CMS_ADMIN_PASSWORD and CMS_STAFF_USER / CMS_STAFF_PASSWORD.</p>
        )}
      </div>
    </div>
  );
}
