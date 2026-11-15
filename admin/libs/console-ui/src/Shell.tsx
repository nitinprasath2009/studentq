import type { ReactNode } from 'react';
import { NAV, ROLE_LABEL, type Role } from './nav.js';
import { IDENTITY_BY_ROLE } from './fixtures.js';

/**
 * Shared console chrome (ADR-0008 — the console is three separate apps, one
 * per role). Each app renders this with its own fixed `role`; there is no
 * in-shell role switcher anywhere.
 *
 * Every top-level nav item is a single, flat, clickable entry — it goes
 * straight to that area's page, which lays its own sub-sections out as
 * horizontal tabs. No expand/collapse folders, no bulleted child list.
 *
 * `schools`/`selectedSchoolId`/`onSchoolChange` are only meaningful for the
 * Marek Support app (the "Viewing school" selector) — every other app omits
 * them.
 */
export function Shell({
  role,
  schoolName,
  schools,
  selectedSchoolId,
  onSchoolChange,
  activeId,
  onNavigate,
  onSignOut,
  children,
}: {
  role: Role;
  /** The signed-in user's own school, when the app knows it from the real backend. */
  schoolName?: string;
  schools?: import('./fixtures.js').SchoolRow[];
  selectedSchoolId?: string;
  onSchoolChange?: (schoolId: string) => void;
  activeId: string;
  onNavigate: (itemId: string, childId: string) => void;
  onSignOut: () => void;
  children: ReactNode;
}) {
  return (
    <div className="shell">
      <aside className="shell__sidebar">
        <div className="shell__brand">studentQ</div>

        {role === 'MAREK_SUPPORT' && schools && selectedSchoolId !== undefined && onSchoolChange && (
          <label className="role-switch">
            <span>Viewing school</span>
            <select value={selectedSchoolId} onChange={(e) => onSchoolChange(e.target.value)}>
              {schools.map((s) => (
                <option key={s.schoolId} value={s.schoolId}>{s.name} ({s.onboardingStatus})</option>
              ))}
            </select>
          </label>
        )}

        <nav className="shell__nav">
          {NAV[role].map((section, i) => (
            <div key={section.title || i} className="nav-section">
              {section.title && <div className="nav-section__title">{section.title}</div>}
              {section.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`nav-item ${item.id === activeId ? 'is-active' : ''}`}
                  onClick={() => onNavigate(item.id, item.children[0]?.id ?? '')}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <button type="button" className="btn btn--ghost shell__signout" onClick={onSignOut}>
          Sign out
        </button>
      </aside>

      <div className="shell__main">
        <header className="shell__topbar">
          <span className="muted">{ROLE_LABEL[role]}{schoolName ? ` · ${schoolName}` : ''}</span>
          <span className="shell__user">{IDENTITY_BY_ROLE[role].displayName}</span>
        </header>
        <main className="shell__content">{children}</main>
      </div>
    </div>
  );
}
