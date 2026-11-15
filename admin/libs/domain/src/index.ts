/**
 * Domain types, mirroring the schema in docs/impl/01-er-diagram.md.
 *
 * Framework-agnostic on purpose: the display (plain TS) and the wireframe (React)
 * both consume these, and so will the hub agent.
 */

// ── Session state machine (docs/02-architecture.md, FR-SESS-11) ──────────────
// REVEAL → COLLECT → ENDED, not REVEAL → ENDED. COLLECT is the step that stops
// remotes leaving the room in pockets.
export type SessionState =
  | 'IDLE'
  | 'CHECK_IN'
  | 'ARMED'
  | 'OPEN'
  | 'LOCKED'
  | 'REVEAL'
  | 'PAUSED'
  | 'COLLECT'
  | 'ENDED'
  | 'ABORTED';

/** Screens that exist outside a session — see docs/impl/03-screens.md §3. */
export type DisplayScreen = SessionState | 'TEST_PICKER' | 'PRE_FLIGHT' | 'DISCONNECTED';

// ── People and hardware ──────────────────────────────────────────────────────

export type ConsentStatus = 'GRANTED' | 'WITHDRAWN' | 'NOT_RECORDED';
export type DeviceStatus = 'ACTIVE' | 'SPARE' | 'FAULTY' | 'RETIRED';

/** ADR-0005: role is orthogonal to status — a teacher remote can also be spare. */
export type DeviceRole = 'STUDENT' | 'TEACHER';

export interface Student {
  studentId: string;
  admissionNumber: string;
  /** The only PII in the model. Display names only on the hub — see NFR-PRIV-1. */
  fullName: string;
  consentStatus: ConsentStatus;
}

export interface Device {
  deviceId: string;
  /** Printed on the case: "R-14". */
  label: string;
  /** Home position in the rack, as an integer so the tray sorts physically. */
  traySlot: number | null;
  role: DeviceRole;
  status: DeviceStatus;
  /** Decivolts, from the last beacon (FR-REM-9). 29 = 2.9 V. */
  batteryDv: number | null;
}

// ── Test content ─────────────────────────────────────────────────────────────

export interface QuestionOption {
  optionIndex: 1 | 2 | 3 | 4;
  optionText: string;
  isCorrect: boolean;
}

export interface Question {
  questionId: string;
  sequenceNo: number;
  prompt: string;
  /** Drives font selection on an offline display (NFR-UX-6). */
  languageCode: string;
  secondsOverride: number | null;
  options: QuestionOption[];
}

export interface TestVersion {
  testVersionId: string;
  testCode: string;
  name: string;
  subject: string;
  defaultSecondsPerQuestion: number;
  questions: Question[];
}

// ── Live session ─────────────────────────────────────────────────────────────

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'NO_DEVICE';

export interface RosterEntry {
  student: Student;
  device: Device | null;
  status: AttendanceStatus;
  firstSeenAt: number | null;
}

export interface Response {
  deviceId: string;
  studentId: string | null;
  /** null = no answer, which is distinct from a wrong answer (FR-DATA-4). */
  selectedOptionIndex: 1 | 2 | 3 | 4 | null;
  isCorrect: boolean | null;
  elapsedMs: number;
  pressCount: number;
}

/** What a remote's LED shows after lockout. Pattern differs, not just colour (NFR-UX-3). */
export type Verdict = 'correct' | 'incorrect' | 'no_answer';

// ── Console login and staff (docs/impl/01-er-diagram.md, Domain 1) ──────────

/** `app_user` — the login identity. Separate from `Teacher`: heads and admins log in without teaching, and not every teacher has a login. */
export interface AppUser {
  userId: string;
  email: string;
  displayName: string;
  role: 'SCHOOL_ADMIN' | 'TEACHER';
  status: 'ACTIVE' | 'DISABLED';
  lastLoginAt: number | null;
}

/** `teacher` — the staff roster, kept separate from `AppUser` so authorship of past tests survives a login being revoked. */
export interface Teacher {
  teacherId: string;
  fullName: string;
  /** A teacher can hold any number of subjects — never restrict to one (wireframe-review-notes.md, "No artificial constraints"). */
  subjects: string[];
  status: 'ACTIVE' | 'INACTIVE';
}
