/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Star, Users, Calendar, TrendingUp, Award, ArrowUp, Info } from 'lucide-react';
import { Student } from '../types';

interface ReportsAnalyticsProps {
  students: Student[];
}

export default function ReportsAnalytics({ students }: ReportsAnalyticsProps) {
  const [trendsRange, setTrendsRange] = useState<'Month' | 'Week'>('Month');

  // Math parameters
  const studentGrades = students.map((s) => s.grade);
  const averageGrade = Math.round(studentGrades.reduce((sum, current) => sum + current, 0) / (students.length || 1));
  const attendanceRate = Math.round(
    (students.filter((s) => s.status !== 'Absent').length / (students.length || 1)) * 100
  );
  
  // High performers
  const topPerformers = [...students]
    .sort((a, b) => b.grade - a.grade)
    .slice(0, 3);

  return (
    <div className="space-y-md">
      {/* Header section */}
      <div>
        <p className="text-xs uppercase tracking-widest text-primary font-bold">Class Reports & Analytics</p>
        <h2 className="text-3xl font-extrabold text-on-background mt-1 tracking-tight">Class Analytics Overview</h2>
        <p className="text-body-md text-on-surface-variant">
          Audit grade spreads, completion compliance, and chronological participation trajectories.
        </p>
      </div>

      {/* High-Level Overview Cards (Bento style) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {/* Average Grade Card */}
        <div className="bg-surface-container-lowest/80 backdrop-blur-xl border border-outline-variant/20 rounded-lg p-6 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-primary/5 rounded-full blur-lg pointer-events-none" />
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Award className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-1 bg-primary/10 text-primary font-label-sm text-xs rounded-full flex items-center gap-1 font-bold">
              <ArrowUp className="w-3.5 h-3.5" /> 2.4% vs last term
            </span>
          </div>
          <div>
            <p className="font-label-sm text-on-surface-variant font-medium uppercase tracking-wider">Class Average</p>
            <h3 className="text-5xl font-extrabold text-on-surface mt-1">
              {averageGrade}<span className="text-xl font-normal text-on-surface-variant/80">%</span>
            </h3>
          </div>
        </div>

        {/* Attendance Rate */}
        <div className="bg-surface-container-lowest/80 backdrop-blur-xl border border-outline-variant/20 rounded-lg p-6 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-secondary-container/5 rounded-full blur-lg pointer-events-none" />
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-secondary-container/10 flex items-center justify-center text-secondary-container animate-pulse">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-1 bg-surface-variant/70 text-on-surface font-label-sm text-xs rounded-full font-bold">
              Stable Standard
            </span>
          </div>
          <div>
            <p className="font-label-sm text-on-surface-variant font-medium uppercase tracking-wider">Attendance Rate</p>
            <h3 className="text-5xl font-extrabold text-on-surface mt-1">
              {attendanceRate}<span className="text-xl font-normal text-on-surface-variant/80">%</span>
            </h3>
          </div>
        </div>

        {/* Active Students */}
        <div className="bg-surface-container-lowest/80 backdrop-blur-xl border border-outline-variant/20 rounded-lg p-6 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-tertiary/5 rounded-full blur-lg pointer-events-none" />
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="font-label-sm text-on-surface-variant font-medium uppercase tracking-wider">Active Status</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-5xl font-extrabold text-on-surface">
                {students.filter((s) => s.status !== 'Absent').length}
              </h3>
              <p className="font-body-md text-on-surface-variant">/ {students.length} Total Registered</p>
            </div>
          </div>
        </div>
      </section>

      {/* Charting dashboard canvases */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Animated Custom Performance Bar Graph */}
        <div className="bg-surface-container-lowest/80 backdrop-blur-xl border border-outline-variant/20 rounded-lg p-6 lg:col-span-2 flex flex-col shadow-sm relative">
          <div className="flex justify-between items-center mb-6 z-10">
            <h3 className="text-lg font-bold text-on-surface">Performance Trends</h3>
            <div className="flex bg-surface-container p-0.5 rounded-full">
              {(['Week', 'Month'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTrendsRange(range)}
                  className={`px-3 py-1 rounded-full text-xs font-label-sm transition-all duration-200 ${
                    trendsRange === range
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 relative min-h-[260px] flex items-end justify-between pt-10 px-2">
            {/* Y Axis Guides */}
            <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs font-mono text-outline font-semibold select-none">
              <span>100%</span>
              <span>80%</span>
              <span>60%</span>
              <span>40%</span>
            </div>

            {/* Horizontal Line background wires */}
            <div className="absolute left-10 right-0 top-0 bottom-8 flex flex-col justify-between z-0 pointer-events-none">
              <div className="w-full border-t border-outline-variant/20" />
              <div className="w-full border-t border-outline-variant/20" />
              <div className="w-full border-t border-outline-variant/20" />
              <div className="w-full border-t border-outline-variant/20" />
            </div>

            {/* Vertical Bar tracks */}
            <div className="w-full pl-10 pr-2 flex justify-between items-end h-full pb-8 z-10 relative">
              {trendsRange === 'Month' ? (
                <>
                  {[
                    { label: 'Week 1', height: '75%', val: 75, color: 'bg-primary-container' },
                    { label: 'Week 2', height: '82%', val: 82, color: 'bg-primary-container' },
                    { label: 'Week 3', height: '68%', val: 68, color: 'bg-secondary-container' },
                    { label: 'Week 4', height: '88%', val: 88, color: 'bg-primary-container' },
                    { label: 'Week 5', height: `${averageGrade}%`, val: averageGrade, color: 'bg-primary' },
                  ].map((bar, index) => (
                    <div key={index} className="w-12 group flex flex-col items-center gap-2 h-full justify-end">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: bar.height }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: index * 0.1 }}
                        className={`${bar.color} w-full rounded-t-md group-hover:opacity-90 transition-opacity relative shadow-sm cursor-help`}
                      >
                        {/* Tooltip */}
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-inverse-surface text-inverse-on-surface font-label-sm text-[11px] px-2 py-1 rounded shadow-md whitespace-nowrap z-30">
                          Avg: {bar.val}%
                        </div>
                      </motion.div>
                      <span className="font-label-sm text-xs text-on-surface-variant absolute bottom-0 select-none">
                        {bar.label === 'Week 5' ? 'Active' : bar.label}
                      </span>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {[
                    { label: 'Mon', height: '84%', val: 84, color: 'bg-primary-container' },
                    { label: 'Tue', height: '90%', val: 90, color: 'bg-primary-container' },
                    { label: 'Wed', height: '88%', val: 88, color: 'bg-primary' },
                    { label: 'Thu', height: '74%', val: 74, color: 'bg-secondary-container' },
                    { label: 'Fri', height: `${averageGrade}%`, val: averageGrade, color: 'bg-primary' },
                  ].map((bar, index) => (
                    <div key={index} className="w-10 group flex flex-col items-center gap-2 h-full justify-end">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: bar.height }}
                        transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.08 }}
                        className={`${bar.color} w-full rounded-t-md group-hover:opacity-90 transition-opacity relative shadow-sm cursor-help`}
                      >
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-inverse-surface text-inverse-on-surface font-label-sm text-[11px] px-2 py-1 rounded shadow-md whitespace-nowrap z-30">
                          Day Average: {bar.val}%
                        </div>
                      </motion.div>
                      <span className="font-label-sm text-xs text-on-surface-variant absolute bottom-0 select-none">
                        {bar.label}
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Task Completion Doughnut Arc Progress Card */}
        <div className="bg-surface-container-lowest/80 backdrop-blur-xl border border-outline-variant/20 rounded-lg p-6 flex flex-col shadow-sm relative">
          <h3 className="text-lg font-bold text-on-surface mb-6">Task Completion</h3>
          <div className="flex-1 flex flex-col items-center justify-center">
            {/* Elegant Radial SVG Conic segment wrapper */}
            <div className="relative w-40 h-40 rounded-full bg-surface-variant flex items-center justify-center mb-6 shadow-inner"
                 style={{ background: 'conic-gradient(#00875a 0% 70%, #feaa00 70% 85%, #edeef0 85% 100%)' }}>
              <div className="w-32 h-32 bg-surface-container-lowest rounded-full flex flex-col items-center justify-center shadow-md">
                <span className="text-3xl font-extrabold text-on-surface">85%</span>
                <span className="font-label-sm text-xs text-on-surface-variant/80 tracking-wide">Submitted</span>
              </div>
            </div>

            {/* Legends matrix */}
            <div className="w-full space-y-3">
              <div className="flex justify-between items-center font-label-sm text-xs select-none">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary-container" />
                  <span className="text-on-surface-variant font-medium">On-Time Submissions</span>
                </div>
                <span className="font-extrabold text-on-surface text-sm">70%</span>
              </div>

              <div className="flex justify-between items-center font-label-sm text-xs select-none">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-secondary-container" />
                  <span className="text-on-surface-variant font-medium">Late Deliveries</span>
                </div>
                <span className="font-extrabold text-on-surface text-sm">15%</span>
              </div>

              <div className="flex justify-between items-center font-label-sm text-xs select-none">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-outline-variant" />
                  <span className="text-on-surface-variant font-medium">Missing Submissions</span>
                </div>
                <span className="font-extrabold text-on-surface text-sm">15%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Performers list container with customizable rankings */}
      <section className="bg-surface-container-lowest/80 backdrop-blur-xl border border-outline-variant/20 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-bold text-on-surface mb-6">Active Class High-Performers</h3>
        <div className="space-y-4">
          {topPerformers.map((student, idx) => {
            const rank = idx + 1;
            return (
              <div
                key={student.id}
                className="flex items-center justify-between p-4 rounded-lg bg-surface hover:bg-surface-container-low transition-colors duration-200 cursor-pointer border border-transparent hover:border-outline-variant/20"
              >
                <div className="flex items-center gap-4">
                  {/* Rank identifier tag badge */}
                  <div className={`w-8 h-8 rounded-full font-extrabold text-sm flex items-center justify-center ${
                    rank === 1 
                      ? 'bg-secondary-container/15 text-on-secondary-container' 
                      : 'bg-surface-container text-on-surface-variant'
                  }`}>
                    {rank}
                  </div>

                  <img
                    src={student.avatar}
                    alt={student.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover shadow-sm border"
                  />

                  <div>
                    <h4 className="font-label-md text-on-surface font-semibold">{student.name}</h4>
                    <p className="font-label-sm text-[11px] text-on-surface-variant font-medium mt-0.5">
                      Earned {student.stars} Stars total • Overall Grade in Biology {student.grade}%
                    </p>
                  </div>
                </div>

                {/* Score stability sparked lines preview */}
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-label-sm text-[11px] text-on-surface-variant/80 uppercase">Grade</p>
                    <p className="font-label-md font-bold text-primary">{student.grade}%</p>
                  </div>

                  {/* High visual fidelity mini Sparklines graph */}
                  <div className="hidden md:flex items-end h-8 gap-[3px] opacity-75">
                    <div className="w-[6px] h-5 bg-primary rounded-sm" />
                    <div className="w-[6px] h-6 bg-primary rounded-sm" />
                    <div className="w-[6px] h-8 bg-primary-container rounded-sm" />
                    <div className="w-[6px] h-7 bg-primary rounded-sm" />
                    <div className={`w-[6px] rounded-sm ${rank === 1 ? 'bg-primary-container h-8 animate-pulse' : 'bg-primary h-8'}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
