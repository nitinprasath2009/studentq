/**
 * Data for the wireframe shell. No backend exists yet — every screen
 * renders against these fixtures, the same way apps/display renders against
 * its own until a real API is wired up.
 */

import type { AppUser, ConsentStatus, Device, Student, Teacher } from '@studentq/domain';

export type { Teacher };

export const CURRENT_USER: AppUser = {
  userId: 'usr-1',
  email: 'priya.chandra@ryanschool.example',
  displayName: 'Priya Chandra',
  role: 'TEACHER',
  status: 'ACTIVE',
  lastLoginAt: null,
};

export const CURRENT_TEACHER: Teacher = {
  teacherId: 'tch-1',
  fullName: 'Priya Chandra',
  subjects: ['Science'],
  status: 'ACTIVE',
};

// Three real logins (wireframe-review-notes.md — no "viewing as" switcher):
// each one is who the topbar shows once signed in as that role. Marek Support
// isn't a modelled `AppUser` role yet (ADR-0007 follow-on work), so it's kept
// as a display identity here rather than forced into the AppUser type.
export const IDENTITY_BY_ROLE: Record<'MAREK_SUPPORT' | 'SCHOOL_ADMIN' | 'TEACHER', { displayName: string; email: string }> = {
  MAREK_SUPPORT: { displayName: 'Arjun Kulkarni', email: 'arjun.kulkarni@mareksystems.example' },
  SCHOOL_ADMIN: { displayName: 'Meenal Deshpande', email: 'meenal.deshpande@ryanschool.example' },
  TEACHER: { displayName: CURRENT_USER.displayName, email: CURRENT_USER.email },
};

export interface RecentSession {
  sessionId: string;
  testCode: string;
  testName: string;
  classroomLabel: string;
  ranAt: string;
  respondedCount: number;
  rosterCount: number;
}

export interface Alert {
  id: string;
  severity: 'warn' | 'info';
  message: string;
}

export const RECENT_SESSIONS: RecentSession[] = [
  {
    sessionId: 'sess-1',
    testCode: 'M-12',
    testName: 'Solar System & Fractions',
    classroomLabel: '7A',
    ranAt: '2026-08-17T09:15:00+05:30',
    respondedCount: 47,
    rosterCount: 50,
  },
  {
    sessionId: 'sess-2',
    testCode: 'M-09',
    testName: 'States of Matter',
    classroomLabel: '7A',
    ranAt: '2026-08-14T09:15:00+05:30',
    respondedCount: 49,
    rosterCount: 50,
  },
  {
    sessionId: 'sess-3',
    testCode: 'M-11',
    testName: 'Multiplication tables',
    classroomLabel: '7B',
    ranAt: '2026-08-12T11:00:00+05:30',
    respondedCount: 44,
    rosterCount: 48,
  },
];

export const ALERTS: Alert[] = [
  { id: 'a1', severity: 'warn', message: '2 remotes in 7A tray are on low battery.' },
  { id: 'a2', severity: 'info', message: 'Class 7A consent for one child is not recorded.' },
];

// ── T3/T4/T5/T6/T7/T8 — Tests ────────────────────────────────────────────────

export interface TestSummary {
  testId: string;
  testCode: string;
  name: string;
  subject: string;
  grade: string;
  classes: string[];
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  questionCount: number;
  updatedAt: string;
  currentVersion: number;
}

// Empty for this test pass — the flow under test is a brand-new teacher with
// no tests yet, landing straight on the create-test form.
export const TESTS: TestSummary[] = [];

export const GRADES = ['6', '7', '8', '9', '10'];
export const SUBJECTS = ['Science', 'Maths', 'History', 'Language'];
export const CLASS_TAGS = ['7A', '7B', '8A'];

export interface QuestionOptionDraft {
  optionIndex: 1 | 2 | 3 | 4;
  optionText: string;
  isCorrect: boolean;
}

