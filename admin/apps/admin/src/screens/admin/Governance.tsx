import { useState } from 'react';
import {
  CONSENT_RECORDS, SCHOOL_SETTINGS,
  ROLLOVER_LEAVERS, ROLLOVER_PROMOTIONS, ROLLOVER_JOINERS, ROLLOVER_ROOM_CHANGES,
} from '@studentq/console-ui';
import { TabBar } from '@studentq/console-ui';

const ROLLOVER_STEPS = ['Confirm leavers', 'Promote sections', 'Assign new joiners', 'Review remote bindings', 'Confirm rollover'];

type SectionId = 'rollover' | 'withdrawal' | 'schoolSettings' | 'crossClass';

const TABS: { id: SectionId; label: string }[] = [
  { id: 'rollover', label: 'Year rollover' },
  { id: 'withdrawal', label: 'Consent withdrawal' },
  { id: 'schoolSettings', label: 'School settings' },
  { id: 'crossClass', label: 'Cross-class reports' },
];

/**
 * Year rollover, consent withdrawal, school settings and cross-class reports
 * used to be four separate nav entries under "Governance" — now they're
 * horizontal tabs on one screen.
 */
export function Governance({
  focusSection, classes,
}: {
  focusSection?: SectionId;
  classes: import('@studentq/console-ui').ClassSummary[];
}) {
  const [active, setActive] = useState<SectionId>(focusSection ?? 'rollover');

  return (
    <div className="page">
      <div className="page__head">
        <div>
          <h1>Governance</h1>
          <p className="page__desc">Year rollover, consent withdrawal, school settings and cross-class reports, in one place.</p>
        </div>
      </div>

      <TabBar tabs={TABS} active={active} onChange={setActive} />

      <div className="tab-panel">
        {active === 'rollover' && <YearRollover />}
        {active === 'withdrawal' && <ConsentWithdrawal />}
        {active === 'schoolSettings' && <SchoolSettings />}
        {active === 'crossClass' && <CrossClassReports classes={classes} />}
      </div>
    </div>
  );
}

