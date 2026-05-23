/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Invoice } from '../types';
import { CheckCircle2, AlertTriangle, Calendar, Clock, DollarSign, ArrowRight, Notebook, CreditCard } from 'lucide-react';
import { Language } from '../translations';

interface TuitionTrackerProps {
  invoices: Invoice[];
  lang?: Language;
}

export default function TuitionTracker({ invoices, lang = 'vi' }: TuitionTrackerProps) {
  // Balance variables
  const remainingLessons = 8;
  const totalLessons = 24;
  const percentageLeft = Math.round((remainingLessons / totalLessons) * 100);

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="pb-2">
        <p className="text-xs uppercase tracking-widest text-[#006b47] font-extrabold flex items-center gap-1">
          <CreditCard className="w-3.5 h-3.5 text-emerald-650" />
          {lang === 'en' ? 'Tuition, Ledger & Calendar Audit' : 'Kiểm toán Học phí, Sổ cái & Lịch trình'}
        </p>
        <h2 className="text-2xl font-black text-zinc-900 tracking-tight mt-1">
          {lang === 'en' ? 'Financial & Attendance Tracker' : 'Theo dõi Tài chính & Chuyên cần'}
        </h2>
        <p className="text-sm text-zinc-550">
          {lang === 'en' 
            ? 'Review subscription milestones, active lesson credit allotments, and current month calendar correlations.' 
            : 'Xem xét tiến độ nộp phí, số buổi học còn lại và đối chiếu chuyên cần theo lịch học tháng hiện tại.'}
        </p>
      </div>

      {/* Bento grid layout widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left balance circle progress (Span 4) */}
        <section className="lg:col-span-4 bg-white border border-zinc-200/50 rounded-2xl p-6 flex flex-col items-center justify-center relative premium-shadow">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-600 to-emerald-450 rounded-t-2xl" />
          <h3 className="text-zinc-800 text-sm font-extrabold text-center mb-6">{lang === 'en' ? 'Class Balance Accounts' : 'Số dư Tài khoản Lớp học'}</h3>

          {/* Graphical Lesson Gauge Progress dial */}
          <div className="relative w-40 h-40 flex items-center justify-center mb-6 select-none animate-fade-in">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background trace */}
              <circle
                cx="50"
                cy="50"
                r="41"
                fill="none"
                stroke="#f4f4f5"
                strokeWidth="7"
              />
              {/* Foreground value trace */}
              <circle
                cx="50"
                cy="50"
                r="41"
                fill="none"
                stroke="url(#gradient-emerald)"
                strokeWidth="7"
                strokeDasharray="257.6"
                strokeDashoffset={257.6 - (257.6 * percentageLeft) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="gradient-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black text-zinc-905 tracking-tight">{remainingLessons}</span>
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">
                {lang === 'en' ? `${remainingLessons} of ${totalLessons} left` : `Còn ${remainingLessons} / ${totalLessons} buổi`}
              </span>
            </div>
          </div>

          {/* Warn signal renewal badge marker */}
          <div className="bg-amber-50/70 border border-amber-200/50 text-amber-700 px-4 py-2 rounded-full flex items-center gap-2 select-none animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-[10.5px] font-extrabold uppercase tracking-wider">{lang === 'en' ? 'Renewal Needed' : 'Yêu cầu nạp phí'}</span>
          </div>
        </section>

        {/* Calendar Grid overview container */}
        <section className="lg:col-span-8 bg-white border border-zinc-200/50 rounded-2xl p-6 relative premium-shadow">
          <div className="flex items-center justify-between mb-5 select-none animate-fade-in">
            <h3 className="text-sm font-extrabold text-zinc-800">{lang === 'en' ? 'Class Attendance Calendar' : 'Lịch điểm danh Học viên'}</h3>
            <span className="text-xs text-zinc-400 font-bold">{lang === 'en' ? 'May 2026' : 'Tháng 5, 2026'}</span>
          </div>

          <div className="w-full">
            {/* Weekdays names grid header */}
            <div className="grid grid-cols-7 gap-2 mb-3 text-center select-none">
              {(lang === 'en' ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] : ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']).map((day) => (
                <div key={day} className="text-[10px] font-black text-zinc-400 tracking-wider uppercase">
                  {day}
                </div>
              ))}
            </div>

            {/* Simulated Active Dates index grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Initial spacing offsets */}
              <div className="aspect-square bg-zinc-50 border border-zinc-150 rounded-xl flex items-center justify-center opacity-30 select-none text-xs font-semibold text-zinc-400">29</div>
              <div className="aspect-square bg-zinc-50 border border-zinc-150 rounded-xl flex items-center justify-center opacity-30 select-none text-xs font-semibold text-zinc-400">30</div>

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
                  className={`aspect-square border rounded-xl flex flex-col items-center justify-center relative transition-colors ${
                    dayObj.type === 'Present'
                      ? 'border-emerald-200 bg-emerald-500/[0.03] hover:border-emerald-400'
                      : dayObj.type === 'Late'
                        ? 'border-amber-200 bg-amber-500/[0.03] hover:border-amber-400'
                        : dayObj.type === 'Absent'
                          ? 'border-rose-200 bg-rose-500/[0.03] hover:border-rose-400'
                          : 'border-zinc-200 bg-zinc-50/20 hover:border-zinc-300'
                  }`}
                >
                  <span className="text-[10px] absolute top-1 left-2 text-zinc-405 font-bold">
                    {dayObj.date}
                  </span>
                  
                  {dayObj.type === 'Present' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-2" />
                  )}
                  {dayObj.type === 'Late' && (
                    <Clock className="w-3.5 h-3.5 text-amber-500 mt-2" />
                  )}
                  {dayObj.type === 'Absent' && (
                    <span className="w-2 h-2 rounded-full bg-rose-650 mt-2 animate-ping" />
                  )}
                </div>
              ))}
            </div>

            {/* Calendar Legend indexes */}
            <div className="mt-5 pt-4 border-t border-zinc-150 flex items-center justify-end gap-5 select-none text-xs">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[10.5px] text-zinc-500 font-bold">{lang === 'en' ? 'Present' : 'Có mặt'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[10.5px] text-zinc-500 font-bold">{lang === 'en' ? 'Late' : 'Muộn'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                <span className="text-[10.5px] text-zinc-500 font-bold">{lang === 'en' ? 'Absent' : 'Vắng'}</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Payment logs listing panel table */}
      <section className="bg-white border border-zinc-200/50 rounded-2xl overflow-hidden premium-shadow">
        <div className="p-5 border-b border-zinc-150 flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-zinc-800 flex items-center gap-1.5 animate-fade-in">
            <Notebook className="w-4 h-4 text-[#006b47]" />
            <span>{lang === 'en' ? 'Tuition Payment Ledger Reports' : 'Báo cáo Sổ cái Thanh toán Học phí'}</span>
          </h3>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-705 border border-emerald-150 rounded-full text-[10.5px] font-bold flex items-center gap-1 animate-fade-in">
            <DollarSign className="w-3 h-3" /> {lang === 'en' ? 'Account Synchronized' : 'Đã đồng bộ số liệu'}
          </span>
        </div>

        <div className="overflow-x-auto select-none">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-150">
                <th className="text-[10.5px] font-bold text-zinc-400 px-6 py-3.5 uppercase tracking-wider">{lang === 'en' ? 'Billing Date' : 'Ngày thanh toán'}</th>
                <th className="text-[10.5px] font-bold text-zinc-400 px-6 py-3.5 uppercase tracking-wider">{lang === 'en' ? 'Billing Invoice ID' : 'Mã hóa đơn'}</th>
                <th className="text-[10.5px] font-bold text-zinc-400 px-6 py-3.5 uppercase tracking-wider">{lang === 'en' ? 'Allocated Amount' : 'Số tiền'}</th>
                <th className="text-[10.5px] font-bold text-zinc-400 px-6 py-3.5 uppercase tracking-wider text-right">{lang === 'en' ? 'Receipt Status' : 'Trạng thái'}</th>
              </tr>
            </thead>
            <tbody className="text-zinc-700">
              {invoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="border-b border-zinc-100 hover:bg-zinc-50/30 transition-colors"
                >
                  <td className="px-6 py-4 text-xs font-bold text-zinc-800">{inv.date}</td>
                  <td className="px-6 py-4 text-xs font-mono text-zinc-400">{inv.id}</td>
                  <td className="px-6 py-4 text-xs font-black text-emerald-750">{`$${inv.amount.toFixed(2)}`}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center px-3 py-1 bg-emerald-500/10 text-[#006b47] rounded-full text-[10px] font-black">
                      {inv.status === 'Paid' ? (lang === 'en' ? 'Paid' : 'Đã thanh toán') : (lang === 'en' ? inv.status : 'Chưa thanh toán')}
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