export interface QuestionDraft {
  questionId: string;
  sequenceNo: number;
  name: string;
  prompt: string;
  languageCode: string;
  secondsOverride: number | null;
  options: QuestionOptionDraft[];
}

export const ACTIVE_TEST_QUESTIONS: QuestionDraft[] = [
  {
    questionId: 'q1', sequenceNo: 1, name: 'Nearest planet', prompt: 'Which planet is closest to the Sun?',
    languageCode: 'en', secondsOverride: null,
    options: [
      { optionIndex: 1, optionText: 'Venus', isCorrect: false },
      { optionIndex: 2, optionText: 'Mercury', isCorrect: true },
      { optionIndex: 3, optionText: 'Mars', isCorrect: false },
      { optionIndex: 4, optionText: 'Earth', isCorrect: false },
    ],
  },
  {
    questionId: 'q2', sequenceNo: 2, name: 'Largest planet', prompt: 'सौरमंडल में सबसे बड़ा ग्रह कौन सा है?',
    languageCode: 'hi', secondsOverride: null,
    options: [
      { optionIndex: 1, optionText: 'पृथ्वी', isCorrect: false },
      { optionIndex: 2, optionText: 'शनि', isCorrect: false },
      { optionIndex: 3, optionText: 'बृहस्पति', isCorrect: true },
      { optionIndex: 4, optionText: 'मंगल', isCorrect: false },
    ],
  },
  {
    questionId: 'q3', sequenceNo: 3, name: 'Half as a percentage', prompt: 'ஒரு முழுமையின் பாதி எத்தனை சதவீதம்?',
    languageCode: 'ta', secondsOverride: 45,
    options: [
      { optionIndex: 1, optionText: '25%', isCorrect: false },
      { optionIndex: 2, optionText: '50%', isCorrect: true },
      { optionIndex: 3, optionText: '75%', isCorrect: false },
      { optionIndex: 4, optionText: '100%', isCorrect: false },
    ],
  },
  {
    questionId: 'q4', sequenceNo: 4, name: 'Adding fractions', prompt: 'What is 3/4 + 1/4?',
    languageCode: 'en', secondsOverride: null,
    options: [
      { optionIndex: 1, optionText: '1', isCorrect: true },
      { optionIndex: 2, optionText: '4/8', isCorrect: false },
      { optionIndex: 3, optionText: '1/2', isCorrect: false },
      { optionIndex: 4, optionText: '4/4 + 1', isCorrect: false },
    ],
  },
  {
    questionId: 'q5', sequenceNo: 5, name: 'Orbit duration', prompt: 'How many days does the Earth take to orbit the Sun?',
    languageCode: 'en', secondsOverride: null,
    options: [
      { optionIndex: 1, optionText: '24 hours', isCorrect: false },
      { optionIndex: 2, optionText: '30 days', isCorrect: false },
      { optionIndex: 3, optionText: '365 days', isCorrect: true },
      { optionIndex: 4, optionText: '1000 days', isCorrect: false },
    ],
  },
];

// ── T9/T10/T11/T12 — Classes, rosters, tray ──────────────────────────────────

export interface ClassSummary {
  classroomId: string;
  label: string;
  grade: string;
  section: string;
  room: string;
  studentCount: number;
}

export const CLASSES: ClassSummary[] = [
  { classroomId: 'cls-7a', label: '7A', grade: '7', section: 'A', room: 'Block B / 12', studentCount: 50 },
  { classroomId: 'cls-7b', label: '7B', grade: '7', section: 'B', room: 'Block B / 13', studentCount: 48 },
  { classroomId: 'cls-8a', label: '8A', grade: '8', section: 'A', room: 'Block C / 04', studentCount: 52 },
];

const ROSTER_NAMES = [
  'Aanya Sharma', 'Aarav Patel', 'Aditi Rao', 'Advik Nair', 'Ananya Iyer',
  'Arjun Menon', 'Avni Gupta', 'Dhruv Reddy', 'Diya Krishnan', 'Ishaan Verma',
  'Kavya Pillai', 'Kabir Singh',
];

