import { useState } from 'react';
import { Login } from './screens/Login.js';
import {
  Shell, firstEnabled, ACADEMIC_YEARS, CLASSES, TEACHERS, LIFECYCLE_EVENTS, SUBJECTS,
  type AcademicYear, type ClassSummary, type LifecycleEvent,
} from '@studentq/console-ui';

import { Setup } from './screens/admin/Setup.js';
import { People } from './screens/admin/People.js';
import { Governance } from './screens/admin/Governance.js';

const ROLE = 'SCHOOL_ADMIN' as const;

// No real router yet — this is a disposable wireframe pass (see project chat),
// so a hand-rolled { activeId, activeChildId } state stands in for one.
// Desktop-first for the same reason; the real build still owes NFR-UX-8, phone-up.
export function App() {
  const [signedIn, setSignedIn] = useState(false);
  const [subjects] = useState<string[]>(SUBJECTS);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>(ACADEMIC_YEARS);
  const [classes, setClasses] = useState<ClassSummary[]>(CLASSES);
  const [teachers, setTeachers] = useState(TEACHERS);
  const [lifecycleEvents, setLifecycleEvents] = useState<LifecycleEvent[]>(LIFECYCLE_EVENTS);

  const initial = firstEnabled(ROLE);
  const [activeId, setActiveId] = useState(initial.itemId);
  const [activeChildId, setActiveChildId] = useState<string | null>(initial.childId);

  if (!signedIn) return <Login onSignedIn={() => setSignedIn(true)} />;

  function handleNavigate(itemId: string, childId: string) {
    setActiveId(itemId);
    setActiveChildId(childId);
  }

  function handleAddYear(label: string, startDate: string, endDate: string) {
    setAcademicYears((prev) => [
      { yearId: `ay-${prev.length + 1}`, label, startDate, endDate, isCurrent: true },
      ...prev.map((y) => ({ ...y, isCurrent: false })),
    ]);
  }

  function handleAddClassroom(label: string, grade: string, section: string, room: string) {
    setClasses((prev) => [...prev, { classroomId: `cls-${prev.length + 1}`, label, grade, section, room, studentCount: 0 }]);
  }

  function handleAddTeacher(fullName: string, email: string, teacherSubjects: string[], teacherClasses: string[]) {
    setTeachers((prev) => [
      ...prev,
      { teacherId: `tch-${prev.length + 1}`, fullName, subjects: teacherSubjects, status: 'ACTIVE', email, classes: teacherClasses },
    ]);
  }

  function handleRecordChange(studentName: string, classroomLabel: string, kind: 'JOINER' | 'SECTION_CHANGE' | 'LEAVER', effectiveDate: string) {
    setLifecycleEvents((prev) => [{ studentName, classroomLabel, kind, effectiveDate }, ...prev]);
  }

  const screenKey = `${activeId}:${activeChildId ?? ''}`;

  function renderScreen() {
    switch (activeId) {
      case 'a1':
        return <Setup key={screenKey} focusSection={activeChildId as any} academicYears={academicYears} classes={classes} onAddYear={handleAddYear} onAddClassroom={handleAddClassroom} />;
      case 'a4':
        return (
          <People
            key={screenKey}
            focusSection={activeChildId as any}
            classes={classes}
            teachers={teachers}
            lifecycleEvents={lifecycleEvents}
            subjects={subjects}
            onAddTeacher={handleAddTeacher}
            onRecordChange={handleRecordChange}
          />
        );
      case 'a8':
        return <Governance key={screenKey} focusSection={activeChildId as any} classes={classes} />;
      default:
        return null;
    }
  }

  return (
    <Shell role={ROLE} activeId={activeId} onNavigate={handleNavigate} onSignOut={() => setSignedIn(false)}>
      {renderScreen()}
    </Shell>
  );
}
