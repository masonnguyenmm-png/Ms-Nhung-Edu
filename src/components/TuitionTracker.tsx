/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Invoice } from '../types';
import { CheckCircle2, AlertTriangle, Calendar, Clock, DollarSign, ArrowRight } from 'lucide-react';

interface TuitionTrackerProps {
  invoices: Invoice[];
}

export default function TuitionTracker({ invoices }: TuitionTrackerProps) {
  // Balance variables
  const remainingLessons = 8;
  const totalLessons = 24;
  const percentageLeft = Math.round((remainingLessons / totalLessons) * 100);

  return (
    <div className="space-y-md">
      {/* Header section */}
      <div>
        <p className="text-xs uppercase tracking-widest text-primary font-bold">Tuition, Ledger & Calendar</p>
        <h2 className="text-3xl font-extrabold text-on-background mt-1 tracking-tight">Financial & Attendance Tracker</h2>
        <p className="text-body-md text-on-surface-variant">
          Audit lesson credit allotments, current attendance calendar compliance, and upcoming subscription receipts.
        </p>
      </div>

      {/* Bento grid layout widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Left balance circle progress (Span 4) */}
        <section className="lg:col-span-4 bg-surface-container-lowest/80 backdrop-blur-xl border border-outline-variant/20 rounded-lg p-6 flex flex-col items-center justify-center relative shadow-sm">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-secondary-container to-secondary-container/50 rounded-t" />
          <h3 className="font-headline-md text-lg text-on-surface font-bold text-center mb-6">Class Balance Accounts</h3>

          {/* Graphical Lesson Gauge Progress dial */}
          <div className="relative w-44 h-44 flex items-center justify-center mb-6">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background trace */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-surface-container"
              />
              {/* Foreground value trace */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * percentageLeft) / 100}
                strokeLinecap="round"
                className="text-primary-container"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
              <span className="text-4xl font-extrabold text-on-surface">{remainingLessons}</span>
              <span className="font-label-sm text-xs text-on-surface-variant/85 font-medium">of 24 lessons remaining</span>
            </div>
          </div>

          {/* Warn signal renewal badge marker */}
          <div className="bg-secondary-container/15 border border-secondary/20 text-on-secondary-container px-4 py-2 rounded-full flex items-center gap-2 select-none animate-pulse">
            <AlertTriangle className="w-4 h-4 text-secondary" />
            <span className="font-label-sm text-xs text-secondary font-bold">Renewal Needed Soon</span>
          </div>
        </section>

        {/* Calendar Grid overview container */}
        <section className="lg:col-span-8 bg-surface-container-lowest/80 backdrop-blur-xl border border-outline-variant/20 rounded-lg p-6 relative shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-headline-md text-lg text-on-surface font-bold">Class Attendance Calendar</h3>
            <span className="font-label-sm text-xs text-on-surface-variant font-semibold">May 2026</span>
          </div>

          <div className="w-full">
            {/* Weekdays names grid header */}
            <div className="grid grid-cols-7 gap-sm mb-2 text-center select-none">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="font-label-sm text-xs font-semibold text-outline tracking-wider lowercase">
                  {day}
                </div>
              ))}
            </div>

            {/* Simulated Active Dates index grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Initial spacing offsets */}
              <div className="aspect-square bg-surface border border-outline-variant/10 rounded flex items-center justify-center opacity-30 select-none">29</div>
              <div className="aspect-square bg-surface border border-outline-variant/10 rounded flex items-center justify-center opacity-30 select-none">30</div>

              {/* Day indices with checks */}
              {[
                { date: 1, type: 'Present' },
                { date: 2, type: 'Present' },
                { date: 3, type: 'Late' },
                { date: 4, type: 'Empty' },
                { date: 5, type: 'Present' },
                { date: 6, type: 'Present' },
                { date: 7, type: 'Present' },
                { date: 8, type: 'Present' },
                { date: 9, type: 'Present' },
                { date: 10, type: 'Late' },
                { date: 11, type: 'Empty' },
                { date: 12, type: 'Present' },
                { date: 13, type: 'Present' },
                { date: 14, type: 'Present' },
                { date: 15, type: 'Present' },
                { date: 16, type: 'Present' },
                { date: 17, type: 'Present' },
                { date: 18, type: 'Present' },
                { date: 19, type: 'Absent' },
              ].map((dayObj) => (
                <div
                  key={dayObj.date}
                  className={`aspect-square border rounded flex flex-col items-center justify-center relative transition-colors ${
                    dayObj.type === 'Present'
                      ? 'border-primary/25 bg-primary/5 hover:border-primary'
                      : dayObj.type === 'Late'
                        ? 'border-secondary-container/25 bg-secondary-container/5 hover:border-secondary-container'
                        : dayObj.type === 'Absent'
                          ? 'border-error/20 bg-error/5 hover:border-error'
                          : 'border-outline-variant/20 bg-surface/40 hover:border-outline'
                  }`}
                >
                  <span className="font-mono text-xs absolute top-1 left-1.5 text-on-surface-variant font-semibold">
                    {dayObj.date}
                  </span>
                  
                  {dayObj.type === 'Present' && (
                    <CheckCircle2 className="w-4 h-4 text-primary fill-primary/10 mt-1.5" />
                  )}
                  {dayObj.type === 'Late' && (
                    <Clock className="w-4 h-4 text-secondary-container mt-1.5" />
                  )}
                  {dayObj.type === 'Absent' && (
                    <span className="w-2 h-2 rounded-full bg-error mt-1.5" />
                  )}
                </div>
              ))}
            </div>

            {/* Calendar Legend indexes */}
            <div className="mt-6 pt-4 border-t border-outline-variant/20 flex items-center justify-end gap-md">
              <div className="flex items-center gap-1.5 select-none">
                <CheckCircle2 className="w-4 h-4 text-primary fill-primary/10" />
                <span className="font-label-sm text-[11px] text-on-surface-variant">Present</span>
              </div>
              <div className="flex items-center gap-1.5 select-none">
                <Clock className="w-4 h-4 text-secondary-container" />
                <span className="font-label-sm text-[11px] text-on-surface-variant">Late</span>
              </div>
              <div className="flex items-center gap-1.5 select-none">
                <span className="w-2 h-2 rounded-full bg-error" />
                <span className="font-label-sm text-[11px] text-on-surface-variant font-medium">Absent</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Payment logs listing panel table */}
      <section className="bg-surface-container-lowest/80 backdrop-blur-xl border border-outline-variant/20 rounded-lg overflow-hidden shadow-sm">
        <div className="p-4 md:p-6 border-b border-outline-variant/20 flex items-center justify-between">
          <h3 className="font-headline-md text-lg text-on-surface font-bold">Tuition Payment Ledger Reports</h3>
          <span className="px-3 py-1 bg-primary/15 text-primary rounded-full font-label-sm text-xs font-bold flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5" /> Account status: Synchronized
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="bg-surface border-b border-outline-variant/15 select-none">
                <th className="font-label-sm text-xs text-on-surface-variant px-6 py-4 uppercase">Billing Date</th>
                <th className="font-label-sm text-xs text-on-surface-variant px-6 py-4 uppercase">Billing Invoice ID</th>
                <th className="font-label-sm text-xs text-on-surface-variant px-6 py-4 uppercase">Allocated Amount</th>
                <th className="font-label-sm text-xs text-on-surface-variant px-6 py-4 uppercase text-right">Receipt Status</th>
              </tr>
            </thead>
            <tbody className="text-body-md text-on-surface">
              {invoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="border-b border-outline-variant/10 hover:bg-surface/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium">{inv.date}</td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{inv.id}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-primary">{`$${inv.amount.toFixed(2)}`}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary font-label-sm text-xs font-bold">
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
