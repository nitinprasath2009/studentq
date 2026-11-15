import { useState } from 'react';
import { GRADES } from '@studentq/console-ui';
import { TabBar } from '@studentq/console-ui';

type SectionId = 'years' | 'classrooms' | 'rosterImport';

const TABS: { id: SectionId; label: string }[] = [
  { id: 'years', label: 'Academic years' },
  { id: 'classrooms', label: 'Classrooms' },
  { id: 'rosterImport', label: 'Roster import' },
];

/**
 * A1–A3 merged into one screen (see project chat): academic year setup,
 * classroom setup and roster import used to be three separate nav entries
 * under "Setup" — now they're horizontal tabs on one screen.
 */
export function Setup({
  focusSection, academicYears, classes, onAddYear, onAddClassroom,
}: {
  focusSection?: SectionId;
  academicYears: import('@studentq/console-ui').AcademicYear[];
  classes: import('@studentq/console-ui').ClassSummary[];
  onAddYear: (label: string, startDate: string, endDate: string) => void;
  onAddClassroom: (label: string, grade: string, section: string, room: string) => void;
}) {
  const [active, setActive] = useState<SectionId>(focusSection ?? 'years');
  const [importNotice, setImportNotice] = useState<string | null>(null);

  const [yearLabel, setYearLabel] = useState('');
  const [yearStart, setYearStart] = useState('');
  const [yearEnd, setYearEnd] = useState('');
  const [classGrade, setClassGrade] = useState(GRADES[0]);
  const [classSection, setClassSection] = useState('');
  const [classRoom, setClassRoom] = useState('');

  function submitYear() {
    if (!yearLabel.trim() || !yearStart || !yearEnd) return;
    onAddYear(yearLabel.trim(), yearStart, yearEnd);
    setYearLabel('');
    setYearStart('');
    setYearEnd('');
  }

  function submitClassroom() {
    if (!classSection.trim() || !classRoom.trim()) return;
    onAddClassroom(`${classGrade}${classSection.trim().toUpperCase()}`, classGrade, classSection.trim().toUpperCase(), classRoom.trim());
    setClassSection('');
    setClassRoom('');
  }

  return (
    <div className="page">
      <div className="page__head">
        <div>
          <h1>Setup</h1>
          <p className="page__desc">Academic years, classrooms and the roster import, in one place.</p>
        </div>
      </div>

      <TabBar tabs={TABS} active={active} onChange={setActive} />

      <div className="tab-panel">
        {active === 'years' && (
          <>
            <p className="page__desc">Only one year is current at a time — it controls which roster new sessions run against.</p>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Label</th><th>Starts</th><th>Ends</th><th>Status</th></tr></thead>
                <tbody>
                  {academicYears.map((y) => (
                    <tr key={y.yearId}>
                      <td>{y.label}</td><td>{y.startDate}</td><td>{y.endDate}</td>
                      <td>{y.isCurrent ? <span className="badge badge--ok">Current</span> : <span className="badge badge--muted">Past</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card stack">
              <div className="toolbar">
                <input placeholder="Label (e.g. 2026–27)" value={yearLabel} onChange={(e) => setYearLabel(e.target.value)} style={{ padding: '.6rem .8rem', border: '1px solid var(--line)', borderRadius: '.5rem' }} />
                <input type="date" value={yearStart} onChange={(e) => setYearStart(e.target.value)} style={{ padding: '.6rem .8rem', border: '1px solid var(--line)', borderRadius: '.5rem' }} />
                <input type="date" value={yearEnd} onChange={(e) => setYearEnd(e.target.value)} style={{ padding: '.6rem .8rem', border: '1px solid var(--line)', borderRadius: '.5rem' }} />
                <button type="button" className="btn btn--primary btn--sm" onClick={submitYear}>New year</button>
              </div>
            </div>
          </>
        )}

        {active === 'classrooms' && (
          <>
            <p className="page__desc">Every physical room with a classroom box. Ceiling is 64 students — not the Western 30–40.</p>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Class</th><th>Room</th><th>Capacity</th><th>Enrolled</th></tr></thead>
                <tbody>
                  {classes.map((c) => (
                    <tr key={c.classroomId}>
                      <td>Grade {c.grade}{c.section}</td><td>{c.room}</td><td>64</td><td>{c.studentCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card stack">
              <div className="toolbar">
                <select value={classGrade} onChange={(e) => setClassGrade(e.target.value)}>
                  {GRADES.map((g) => <option key={g} value={g}>Grade {g}</option>)}
                </select>
                <input placeholder="Section (e.g. C)" value={classSection} onChange={(e) => setClassSection(e.target.value)} style={{ width: '5rem', padding: '.6rem .8rem', border: '1px solid var(--line)', borderRadius: '.5rem' }} />
                <input placeholder="Room (e.g. Block D / 01)" value={classRoom} onChange={(e) => setClassRoom(e.target.value)} style={{ padding: '.6rem .8rem', border: '1px solid var(--line)', borderRadius: '.5rem' }} />
                <button type="button" className="btn btn--primary btn--sm" onClick={submitClassroom}>Add classroom</button>
              </div>
            </div>
          </>
        )}

        {active === 'rosterImport' && (
          <>
            <p className="page__desc">Upload the school's admission list once a year — admission number, name, class, roll number.</p>
            <div className="card stack">
              <div className="empty-state" style={{ border: '2px dashed var(--line)', borderRadius: '.75rem' }}>
                Drop a CSV here, or click to browse
              </div>
              <button
                type="button"
                className="btn btn--primary btn--sm"
                style={{ alignSelf: 'flex-start' }}
                onClick={() => setImportNotice('Parsing and validation lands with the real backend — not built yet.')}
              >
                Choose file
              </button>
              {importNotice && <p className="notice">{importNotice}</p>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
