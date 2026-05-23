/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Calendar, CheckCircle2, AlertTriangle, Clock, ShieldAlert, Sparkles, UserCheck } from 'lucide-react';
import { Student, StudentStatus } from '../types';
import { Language, translations } from '../translations';

interface AttendanceManagerProps {
  students: Student[];
  onUpdateStatus: (studentId: string, status: StudentStatus) => void;
  lang?: Language;
}

export default function AttendanceManager({
  students,
  onUpdateStatus,
  lang = 'vi',
}: AttendanceManagerProps) {
  const t = (key: keyof typeof translations['en']) => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };
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
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#006b47] font-extrabold flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5" />
            {t('attendanceRoster')}
          </p>
          <h2 className="text-2xl font-black text-zinc-900 tracking-tight mt-1">{t('dailyRollCall')}</h2>
          <p className="text-sm text-zinc-550">
            {t('rollCallDesc')}
          </p>
        </div>

        {/* Global Action items */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full text-zinc-700 border border-zinc-200 text-xs font-bold leading-none">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span>{lang === 'en' ? 'Friday, May 23, 2026' : 'Thứ Sáu, 23 tháng 5, 2026'}</span>
          </div>
          <button className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-full text-xs shadow-lg shadow-emerald-700/10 active:scale-95 transition-all">
            {t('submitDaily')}
          </button>
        </div>
      </div>

      {/* Summary Metrics bento block */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-zinc-200/50 rounded-2xl p-5 flex flex-col items-center justify-center relative overflow-hidden premium-shadow">
          <div className="absolute right-0 top-0 w-12 h-12 bg-emerald-500/5 rounded-bl-full pointer-events-none" />
          <span className="text-4xl font-black text-emerald-600 tracking-tight">{totalPresent}</span>
          <span className="text-[10.5px] font-bold text-zinc-400 uppercase tracking-widest mt-2">{t('present')}</span>
        </div>

        <div className="bg-white border border-zinc-200/50 border-l-4 border-l-rose-500 rounded-xl p-5 flex flex-col items-center justify-center relative overflow-hidden premium-shadow">
          <div className="absolute right-0 top-0 w-12 h-12 bg-rose-500/5 rounded-bl-full pointer-events-none" />
          <span className="text-4xl font-black text-rose-500 tracking-tight">{totalAbsent}</span>
          <span className="text-[10.5px] font-bold text-zinc-400 uppercase tracking-widest mt-2">{t('absent')}</span>
        </div>

        <div className="bg-white border border-zinc-200/50 border-l-4 border-l-amber-500 rounded-xl p-5 flex flex-col items-center justify-center relative overflow-hidden premium-shadow">
          <div className="absolute right-0 top-0 w-12 h-12 bg-amber-500/5 rounded-bl-full pointer-events-none" />
          <span className="text-4xl font-black text-amber-500 tracking-tight">{totalLate}</span>
          <span className="text-[10.5px] font-bold text-zinc-400 uppercase tracking-widest mt-2">{t('late')}</span>
        </div>

        <div className="bg-white border border-zinc-200/50 border-l-4 border-l-indigo-500 rounded-xl p-5 flex flex-col items-center justify-center relative overflow-hidden premium-shadow">
          <div className="absolute right-0 top-0 w-12 h-12 bg-indigo-500/5 rounded-bl-full pointer-events-none" />
          <span className="text-4xl font-black text-indigo-500 tracking-tight">{totalExcused}</span>
          <span className="text-[10.5px] font-bold text-zinc-400 uppercase tracking-widest mt-2">{t('excused')}</span>
        </div>
      </section>

      {/* Search and Filters container */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white border border-zinc-200/60 rounded-2xl p-4 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-100 focus:border-emerald-600 rounded-full py-2 pl-10 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white text-zinc-805 placeholder:text-zinc-300"
          />
        </div>

        {/* Tab filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 select-none no-scrollbar">
          <button
            onClick={() => setActiveFilter('All')}
            className={`px-4.5 py-2 rounded-full whitespace-nowrap text-xs font-bold transition-all duration-200 ${
              activeFilter === 'All'
                ? 'bg-emerald-50 text-emerald-705 border border-emerald-200'
                : 'bg-zinc-100 hover:bg-zinc-200/70 border border-transparent text-zinc-500'
            }`}
          >
            {t('allStudents')} ({students.length})
          </button>
          
          <button
            onClick={() => setActiveFilter('At Risk')}
            className={`px-4.5 py-2 rounded-full whitespace-nowrap text-xs font-bold transition-all duration-200 ${
              activeFilter === 'At Risk'
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'bg-zinc-100 hover:bg-zinc-200/70 border border-transparent text-zinc-500'
            }`}
          >
            {t('atRiskTrends')}
          </button>
        </div>
      </div>

      {/* Roster rows list */}
      <div className="space-y-3.5">
        {filteredStudents.map((student) => {
          const isAtRisk = (student.consecutiveAbsences && student.consecutiveAbsences >= 3) || student.grade < 70;
          return (
            <motion.div
              layoutId={`roster-${student.id}`}
              key={student.id}
              className="bg-white border border-zinc-200/50 rounded-2xl p-4 flex flex-col lg:flex-row items-center justify-between gap-4 duration-200 transition-all hover:border-zinc-300 hover:shadow-md"
            >
              {/* Profile card columns */}
              <div className="flex items-center gap-4 w-full lg:w-auto">
                <div className="relative shrink-0 select-none">
                  <img
                    src={student.avatar}
                    alt={`${student.name} thumbnail`}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full object-cover border-2 border-zinc-100 shadow-xs"
                  />
                  {isAtRisk && (
                    <span 
                      title="At Academic or Absences Risk"
                      className="absolute -bottom-1 -right-1 w-5 h-5 bg-rose-600 rounded-full border border-white flex items-center justify-center text-white"
                    >
                      <AlertTriangle className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>

                <div className="space-y-0.5">
                  <h3 className="text-sm text-zinc-800 font-extrabold flex items-center gap-2">
                    {student.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-zinc-400">ID: 104{student.id}</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-300" />
                    <span className={`text-[11px] font-bold ${student.grade >= 85 ? 'text-emerald-700' : 'text-rose-600'}`}>
                      Academic: {student.grade}%
                    </span>
                  </div>
                  {student.consecutiveAbsences && student.consecutiveAbsences >= 3 && (
                    <div className="text-[10px] text-rose-600 font-bold flex items-center gap-1 mt-0.5">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>{student.consecutiveAbsences} Consecutive Absences</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Radios collection */}
              <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto py-1 no-scrollbar select-none">
                {(['Present', 'Absent', 'Late', 'Excused'] as StudentStatus[]).map((statusOption) => {
                  const isChecked = 
                    (statusOption === 'Present' && student.isPresent && student.status !== 'Late' && student.status !== 'Excused') ||
                    (statusOption === student.status);
                  
                  let badgeColors = 'peer-checked:bg-emerald-500 peer-checked:text-white peer-checked:border-emerald-500';
                  if (statusOption === 'Absent') {
                    badgeColors = 'peer-checked:bg-rose-600 peer-checked:text-white peer-checked:border-rose-600';
                  } else if (statusOption === 'Late') {
                    badgeColors = 'peer-checked:bg-amber-550 peer-checked:text-white peer-checked:border-amber-550';
                  } else if (statusOption === 'Excused') {
                    badgeColors = 'peer-checked:bg-indigo-600 peer-checked:text-white peer-checked:border-indigo-600';
                  }

                  return (
                    <label key={statusOption} className="cursor-pointer relative flex-1 lg:flex-none">
                      <input
                        type="radio"
                        name={`attendance-group-${student.id}`}
                        checked={isChecked}
                        onChange={() => handleStatusRadioChange(student.id, statusOption)}
                        className="peer sr-only"
                      />
                      <div className={`px-4.5 py-2 rounded-full border border-zinc-200 hover:border-zinc-300 text-center text-xs font-bold text-zinc-400 hover:bg-zinc-50 transition-all ${badgeColors}`}>
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
          <div className="py-14 text-center text-zinc-400 bg-white border border-dashed border-zinc-200 rounded-2xl">
            <Clock className="w-8 h-8 text-zinc-300 mx-auto stroke-1" />
            <p className="font-bold text-xs mt-2">No matching students found on search filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
