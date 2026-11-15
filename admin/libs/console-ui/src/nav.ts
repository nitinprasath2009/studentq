/**
 * Route table for the wireframe (docs/impl/03-screens.md §4-6).
 * Desktop-first for now, per the disposable-wireframe decision — this is not
 * the real router; a real one arrives with the actual Phase C build.
 *
 * Every top-level item is a single, flat entry in the sidebar (no folders, no
 * bulleted sub-list — wireframe-review-notes.md). `children` are what used to
 * be separate nav entries; each screen now renders them as horizontal tabs,
 * and `children[0].id` is the tab a top-level click (or a deep link from
 * elsewhere) lands on by default.
 */

export type Role = 'TEACHER' | 'SCHOOL_ADMIN' | 'MAREK_SUPPORT';

export interface NavChild {
  id: string;
  label: string;
}

export interface NavItem {
  id: string;
  label: string;
  children: NavChild[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const NAV: Record<Role, NavSection[]> = {
  TEACHER: [
    {
      title: '',
      items: [
        {
          id: 't3', label: 'Tests', children: [
            { id: 'list', label: 'Lists' },
            { id: 'new-test', label: '+ Edit test' },
          ],
        },
        {
          id: 't9', label: 'Classes', children: [
            { id: 'list', label: 'Classes' },
          ],
        },
        {
          id: 't13', label: 'Reports', children: [
            { id: 'history', label: 'Session history' },
            { id: 'results', label: 'Session results' },
            { id: 'distractor', label: 'Distractor analysis' },
            { id: 'difficulty', label: 'Question difficulty' },
            { id: 'trend', label: 'Student trend' },
            { id: 'responseTime', label: 'Response-time view' },
            { id: 'attendance', label: 'Attendance' },
            { id: 'csv', label: 'Export (CSV)' },
          ],
        },
      ],
    },
  ],
  SCHOOL_ADMIN: [
    {
      title: '',
      items: [
        {
          id: 'a1', label: 'Setup', children: [
            { id: 'years', label: 'Academic years' },
            { id: 'classrooms', label: 'Classrooms' },
            { id: 'rosterImport', label: 'Roster import' },
          ],
        },
        {
          id: 'a4', label: 'People', children: [
            { id: 'consent', label: 'Consent' },
            { id: 'teachers', label: 'Teachers' },
            { id: 'assignments', label: 'Teacher ↔ classroom' },
            { id: 'lifecycle', label: 'Student lifecycle' },
          ],
        },
        {
          id: 'a8', label: 'Governance', children: [
            { id: 'rollover', label: 'Year rollover' },
            { id: 'withdrawal', label: 'Consent withdrawal' },
            { id: 'schoolSettings', label: 'School settings' },
            { id: 'crossClass', label: 'Cross-class reports' },
          ],
        },
      ],
    },
  ],
  MAREK_SUPPORT: [
    {
      title: '',
      items: [
        {
          id: 'm1', label: 'Fleet', children: [
            { id: 'schools', label: 'Schools' },
            { id: 'devices', label: 'Device provisioning' },
            { id: 'hubs', label: 'Hub provisioning' },
          ],
        },
        {
          id: 'm4', label: 'Operations', children: [
            { id: 'health', label: 'Fleet health' },
            { id: 'firmware', label: 'Firmware releases' },
            { id: 'rma', label: 'Device RMA' },
            { id: 'tokens', label: 'Token rotation' },
          ],
        },
      ],
    },
  ],
};

/** First item and first child for a role, used as the landing screen on sign-in / role switch. */
export function firstEnabled(role: Role): { itemId: string; childId: string | null } {
  const item = NAV[role][0].items[0];
  return { itemId: item.id, childId: item.children[0]?.id ?? null };
}

export const ROLE_LABEL: Record<Role, string> = {
  TEACHER: 'Teacher',
  SCHOOL_ADMIN: 'School admin',
  MAREK_SUPPORT: 'Marek support',
};