export interface RosterRow {
  student: Student;
  device: Device | null;
}

export const CLASS_7A_ROSTER: RosterRow[] = ROSTER_NAMES.map((fullName, i) => {
  const slot = i + 1;
  const consentStatus: ConsentStatus = slot === 4 ? 'NOT_RECORDED' : 'GRANTED';
  return {
    student: { studentId: `stu-${slot}`, admissionNumber: `2025/${1000 + slot}`, fullName, consentStatus },
    device: slot === 7
      ? null
      : { deviceId: `dev-${String(slot).padStart(2, '0')}`, label: `R-${slot}`, traySlot: slot, role: 'STUDENT', status: 'ACTIVE', batteryDv: slot === 3 ? 21 : 28 },
  };
});

// ── T13/T14/T15/T16/T17/T18/T19/T20 — Reports ────────────────────────────────

export interface QuestionStat {
  questionId: string;
  prompt: string;
  correctPct: number;
  distribution: { optionText: string; isCorrect: boolean; count: number }[];
}

export const SESSION_RESULT_QUESTIONS: QuestionStat[] = [
  {
    questionId: 'q1', prompt: 'Which planet is closest to the Sun?', correctPct: 72,
    distribution: [
      { optionText: 'Venus', isCorrect: false, count: 10 },
      { optionText: 'Mercury', isCorrect: true, count: 34 },
      { optionText: 'Mars', isCorrect: false, count: 2 },
      { optionText: 'Earth', isCorrect: false, count: 1 },
    ],
  },
  {
    questionId: 'q4', prompt: 'What is 3/4 + 1/4?', correctPct: 38,
    distribution: [
      { optionText: '1', isCorrect: true, count: 18 },
      { optionText: '4/8', isCorrect: false, count: 21 },
      { optionText: '1/2', isCorrect: false, count: 6 },
      { optionText: '4/4 + 1', isCorrect: false, count: 2 },
    ],
  },
  {
    questionId: 'q5', prompt: 'How many days does the Earth take to orbit the Sun?', correctPct: 91,
    distribution: [
      { optionText: '24 hours', isCorrect: false, count: 1 },
      { optionText: '30 days', isCorrect: false, count: 3 },
      { optionText: '365 days', isCorrect: true, count: 43 },
      { optionText: '1000 days', isCorrect: false, count: 0 },
    ],
  },
];

export interface StudentTrendPoint {
  testCode: string;
  ranAt: string;
  scorePct: number;
}

export const STUDENT_TREND: { studentName: string; points: StudentTrendPoint[] } = {
  studentName: 'Aanya Sharma',
  points: [
    { testCode: 'M-05', ranAt: '2026-06-02', scorePct: 60 },
    { testCode: 'M-09', ranAt: '2026-07-10', scorePct: 68 },
    { testCode: 'M-11', ranAt: '2026-08-02', scorePct: 74 },
    { testCode: 'M-12', ranAt: '2026-08-17', scorePct: 80 },
  ],
};

export interface AttendanceRecord {
  sessionId: string;
  ranAt: string;
  testCode: string;
  presentCount: number;
  expectedCount: number;
  departedMidSession: string[];
}

export const ATTENDANCE_RECORDS: AttendanceRecord[] = [
  { sessionId: 'sess-1', ranAt: '2026-08-17', testCode: 'M-12', presentCount: 47, expectedCount: 50, departedMidSession: [] },
  { sessionId: 'sess-2', ranAt: '2026-08-14', testCode: 'M-09', presentCount: 49, expectedCount: 50, departedMidSession: ['R-23'] },
  { sessionId: 'sess-3', ranAt: '2026-08-12', testCode: 'M-11', presentCount: 44, expectedCount: 48, departedMidSession: [] },
];

