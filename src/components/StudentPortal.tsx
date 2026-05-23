/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ShieldAlert, Award, FileText, CheckCircle2, Circle, ArrowRight, Download, BookOpen, Clock, Music } from 'lucide-react';
import { Student, DiaryPost, HomeworkTask } from '../types';

interface StudentPortalProps {
  student: Student;
  diaryPosts: DiaryPost[];
  onToggleTask: (postId: string, taskId: string) => void;
  onNavigateToStore: () => void;
}

export default function StudentPortal({
  student,
  diaryPosts,
  onToggleTask,
  onNavigateToStore,
}: StudentPortalProps) {
  return (
    <div className="space-y-md">
      {/* Decorative background gradients */}
      <div className="absolute top-0 right-0 w-full h-96 bg-gradient-to-b from-primary-container/5 to-transparent -z-10 pointer-events-none" />

      {/* Page header banner greeting */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-md pb-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary font-bold">Student Center Portal</p>
          <h2 className="text-3xl font-extrabold text-on-background mt-1 tracking-tight">
            Hello, {student.name.split(' ')[0]}! ✨
          </h2>
          <p className="text-body-md text-on-surface-variant">
            Here is a look at your learning logs, points and homework checklists for today.
          </p>
        </div>
      </div>

      {/* Bento Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Achievements / Star Wallet (Columns 8 span) */}
        <div className="lg:col-span-8 bg-surface-container-lowest/90 backdrop-blur-xl border border-outline-variant/20 rounded-xl p-6 md:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden h-full min-h-[280px]">
          {/* Subtle background tech matrix */}
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#00875a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 h-full">
            <div className="flex-1 space-y-4 text-center sm:text-left">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary-container/15 text-on-secondary-container font-label-sm text-xs font-bold">
                <Star className="w-4 h-4 text-secondary-container fill-secondary-container animate-pulse" />
                Active Badge: Master Botanist 🍀
              </span>

              <h2 className="text-2xl font-bold text-on-surface">My Star Wallet</h2>
              <div className="flex items-baseline justify-center sm:justify-start gap-2.5">
                <span className="text-6xl font-extrabold text-primary tracking-tight">
                  {student.stars}
                </span>
                <span className="text-lg font-bold text-on-surface-variant/80">Available Stars</span>
              </div>

              <button 
                onClick={onNavigateToStore}
                className="bg-primary text-on-primary font-bold py-3.5 px-6 rounded-full hover:bg-primary-container transition-all active:scale-95 shadow-md shadow-primary/10 flex items-center justify-center gap-2 mx-auto sm:mx-0"
              >
                <span>Visit Classroom Reward Store</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Glowing Golden Mascot/Star Element */}
            <div className="relative w-40 h-40 md:w-48 md:h-48 flex-shrink-0 animate-bounce" style={{ animationDuration: '6s' }}>
              <div className="absolute inset-x-0 bottom-2 bg-secondary-container/30 blur-2xl rounded-full h-6 w-3/4 mx-auto" />
              <img
                src="https://lh3.googleusercontent.com/aida/ADBb0uj_ofB6D6qlAtAwADsj9213LZ4IYRfPfBa6L_56Vzdj7_1bCdbO30G3avnXEReTJCq2RRl_yZMmij5zMNbMYoQiwKCYFNSIslLCnwk5C1HuXZKL1uujzzTqeBfFk_tzGdbdZt7jOUoyPT6GQQBEOcqBjS9SIln51lBmY_2Seg2f_RcaoA-YTdkmkbNrTxjgcYCskAHhfS6gGFV4L3D8C70G9lhBeh5nzC9IeOQ_hJmdCO2eLFbrC6KoPhc"
                alt="3D Golden Star Medal"
                className="relative z-10 w-full h-full object-contain drop-shadow"
              />
            </div>
          </div>
        </div>

        {/* Weekly Goals Summary sidebar (Lines 4 span) */}
        <div className="lg:col-span-4 flex flex-col gap-gutter">
          {/* Progress Card */}
          <div className="bg-surface-container-lowest/80 backdrop-blur-xl border border-outline-variant/20 rounded-lg p-6 flex-1 flex flex-col justify-center shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-label-sm text-xs uppercase tracking-wider text-on-surface-variant">Weekly Learning Goal</h3>
              <Clock className="w-4 h-4 text-tertiary" />
            </div>
            
            <div className="text-xl font-bold text-on-surface">80% Submissions Completed</div>
            {/* High end progress tracker bar */}
            <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden mt-3 shadow-inner">
              <div className="h-full bg-secondary-container rounded-full" style={{ width: '80%' }} />
            </div>

            <p className="font-label-sm text-xs text-on-surface-variant/90 mt-3 font-medium">
              Only 1 assignment remaining for the week. Complete cell observation logs!
            </p>
          </div>

          {/* Up Next schedule notification card */}
          <div className="bg-tertiary-container text-on-tertiary-container rounded-lg p-6 flex-1 flex flex-col justify-between shadow-md relative overflow-hidden border-none shadow-tertiary-container/10">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
            
            <div>
              <p className="font-label-sm text-xs uppercase tracking-wider text-white/85">Up Next Tomorrow</p>
              <h4 className="text-xl font-bold mt-1">Science Fair Assembly</h4>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-white/90 mt-4">
              <Clock className="w-4 h-4" />
              <span>Oct 25, 10:00 AM • Gym Arena</span>
            </div>
          </div>
        </div>
      </div>

      {/* Class Diary Feed timeline container */}
      <div className="max-w-4xl space-y-md pt-5">
        <h3 className="text-2xl font-bold text-on-surface">Academic Class Diary</h3>

        <div className="relative pl-4 md:pl-0">
          {/* Left timeline thread alignment wire */}
          <div className="absolute left-[15px] md:left-[24px] top-6 bottom-0 w-[2px] bg-primary/20 pointer-events-none" />

          <div className="space-y-md">
            {diaryPosts.map((post) => (
              <div key={post.id} className="relative flex gap-4 md:gap-6 timeline-item">
                {/* Timeline node icon */}
                <div className="relative z-10 w-12 h-12 shrink-0 bg-primary rounded-full border-4 border-surface-bg flex items-center justify-center text-white shadow-md shadow-primary/10 select-none">
                  {post.subject.toLowerCase().includes('arts') ? (
                    <BookOpen className="w-5 h-5" />
                  ) : (
                    <Clock className="w-5 h-5" />
                  )}
                </div>

                {/* Main diary content glasscard */}
                <div className="flex-1 bg-surface-container-lowest/80 backdrop-blur-xl border border-outline-variant/20 rounded-lg p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 mb-4">
                    <div>
                      <p className="font-label-sm text-xs text-on-surface-variant font-semibold">
                        {post.date} • {post.time}
                      </p>
                      <h4 className="text-xl font-bold text-on-surface">{post.subject}: {post.title}</h4>
                    </div>

                    <span className="inline-flex self-start md:self-auto px-3 py-1 bg-surface-container text-on-surface-variant text-xs font-bold rounded-full border border-outline-variant/30 whitespace-nowrap">
                      {post.topic}
                    </span>
                  </div>

                  <p className="text-body-md text-on-surface-variant/90 leading-relaxed mb-5">
                    {post.content}
                  </p>

                  {/* Attachment Media Grid */}
                  {post.images && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
                      {post.images.map((img, idx) => (
                        <div key={idx} className="aspect-[4/3] rounded-lg overflow-hidden border border-outline-variant/20 relative group bg-surface-container-low">
                          <img
                            src={img}
                            alt="Diary Attachment log"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Attachment Document download node */}
                  {post.pdf && (
                    <div className="bg-surface rounded-lg p-3 border border-outline-variant/30 flex items-center justify-between backdrop-blur-sm mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-label-sm text-xs font-semibold text-on-surface">{post.pdf.name}</p>
                          <p className="font-label-xs text-[10px] text-outline">{post.pdf.size} Document sheet</p>
                        </div>
                      </div>
                      <button className="p-2 text-on-surface-variant hover:text-primary rounded-full hover:bg-surface-container transition-all">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Dynamic checklist logs */}
                  {post.homework.length > 0 && (
                    <div className="bg-surface rounded-lg p-4 border border-outline-variant/30 shadow-inner">
                      <h5 className="font-label-sm text-xs uppercase tracking-wider text-on-surface-variant mb-3 font-bold">
                        Pending Assignments Checklist
                      </h5>
                      <div className="space-y-2">
                        {post.homework.map((task) => (
                          <div
                            key={task.id}
                            onClick={() => onToggleTask(post.id, task.id)}
                            className="flex items-start gap-2.5 p-2 rounded hover:bg-surface-variant/30 transition-colors cursor-pointer group"
                          >
                            {task.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5 fill-primary/10" />
                            ) : (
                              <Circle className="w-5 h-5 text-outline shrink-0 mt-0.5 group-hover:text-primary transition-colors" />
                            )}
                            <span className={`text-body-md text-sm ${
                              task.completed 
                                ? 'text-on-surface-variant/60 line-through' 
                                : 'text-on-surface font-medium'
                            }`}>
                              {task.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
