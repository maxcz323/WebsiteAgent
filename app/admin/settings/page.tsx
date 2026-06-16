'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { useProfile } from '@/components/ProfileContext';

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function SettingsPage() {
  const { theme, toggle } = useTheme();
  const { refresh: refreshProfile } = useProfile();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [calUrl, setCalUrl] = useState('');
  const [calCopied, setCalCopied] = useState(false);

  const buildCalUrl = useCallback(async () => {
    const res = await fetch('/api/calendar/url');
    const { webcalUrl } = await res.json();
    if (webcalUrl) setCalUrl(webcalUrl);
  }, []);

  useEffect(() => {
    fetch('/api/profile').then((r) => r.json()).then((d) => setFullName(d.full_name ?? ''));
    fetch('/api/gmail/status').then((r) => r.json()); // just warm up
    buildCalUrl();

    import('@/lib/supabase-browser').then(({ supabaseBrowser }) => {
      supabaseBrowser().auth.getUser().then(({ data }) => {
        setEmail(data.user?.email ?? '');
      });
    });
  }, [buildCalUrl]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);
    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name: fullName }),
    });
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      await refreshProfile();
    } else {
      const d = await res.json();
      setError(d.error ?? 'Chyba při ukládání');
    }
    setSaving(false);
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Nastavení</h1>
        <p className="text-sm text-slate-400 mt-0.5">Profil a zobrazení</p>
      </div>

      {/* Profile */}
      <div className="card p-6 space-y-5">
        <h2 className="section-title">Profil</h2>

        <form onSubmit={handleSave} className="space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          {saved && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-sm px-4 py-3 rounded-lg">
              ✓ Uloženo
            </div>
          )}

          <div>
            <label className="label">Celé jméno</label>
            <input
              className="input"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Jan Novák"
              required
            />
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">Zobrazuje se v dashboardu ve sloupcích Zpracovává a Přidal.</p>
          </div>

          {email && (
            <div>
              <label className="label">Email</label>
              <p className="text-sm text-slate-500 dark:text-slate-400 py-2">{email}</p>
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Ukládám…' : 'Uložit profil'}
          </button>
        </form>
      </div>

      {/* Calendar */}
      <div className="card p-6 space-y-4">
        <h2 className="section-title">Sdílený kalendář</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Přidej tento odkaz do Apple Calendar (nebo Google / Outlook) a všechny aktivity z leadů se budou automaticky synchronizovat u celého týmu.
        </p>
        {calUrl && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                className="input flex-1 font-mono text-xs"
                value={calUrl}
                readOnly
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <button
                className="btn-secondary text-xs shrink-0"
                onClick={() => {
                  navigator.clipboard.writeText(calUrl);
                  setCalCopied(true);
                  setTimeout(() => setCalCopied(false), 2000);
                }}
              >
                {calCopied ? '✓ Zkopírováno' : 'Kopírovat'}
              </button>
            </div>
            <a
              href={calUrl}
              className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              Otevřít v Apple Calendar →
            </a>
            <p className="text-[11px] text-slate-400">
              Apple Calendar → Soubor → Nové předplacené předplatné → vlož URL. Kalendář se obnoví automaticky každou hodinu.
            </p>
          </div>
        )}
      </div>

      {/* Appearance */}
      <div className="card p-6 space-y-5">
        <h2 className="section-title">Zobrazení</h2>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Barevný režim</p>
            <p className="text-xs text-slate-400 mt-0.5">Volba se uloží a přetrvá po dalším otevření</p>
          </div>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 gap-1">
            <button
              onClick={() => theme === 'dark' && toggle()}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                theme === 'light'
                  ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <SunIcon />
              Světlý
            </button>
            <button
              onClick={() => theme === 'light' && toggle()}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                theme === 'dark'
                  ? 'bg-slate-700 text-slate-100 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <MoonIcon />
              Tmavý
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