function YearRollover() {
  const [step, setStep] = useState(0);
  const [assignedJoiners, setAssignedJoiners] = useState<Set<string>>(new Set());

  return (
    <>
      <p className="page__desc">A guided flow, on purpose — this touches every class, student and remote binding at once, and should never be done as ad-hoc manual edits (FR-OPS-8).</p>
      <div className="card">
        <div className="toolbar" style={{ marginBottom: '.5rem' }}>
          {ROLLOVER_STEPS.map((s, i) => (
            <span key={s} className={`badge ${i === step ? 'badge--info' : i < step ? 'badge--ok' : 'badge--muted'}`}>{i + 1}. {s}</span>
          ))}
        </div>
        <p className="muted">Step {step + 1} of {ROLLOVER_STEPS.length}: {ROLLOVER_STEPS[step]}.</p>

        {step === 0 && (
          <div className="stack">
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Student</th><th>Class</th><th>Reason</th></tr></thead>
                <tbody>
                  {ROLLOVER_LEAVERS.map((l) => (
                    <tr key={l.fullName}>
                      <td>{l.fullName}</td><td>{l.classroomLabel}</td>
                      <td><span className="badge badge--stop">{l.reason.replace('_', ' ')}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="notice">Confirming closes each leaver's enrolment and returns their remote to the spare pool (W9.6).</p>
          </div>
        )}

        {step === 1 && (
          <div className="stack">
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>From</th><th>To</th><th>Students</th></tr></thead>
                <tbody>
                  {ROLLOVER_PROMOTIONS.map((p) => (
                    <tr key={p.fromLabel}>
                      <td>{p.fromLabel}</td><td>{p.toLabel}</td><td>{p.studentCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="notice">Each row on the right is a new classroom, not a rename — 8A in 2026–27 is a new row, so past results stay attached to the class a student was actually in at the time (FR-OPS-8).</p>
          </div>
        )}

        {step === 2 && (
          <div className="stack">
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Student</th><th>Admission no.</th><th>Class</th><th></th></tr></thead>
                <tbody>
                  {ROLLOVER_JOINERS.map((j) => (
                    <tr key={j.admissionNumber}>
                      <td>{j.fullName}</td><td>{j.admissionNumber}</td><td>{j.classroomLabel}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn--ghost btn--sm"
                          disabled={assignedJoiners.has(j.admissionNumber)}
                          onClick={() => setAssignedJoiners((prev) => new Set(prev).add(j.admissionNumber))}
                        >
                          {assignedJoiners.has(j.admissionNumber) ? 'Assigned ✓' : 'Assign remote'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="notice">Each joiner needs a remote pulled from the spare pool and a label printed for their tray slot before the first lesson.</p>
          </div>
        )}

        {step === 3 && (
          <div className="stack">
            <p className="notice" style={{ color: 'var(--warn)' }}>
              ⚠️ Open question (docs/impl/02-workflow.md §11.7): when a class moves rooms at rollover, do remotes travel with the child or stay behind with the room's tray? Not decided — needs a teacher's answer before this step can be more than a preview.
            </p>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Class</th><th>From room</th><th>To room</th><th>Students</th></tr></thead>
                <tbody>
                  {ROLLOVER_ROOM_CHANGES.map((r) => (
                    <tr key={r.classroomLabel}>
                      <td>{r.classroomLabel}</td><td>{r.fromRoom}</td><td>{r.toRoom}</td><td>{r.studentCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="stack">
            <p>Ready to confirm the 2026–27 rollover:</p>
            <ul>
              <li>{ROLLOVER_LEAVERS.length} leavers — remotes returned to the spare pool</li>
              <li>{ROLLOVER_PROMOTIONS.reduce((n, p) => n + p.studentCount, 0)} students promoted across {ROLLOVER_PROMOTIONS.length} classes</li>
              <li>{ROLLOVER_JOINERS.length} new joiners — remotes still to be assigned</li>
              <li>{ROLLOVER_ROOM_CHANGES.length} room change with its remote-binding policy still undecided</li>
            </ul>
          </div>
        )}

        <div className="toolbar">
          <button type="button" className="btn btn--ghost btn--sm" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>Back</button>
          <button
            type="button"
            className="btn btn--primary btn--sm"
            disabled={step === ROLLOVER_STEPS.length - 1}
            onClick={() => setStep((s) => Math.min(ROLLOVER_STEPS.length - 1, s + 1))}
          >
            {step === ROLLOVER_STEPS.length - 1 ? 'Confirm rollover' : 'Next'}
          </button>
        </div>
      </div>
    </>
  );
}

function ConsentWithdrawal() {
  const [notice, setNotice] = useState<string | null>(null);
  const activeConsent = CONSENT_RECORDS.filter((c) => c.status !== 'WITHDRAWN');

  return (
    <>
      <p className="page__desc">A parent withdrawing consent must genuinely stop processing and delete this child's data — built now, not on the morning a parent first asks.</p>
      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Student</th><th>Class</th><th></th></tr></thead>
            <tbody>
              {activeConsent.map((c) => (
                <tr key={c.studentId}>
                  <td>{c.fullName}</td><td>{c.classroomLabel}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn--stop btn--sm"
                      onClick={() => setNotice(`Withdrawal recorded for ${c.fullName}. Deletion of stored responses runs on the retention schedule (School settings).`)}
                    >
                      Withdraw consent
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {notice && <p className="notice">{notice}</p>}
      </div>
    </>
  );
}

function SchoolSettings() {
  const [retention, setRetention] = useState(SCHOOL_SETTINGS.retentionYears);
  const [analytics, setAnalytics] = useState(SCHOOL_SETTINGS.responseTimeAnalyticsEnabled);

  return (
    <>
      <p className="page__desc">{SCHOOL_SETTINGS.schoolName}</p>
      <div className="card stack">
        <label className="field">
          <span>Data retention (years)</span>
          <input type="number" min={1} max={7} value={retention} onChange={(e) => setRetention(Number(e.target.value))} style={{ maxWidth: '8rem' }} />
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '.6rem', fontSize: '.9rem' }}>
          <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} />
          Enable response-time analytics
        </label>
        {analytics && (
          <p className="notice" style={{ color: 'var(--warn)' }}>
            ⚠️ This is currently an open legal question under DPDP s.9(3) (NFR-PRIV-7). Do not enable in a real school without counsel's sign-off.
          </p>
        )}
      </div>
    </>
  );
}

function CrossClassReports({ classes }: { classes: import('@studentq/console-ui').ClassSummary[] }) {
  const crossClassRows = classes.map((c, i) => ({ ...c, avgScore: [78, 65, 71][i] ?? 70 }));

  return (
    <>
      <p className="page__desc">Class-level comparisons only — never a per-student ranking across the school (NFR-PRIV-5).</p>
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>Class</th><th>Students</th><th>Average score (this term)</th></tr></thead>
          <tbody>
            {crossClassRows.map((r) => (
              <tr key={r.classroomId}>
                <td>{r.label}</td><td>{r.studentCount}</td>
                <td><span className={`badge ${r.avgScore < 70 ? 'badge--warn' : 'badge--ok'}`}>{r.avgScore}%</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
