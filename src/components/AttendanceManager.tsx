/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Calendar, CheckCircle2, AlertTriangle, Clock, ShieldAlert } from 'lucide-react';
import { Student, StudentStatus } from '../types';

interface AttendanceManagerProps {
  students: Student[];
  onUpdateStatus: (studentId: string, status: StudentStatus) => void;
}

export default function AttendanceManager({
  students,
  onUpdateStatus,
}: AttendanceManagerProps) {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'At Risk' | 'Unmarked'>('All');

  // Recalculate stats dynamically based on actual active state
  const totalPresent = students.filter((s) => s.status === 'Present' || s.status === 'Participating').length;
  const totalAbsent = students.filter((s) => s.status === 'Absent').length;
  const totalLate = students.filter((s) => s.status === 'Late').length;
  const totalExcused = students.filter((s) => s.status === 'Excused').length;

  const handleStatusRadioChange = (studentId: string, status: StudentStatus) => {
    onUpdateStatus(studentId, status);
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    if (activeFilter === 'At Risk') {
      // Students with consecutive absences (like Jordan Chen) or low grades
      return (s.consecutiveAbsences && s.consecutiveAbsences >= 3) || s.grade < 70;
    }
    return true;
  });

  return (
    <div className="space-y-md">
      {/* Header Panel */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-md pb-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary font-bold">Attendance System</p>
          <h2 className="text-3xl font-extrabold text-on-background mt-1 tracking-tight">Advanced Physics 301</h2>
          <p className="text-body-md text-on-surface-variant">
            Mark daily attendance, flag at-risk trends, and review academic correlations.
          </p>
        </div>

        {/* Global Action items */}
        <div className="flex items-center gap-sm">
          <div className="flex items-center gap-2 px-4 py-2 bg-surface-container rounded-full text-on-surface hover:bg-surface-container-high transition-colors font-label-md select-none border border-outline-variant/20">
            <Calendar className="w-4 h-4 text-primary" />
            <span>Today, May 23, 2026</span>
          </div>
          <button className="px-5 py-2.5 bg-primary text-on-primary font-bold rounded-full font-label-md hover:bg-primary-container hover:-translate-y-0.5 shadow-md shadow-primary/10 transition-all active:scale-95 duration-200">
            Submit Daily Record
          </button>
        </div>
      </div>

      {/* Summary Metrics bento block */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-sm md:gap-md">
        <div className="bg-surface-container-lowest/80 backdrop-blur-xl border border-outline-variant/20 rounded-lg p-5 flex flex-col items-center justify-center relative overflow-hidden shadow-sm">
          <div className="absolute right-0 top-0 w-16 h-16 bg-primary/5 rounded-bl-full pointer-events-none" />
          <span className="text-4xl lg:text-5xl font-extrabold text-primary">{totalPresent}</span>
          <span className="font-label-sm text-on-surface-variant uppercase tracking-wider mt-2">Present</span>
        </div>

        <div className="bg-surface-container-lowest/80 backdrop-blur-xl border border-outline-variant/20 border-l-4 border-l-error rounded-lg p-5 flex flex-col items-center justify-center relative overflow-hidden shadow-sm">
          <div className="absolute right-0 top-0 w-16 h-16 bg-error/5 rounded-bl-full pointer-events-none" />
          <span className="text-4xl lg:text-5xl font-extrabold text-error">{totalAbsent}</span>
          <span className="font-label-sm text-on-surface-variant uppercase tracking-wider mt-2">Absent</span>
        </div>

        <div className="bg-surface-container-lowest/80 backdrop-blur-xl border border-outline-variant/20 border-l-4 border-l-secondary-container rounded-lg p-5 flex flex-col items-center justify-center relative overflow-hidden shadow-sm">
          <div className="absolute right-0 top-0 w-16 h-16 bg-secondary-container/5 rounded-bl-full pointer-events-none" />
          <span className="text-4xl lg:text-5xl font-extrabold text-secondary-container">{totalLate}</span>
          <span className="font-label-sm text-on-surface-variant uppercase tracking-wider mt-2">Late</span>
        </div>

        <div className="bg-surface-container-lowest/80 backdrop-blur-xl border border-outline-variant/20 border-l-4 border-l-tertiary rounded-lg p-5 flex flex-col items-center justify-center relative overflow-hidden shadow-sm">
          <div className="absolute right-0 top-0 w-16 h-16 bg-tertiary/5 rounded-bl-full pointer-events-none" />
          <span className="text-4xl lg:text-5xl font-extrabold text-tertiary">{totalExcused}</span>
          <span className="font-label-sm text-on-surface-variant uppercase tracking-wider mt-2">Excused</span>
        </div>
      </section>

      {/* Search and Filters container */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-md bg-surface-container-lowest/80 backdrop-blur-xl border border-outline-variant/25 rounded-lg p-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
          <input
            type="text"
            placeholder="Search student by name or ID..."
            value={search}
            onChange={(e) => setSearch(e.value ?? e.target.value)}
            className="w-full bg-surface-container-low border-none rounded-full py-2.5 pl-11 pr-4 text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white text-on-surface placeholder:text-outline"
          />
        </div>

        {/* Tab filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setActiveFilter('All')}
            className={`px-4 py-2 rounded-full whitespace-nowrap font-label-sm text-label-sm transition-all duration-200 ${
              activeFilter === 'All'
                ? 'bg-primary/10 text-primary font-bold'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
            }`}
          >
            All Students ({students.length})
          </button>
          
          <button
            onClick={() => setActiveFilter('At Risk')}
            className={`px-4 py-2 rounded-full whitespace-nowrap font-label-sm text-label-sm transition-all duration-200 ${
              activeFilter === 'At Risk'
                ? 'bg-error-container text-on-error-container font-bold'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
            }`}
          >
            At Risk Trends
          </button>
        </div>
      </div>

      {/* Roster rows table list */}
      <div className="space-y-3">
        {filteredStudents.map((student) => {
          const isAtRisk = (student.consecutiveAbsences && student.consecutiveAbsences >= 3) || student.grade < 70;
          return (
            <motion.div
              layoutId={`roster-${student.id}`}
              key={student.id}
              className="bg-surface-container-lowest/80 backdrop-blur-xl rounded-lg p-4 flex flex-col lg:flex-row items-center justify-between gap-md border border-outline-variant/20 hover:bg-surface-container-lowest duration-200 transition-all hover:shadow-md"
            >
              {/* Profile card columns */}
              <div className="flex items-center gap-md w-full lg:w-auto">
                <div className="relative shrink-0">
                  <img
                    src={student.avatar}
                    alt={`${student.name} thumbnail`}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  {isAtRisk && (
                    <span 
                      title="At Academic or Absences Risk"
                      className="absolute -bottom-1 -right-1 w-5 h-5 bg-error rounded-full border-2 border-white flex items-center justify-center text-white"
                    >
                      <AlertTriangle className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-headline-md text-[18px] text-on-surface font-semibold flex items-center gap-2">
                    {student.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[12px] font-medium text-outline">ID: 104{student.id}93</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-outline-variant" />
                    <span className={`text-[12px] font-bold ${student.grade >= 85 ? 'text-primary' : 'text-error'}`}>
                      Academic standing: {student.grade}%
                    </span>
                  </div>
                  {student.consecutiveAbsences && student.consecutiveAbsences >= 3 && (
                    <div className="text-xs text-error font-semibold flex items-center gap-1 mt-1">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>{student.consecutiveAbsences} Consecutive Absences</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Radios collection */}
              <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto py-1 no-scrollbar">
                {(['Present', 'Absent', 'Late', 'Excused'] as StudentStatus[]).map((statusOption) => {
                  const isChecked = 
                    (statusOption === 'Present' && student.isPresent && student.status !== 'Late' && student.status !== 'Excused') ||
                    (statusOption === student.status);
                  
                  let badgeColors = 'peer-checked:bg-primary-container peer-checked:text-on-primary-container peer-checked:border-primary-container';
                  if (statusOption === 'Absent') {
                    badgeColors = 'peer-checked:bg-error peer-checked:text-on-error peer-checked:border-error';
                  } else if (statusOption === 'Late') {
                    badgeColors = 'peer-checked:bg-secondary-container peer-checked:text-on-secondary-container peer-checked:border-secondary-container';
                  } else if (statusOption === 'Excused') {
                    badgeColors = 'peer-checked:bg-tertiary peer-checked:text-on-tertiary peer-checked:border-tertiary';
                  }

                  return (
                    <label key={statusOption} className="cursor-pointer relative flex-1 lg:flex-none select-none">
                      <input
                        type="radio"
                        name={`attendance-group-${student.id}`}
                        checked={isChecked}
                        onChange={() => handleStatusRadioChange(student.id, statusOption)}
                        className="peer sr-only"
                      />
                      <div className={`px-5 py-2.5 rounded-full border border-outline-variant text-center font-label-sm text-label-sm text-on-surface-variant hover:bg-surface-variant/40 transition-all ${badgeColors}`}>
                        {statusOption}
                      </div>
                    </label>
                  );
                })}
              </div>
            </motion.div>
          );
        })}

        {filteredStudents.length === 0 && (
          <div className="py-12 text-center text-on-surface-variant bg-surface-container-low rounded-lg">
            <Clock className="w-10 h-10 text-outline mx-auto stroke-1" />
            <p className="font-label-md mt-2">No matching students found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
