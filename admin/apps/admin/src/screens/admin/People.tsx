import { useState } from 'react';
import { CONSENT_RECORDS } from '@studentq/console-ui';
import { TabBar } from '@studentq/console-ui';

const CONSENT_BADGE: Record<string, string> = { GRANTED: 'badge--ok', NOT_RECORDED: 'badge--warn', WITHDRAWN: 'badge--stop' };
const LIFECYCLE_BADGE: Record<string, string> = { JOINER: 'badge--ok', SECTION_CHANGE: 'badge--info', LEAVER: 'badge--stop' };

type SectionId = 'consent' | 'teachers' | 'assignments' | 'lifecycle';

const TABS: { id: SectionId; label: string }[] = [
  { id: 'consent', label: 'Consent' },
  { id: 'teachers', label: 'Teachers' },
  { id: 'assignments', label: 'Teacher ↔ classroom' },
  { id: 'lifecycle', label: 'Student lifecycle' },
];

/**
 * A4–A7 merged into one screen (see project chat): consent management,
 * teacher management, teacher↔classroom assignments and student lifecycle
 * used to be four separate nav entries under "People" — now they're
 * horizontal tabs on one screen.
 */
export function People({
  focusSection, classes, teachers, lifecycleEvents, subjects, onAddTeacher, onRecordChange,
}: {
  focusSection?: SectionId;
  classes: import('@studentq/console-ui').ClassSummary[];
  teachers: (import('@studentq/console-ui').Teacher & { email: string; classes: string[] })[];
  lifecycleEvents: import('@studentq/console-ui').LifecycleEvent[];
  subjects: string[];
  onAddTeacher: (fullName: string, email: string, subjects: string[], teacherClasses: string[]) => void;
  onRecordChange: (studentName: string, classroomLabel: string, kind: 'JOINER' | 'SECTION_CHANGE' | 'LEAVER', effectiveDate: string) => void;
}) {
  const [active, setActive] = useState<SectionId>(focusSection ?? 'consent');

  const [teacherName, setTeacherName] = useState('');
  const [teacherEmail, setTeacherEmail] = useState('');
  const [teacherSubjects, setTeacherSubjects] = useState<string[]>([]);
  const [teacherClasses, setTeacherClasses] = useState<string[]>([]);
  const [changeStudent, setChangeStudent] = useState('');
  const [changeClassroom, setChangeClassroom] = useState('');
  const [changeKind, setChangeKind] = useState<'JOINER' | 'SECTION_CHANGE' | 'LEAVER'>('JOINER');
  const [changeDate, setChangeDate] = useState('');

  function toggleTeacherSubject(subject: string) {
    setTeacherSubjects((prev) => (prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]));
  }

  function toggleTeacherClass(label: string) {
    setTeacherClasses((prev) => (prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label]));
  }

  function submitTeacher() {
    if (!teacherName.trim() || !teacherEmail.trim()) return;
    onAddTeacher(teacherName.trim(), teacherEmail.trim(), teacherSubjects, teacherClasses);
    setTeacherName('');
    setTeacherEmail('');
    setTeacherSubjects([]);
    setTeacherClasses([]);
  }

  function submitChange() {
    if (!changeStudent.trim() || !changeClassroom.trim() || !changeDate) return;
    onRecordChange(changeStudent.trim(), changeClassroom.trim(), changeKind, changeDate);
    setChangeStudent('');
    setChangeClassroom('');
    setChangeDate('');
  }

  return (
    <div className="page">
      <div className="page__head">
        <div>
          <h1>People</h1>
          <p className="page__desc">Consent, teachers, class assignments and lifecycle changes, in one place.</p>
        </div>
      </div>

      <TabBar tabs={TABS} active={active} onChange={setActive} />

      <div className="tab-panel">
        {active === 'consent' && (
          <>
            <p className="page__desc">Every student here is a child under DPDP 2023 — this is where the law actually lands, not a paperwork formality.</p>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Student</th><th>Class</th><th>Status</th><th>Recorded by</th><th>Recorded on</th></tr></thead>
                <tbody>
                  {CONSENT_RECORDS.map((c) => (
                    <tr key={c.studentId}>
                      <td>{c.fullName}</td><td>{c.classroomLabel}</td>
                      <td><span className={`badge ${CONSENT_BADGE[c.status]}`}>{c.status.replace('_', ' ')}</span></td>
                      <td>{c.recordedBy ?? '—'}</td><td>{c.recordedAt ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {active === 'teachers' && (
          <>
            <p className="page__desc">Staff records are kept separate from logins — disabling a login never erases authorship of a teacher's past tests.</p>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Name</th><th>Email</th><th>Subjects</th><th>Classes</th><th>Status</th></tr></thead>
                <tbody>
                  {teachers.map((t) => (
                    <tr key={t.teacherId}>
                      <td>{t.fullName}</td><td>{t.email}</td><td>{t.subjects.join(', ') || '—'}</td>
                      <td>{t.classes.join(', ') || '—'}</td>
                      <td>{t.status === 'ACTIVE' ? <span className="badge badge--ok">Active</span> : <span className="badge badge--muted">Inactive</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card stack">
              <div className="toolbar">
                <input placeholder="Full name" value={teacherName} onChange={(e) => setTeacherName(e.target.value)} style={{ padding: '.6rem .8rem', border: '1px solid var(--line)', borderRadius: '.5rem' }} />
                <input placeholder="Email" value={teacherEmail} onChange={(e) => setTeacherEmail(e.target.value)} style={{ padding: '.6rem .8rem', border: '1px solid var(--line)', borderRadius: '.5rem' }} />
              </div>
              <div className="toolbar">
                <span className="muted">Subjects (any number):</span>
                {subjects.map((s) => (
                  <label key={s} style={{ display: 'flex', alignItems: 'center', gap: '.3rem', fontSize: '.85rem' }}>
                    <input type="checkbox" checked={teacherSubjects.includes(s)} onChange={() => toggleTeacherSubject(s)} />
                    {s}
                  </label>
                ))}
              </div>
              <div className="toolbar">
                <span className="muted">Classes (any number):</span>
                {classes.map((c) => (
                  <label key={c.classroomId} style={{ display: 'flex', alignItems: 'center', gap: '.3rem', fontSize: '.85rem' }}>
                    <input type="checkbox" checked={teacherClasses.includes(c.label)} onChange={() => toggleTeacherClass(c.label)} />
                    {c.label}
                  </label>
                ))}
              </div>
              <button type="button" className="btn btn--primary btn--sm" style={{ alignSelf: 'flex-start' }} onClick={submitTeacher}>Add teacher</button>
            </div>
          </>
        )}

        {active === 'assignments' && (
          <>
            <p className="page__desc">Who teaches which class — a class can have any number of teachers, and a teacher can be assigned to any number of classes.</p>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Class</th><th>Class teacher</th><th>Also teaching</th></tr></thead>
                <tbody>
                  {classes.map((c) => {
                    const teaching = teachers.filter((t) => t.classes.includes(c.label));
                    return (
                      <tr key={c.classroomId}>
                        <td>{c.label}</td>
                        <td>{teaching[0]?.fullName ?? '—'}</td>
                        <td>{teaching.slice(1).map((t) => t.fullName).join(', ') || '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {active === 'lifecycle' && (
          <>
            <p className="page__desc">Mid-year changes, outside the annual rollover (Governance).</p>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Student</th><th>Class</th><th>Change</th><th>Effective</th></tr></thead>
                <tbody>
                  {lifecycleEvents.map((e, i) => (
                    <tr key={i}>
                      <td>{e.studentName}</td><td>{e.classroomLabel}</td>
                      <td><span className={`badge ${LIFECYCLE_BADGE[e.kind]}`}>{e.kind.replace('_', ' ')}</span></td>
                      <td>{e.effectiveDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card stack">
              <div className="toolbar">
                <input placeholder="Student name" value={changeStudent} onChange={(e) => setChangeStudent(e.target.value)} style={{ padding: '.6rem .8rem', border: '1px solid var(--line)', borderRadius: '.5rem' }} />
                <input placeholder="Classroom (e.g. 7A)" value={changeClassroom} onChange={(e) => setChangeClassroom(e.target.value)} style={{ padding: '.6rem .8rem', border: '1px solid var(--line)', borderRadius: '.5rem' }} />
                <select value={changeKind} onChange={(e) => setChangeKind(e.target.value as typeof changeKind)}>
                  <option value="JOINER">Joiner</option>
                  <option value="SECTION_CHANGE">Section change</option>
                  <option value="LEAVER">Leaver</option>
                </select>
                <input type="date" value={changeDate} onChange={(e) => setChangeDate(e.target.value)} style={{ padding: '.6rem .8rem', border: '1px solid var(--line)', borderRadius: '.5rem' }} />
                <button type="button" className="btn btn--primary btn--sm" onClick={submitChange}>Record a change</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