// ── A1–A11 — School admin ────────────────────────────────────────────────────

export interface AcademicYear {
  yearId: string;
  label: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export const ACADEMIC_YEARS: AcademicYear[] = [
  { yearId: 'ay-2025', label: '2025–26', startDate: '2025-06-01', endDate: '2026-04-30', isCurrent: true },
  { yearId: 'ay-2024', label: '2024–25', startDate: '2024-06-01', endDate: '2025-04-30', isCurrent: false },
];

export interface ConsentRecord {
  studentId: string;
  fullName: string;
  classroomLabel: string;
  status: ConsentStatus;
  recordedBy: string | null;
  recordedAt: string | null;
}

export const CONSENT_RECORDS: ConsentRecord[] = [
  { studentId: 'stu-1', fullName: 'Aanya Sharma', classroomLabel: '7A', status: 'GRANTED', recordedBy: 'Front office', recordedAt: '2026-06-05' },
  { studentId: 'stu-4', fullName: 'Advik Nair', classroomLabel: '7A', status: 'NOT_RECORDED', recordedBy: null, recordedAt: null },
  { studentId: 'stu-9', fullName: 'Diya Krishnan', classroomLabel: '7A', status: 'GRANTED', recordedBy: 'Front office', recordedAt: '2026-06-05' },
  { studentId: 'stu-15', fullName: 'Rohan Mehta', classroomLabel: '7B', status: 'WITHDRAWN', recordedBy: 'Vice Principal', recordedAt: '2026-07-22' },
];

export const TEACHERS: (Teacher & { email: string; classes: string[] })[] = [
  { teacherId: 'tch-1', fullName: 'Priya Chandra', subjects: ['Science'], status: 'ACTIVE', email: 'priya.chandra@ryanschool.example', classes: ['7A', '7B'] },
  { teacherId: 'tch-2', fullName: 'Ramesh Iyer', subjects: ['Maths', 'Science'], status: 'ACTIVE', email: 'ramesh.iyer@ryanschool.example', classes: ['7A', '8A'] },
  { teacherId: 'tch-3', fullName: 'Fatima Sheikh', subjects: ['History'], status: 'ACTIVE', email: 'fatima.sheikh@ryanschool.example', classes: ['8A'] },
  { teacherId: 'tch-4', fullName: 'Suresh Nambiar', subjects: [], status: 'INACTIVE', email: 'suresh.nambiar@ryanschool.example', classes: [] },
];

export interface LifecycleEvent {
  studentName: string;
  classroomLabel: string;
  kind: 'JOINER' | 'SECTION_CHANGE' | 'LEAVER';
  effectiveDate: string;
}

export const LIFECYCLE_EVENTS: LifecycleEvent[] = [
  { studentName: 'Meera Das', classroomLabel: '7A', kind: 'JOINER', effectiveDate: '2026-08-20' },
  { studentName: 'Nikhil Bose', classroomLabel: '7B → 7A', kind: 'SECTION_CHANGE', effectiveDate: '2026-08-15' },
  { studentName: 'Pooja Ramesh', classroomLabel: '8A', kind: 'LEAVER', effectiveDate: '2026-08-10' },
];

export const SCHOOL_SETTINGS = {
  schoolName: 'Ryan International School — Chembur',
  retentionYears: 3,
  responseTimeAnalyticsEnabled: false,
};

// Year rollover (Governance) is the once-a-year batch operation (W9.5,
// FR-OPS-8) — distinct from LIFECYCLE_EVENTS above, which are mid-year
// one-offs handled under People instead.

export interface RolloverLeaver {
  fullName: string;
  classroomLabel: string;
  reason: 'GRADUATED' | 'TRANSFERRED_OUT';
}

export const ROLLOVER_LEAVERS: RolloverLeaver[] = [
  { fullName: 'Simran Kaur', classroomLabel: '9A', reason: 'GRADUATED' },
  { fullName: 'Pooja Ramesh', classroomLabel: '8A', reason: 'TRANSFERRED_OUT' },
  { fullName: 'Rohan Mehta', classroomLabel: '7B', reason: 'TRANSFERRED_OUT' },
];

export interface RolloverPromotion {
  fromLabel: string;
  toLabel: string;
  studentCount: number;
}

export const ROLLOVER_PROMOTIONS: RolloverPromotion[] = [
  { fromLabel: '7A', toLabel: '8A', studentCount: 49 },
  { fromLabel: '7B', toLabel: '8B', studentCount: 47 },
  { fromLabel: '8A', toLabel: '9A', studentCount: 51 },
];

export interface RolloverJoiner {
  fullName: string;
  admissionNumber: string;
  classroomLabel: string;
}

export const ROLLOVER_JOINERS: RolloverJoiner[] = [
  { fullName: 'Meera Das', admissionNumber: '2026/2001', classroomLabel: '7A' },
  { fullName: 'Vihaan Kulkarni', admissionNumber: '2026/2002', classroomLabel: '7A' },
  { fullName: 'Sara Fernandes', admissionNumber: '2026/2003', classroomLabel: '8A' },
];

export interface RolloverRoomChange {
  classroomLabel: string;
  fromRoom: string;
  toRoom: string;
  studentCount: number;
}

// The room a promoted class moves into — and with it, the open question in
// docs/impl/02-workflow.md §11.7: do remotes travel with the child, or stay
// behind with the room's tray? Not decided yet.
export const ROLLOVER_ROOM_CHANGES: RolloverRoomChange[] = [
  { classroomLabel: '8A → 9A', fromRoom: 'Block C / 04', toRoom: 'Block D / 02', studentCount: 51 },
];

// ── M1–M7 — Marek support (internal) ─────────────────────────────────────────

export interface SchoolAdmin {
  name: string;
  email: string;
}

export interface SchoolRow {
  schoolId: string;
  name: string;
  city: string;
  onboardingStatus: 'ONBOARDING' | 'LIVE' | 'PAUSED';
  dpaSigned: boolean;
  classroomCount: number;
  /** A school may have more than one school admin (ADR-0008) — never capped at one. */
  schoolAdmins: SchoolAdmin[];
}

export const SCHOOLS: SchoolRow[] = [
  {
    schoolId: 'sch-1', name: 'Ryan International School — Chembur', city: 'Mumbai',
    onboardingStatus: 'LIVE', dpaSigned: true, classroomCount: 3,
    schoolAdmins: [{ name: 'Meenal Deshpande', email: 'meenal.deshpande@ryanschool.example' }],
  },
  {
    schoolId: 'sch-2', name: 'DAV Public School', city: 'Bhopal',
    onboardingStatus: 'ONBOARDING', dpaSigned: true, classroomCount: 0,
    schoolAdmins: [],
  },
  {
    schoolId: 'sch-3', name: 'Little Flower Convent', city: 'Coimbatore',
    onboardingStatus: 'ONBOARDING', dpaSigned: false, classroomCount: 0,
    schoolAdmins: [],
  },
];

export function schoolName(schools: SchoolRow[], schoolId: string): string {
  return schools.find((s) => s.schoolId === schoolId)?.name ?? schoolId;
}

export interface ProvisionedDevice {
  deviceId: string;
  label: string;
  mac: string;
  role: 'STUDENT' | 'TEACHER';
  classroomLabel: string;
  traySlot: number;
  schoolId: string;
}

export const PROVISIONED_DEVICES: ProvisionedDevice[] = Array.from({ length: 6 }, (_, i) => ({
  deviceId: `dev-${String(i + 1).padStart(2, '0')}`,
  label: `R-${i + 1}`,
  mac: `A4:CF:12:${(10 + i).toString(16).toUpperCase()}:00:0${i}`,
  role: i === 0 ? 'TEACHER' : 'STUDENT',
  classroomLabel: '7A',
  traySlot: i + 1,
  schoolId: 'sch-1',
}));

export interface HubRow {
  hubId: string;
  roomId: string;
  schoolId: string;
  rfChannel: number;
  lastSeen: string;
  status: 'ONLINE' | 'OFFLINE' | 'UNSYNCED';
}

export const HUBS: HubRow[] = [
  { hubId: 'hub-1', roomId: 'Block B / 12', schoolId: 'sch-1', rfChannel: 6, lastSeen: '2026-08-22T08:40:00+05:30', status: 'ONLINE' },
  { hubId: 'hub-2', roomId: 'Block B / 13', schoolId: 'sch-1', rfChannel: 11, lastSeen: '2026-08-21T14:05:00+05:30', status: 'UNSYNCED' },
  { hubId: 'hub-3', roomId: 'Block C / 04', schoolId: 'sch-1', rfChannel: 1, lastSeen: '2026-08-19T09:00:00+05:30', status: 'OFFLINE' },
];

export interface FleetHealthRow {
  hubId: string;
  roomId: string;
  schoolId: string;
  batteryLowCount: number;
  firmwareVersion: string;
  lastSeen: string;
  unsyncedResponses: number;
}

export const FLEET_HEALTH: FleetHealthRow[] = [
  { hubId: 'hub-1', roomId: 'Block B / 12', schoolId: 'sch-1', batteryLowCount: 2, firmwareVersion: '1.4.0', lastSeen: '2026-08-22T08:40:00+05:30', unsyncedResponses: 0 },
  { hubId: 'hub-2', roomId: 'Block B / 13', schoolId: 'sch-1', batteryLowCount: 0, firmwareVersion: '1.3.2', lastSeen: '2026-08-21T14:05:00+05:30', unsyncedResponses: 214 },
  { hubId: 'hub-3', roomId: 'Block C / 04', schoolId: 'sch-1', batteryLowCount: 5, firmwareVersion: '1.3.2', lastSeen: '2026-08-19T09:00:00+05:30', unsyncedResponses: 0 },
];

export interface FirmwareRelease {
  version: string;
  target: 'HUB' | 'REMOTE' | 'RADIO_MCU';
  rolloutPct: number;
  publishedAt: string;
}

export const FIRMWARE_RELEASES: FirmwareRelease[] = [
  { version: '1.4.0', target: 'HUB', rolloutPct: 35, publishedAt: '2026-08-15' },
  { version: '1.3.2', target: 'HUB', rolloutPct: 100, publishedAt: '2026-06-01' },
  { version: '0.9.1', target: 'REMOTE', rolloutPct: 100, publishedAt: '2026-05-20' },
];

export interface RmaRecord {
  deviceId: string;
  label: string;
  fault: string;
  status: 'REPORTED' | 'REPLACED' | 'RETIRED';
  schoolId: string;
}

export const RMA_RECORDS: RmaRecord[] = [
  { deviceId: 'dev-19', label: 'R-19', fault: 'Button 3 unresponsive', status: 'REPORTED', schoolId: 'sch-1' },
  { deviceId: 'dev-31', label: 'R-31', fault: 'Battery will not hold charge', status: 'REPLACED', schoolId: 'sch-1' },
];

export interface TokenRow {
  tokenId: string;
  scope: string;
  issuedAt: string;
  revoked: boolean;
  schoolId: string;
}

export const TOKENS: TokenRow[] = [
  { tokenId: 'tok-1', scope: 'hub:hub-1', issuedAt: '2026-06-01', revoked: false, schoolId: 'sch-1' },
  { tokenId: 'tok-2', scope: 'hub:hub-2', issuedAt: '2026-06-01', revoked: false, schoolId: 'sch-1' },
  { tokenId: 'tok-3', scope: 'hub:hub-3-old', issuedAt: '2025-11-02', revoked: true, schoolId: 'sch-1' },
];
