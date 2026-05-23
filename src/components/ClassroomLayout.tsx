/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Shuffle, Award, Plus, Minus, Star, Monitor, ChevronRight, Sparkles } from 'lucide-react';
import { Student } from '../types';

interface ClassroomLayoutProps {
  students: Student[];
  onAwardStars: (studentId: string, count: number) => void;
  onAwardAll: (count: number) => void;
}

export default function ClassroomLayout({
  students,
  onAwardStars,
  onAwardAll,
}: ClassroomLayoutProps) {
  const [search, setSearch] = useState('');
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);

  // Filter based on search query
  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  // Randomizer picker animation
  const handleRandomizeSelect = () => {
    if (students.length === 0 || isShuffling) return;
    setIsShuffling(true);
    let counter = 0;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * students.length);
      setHighlightedId(students[randomIndex].id);
      counter++;
      if (counter > 12) {
        clearInterval(interval);
        setIsShuffling(false);
      }
    }, 150);
  };

  return (
    <div className="space-y-6">
      {/* Header and Core Context Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
        <div>
          <p className="text-xs uppercase tracking-widest text-emerald-700 font-extrabold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-500" />
            Interactive Map
          </p>
          <h2 className="text-2xl font-black text-zinc-900 tracking-tight mt-1">Classroom Floor Plan</h2>
          <p className="text-sm text-zinc-550">
            Real-time layout control, behavioral milestones, and quick-points tools for {students.length} students.
          </p>
        </div>

        {/* Global Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Quick Search Container */}
          <div className="relative flex-1 sm:flex-initial sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search student or desk ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-zinc-200 focus:border-emerald-600 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white transition-all placeholder:text-zinc-300 text-zinc-800"
            />
          </div>

          <button
            onClick={handleRandomizeSelect}
            disabled={isShuffling}
            className="flex items-center gap-1.5 px-4.5 py-2 bg-white text-zinc-700 rounded-full font-bold text-xs hover:bg-zinc-50 hover:text-zinc-900 active:scale-95 duration-200 transition-all border border-zinc-200 disabled:opacity-55"
          >
            <Shuffle className={`w-3.5 h-3.5 text-emerald-600 ${isShuffling ? 'animate-spin' : ''}`} />
            <span>Random Draw</span>
          </button>

          <button
            onClick={() => onAwardAll(5)}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-700 text-white rounded-full font-bold text-xs hover:bg-emerald-800 transition-all active:scale-95 shadow-lg shadow-emerald-700/10"
          >
            <Award className="w-4 h-4" />
            <span>Award All (+5 ★)</span>
          </button>
        </div>
      </div>

      {/* Classroom Seating Canvas grid container */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-zinc-200/60 shadow-lg relative overflow-hidden floor-board-pattern">
        {/* Board focus anchor */}
        <div className="flex justify-center mb-10 relative z-10">
          <div className="px-8 py-2 bg-zinc-900 text-white rounded-full border border-zinc-800 shadow-xl flex items-center gap-3">
            <Monitor className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-widest font-black">Interactive LCD Smartboard / Classroom Front</span>
          </div>
        </div>

        {/* Desk slots grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5 relative z-10">
          <AnimatePresence>
            {filteredStudents.map((student) => {
              const isHighlighted = highlightedId === student.id;
              const isAbsent = student.status === 'Absent';
              
              return (
                <motion.div
                  key={student.id}
                  layoutId={`student-desk-${student.id}`}
                  animate={{
                    scale: isHighlighted ? 1.05 : 1,
                    borderColor: isHighlighted 
                      ? '#feaa00' 
                      : isAbsent 
                        ? '#f4f4f5' 
                        : '#e4e4e7',
                    boxShadow: isHighlighted
                      ? '0 20px 35px -10px rgba(254,170,0,0.25), 0 0 0 2px #feaa00'
                      : '0 4px 15px -10px rgba(0,0,0,0.05)'
                  }}
                  transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                  className={`bg-white/95 backdrop-blur-md rounded-2xl p-4 border relative group transition-all duration-300 premium-shadow hover:translate-y-[-2px] holo-card ${
                    isAbsent ? 'opacity-55 grayscale-[20%]' : ''
                  }`}
                >
                  {/* Highlight pulse aura */}
                  {isHighlighted && (
                    <div className="absolute inset-x-0 -top-1 bottom-0 rounded-2xl ring-4 ring-amber-400/20 animate-pulse pointer-events-none" />
                  )}

                  {/* Stars bubble corner tag */}
                  <div className="absolute top-3 right-3 px-2 py-0.5 bg-amber-500/10 text-amber-700 rounded-full flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span className="font-mono text-[10.5px] font-black">{student.stars}</span>
                  </div>

                  {/* Seat Identifier Desk Label */}
                  <div className="absolute top-3.5 left-3.5 px-2 py-0.2 bg-zinc-100 text-zinc-500 font-mono text-[9px] font-bold rounded">
                    Desk {student.seatId || 'N/A'}
                  </div>

                  {/* Central Student Media Avatar */}
                  <div className="flex flex-col items-center mt-6 mb-4">
                    <div className={`w-14 h-14 rounded-full overflow-hidden p-[2px] transition-all duration-300 group-hover:scale-105 ${
                      isHighlighted 
                        ? 'bg-amber-500' 
                        : isAbsent 
                          ? 'bg-zinc-200' 
                          : 'bg-emerald-600'
                    }`}>
                      <img
                        src={student.avatar}
                        alt={`${student.name} profile`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover rounded-full bg-zinc-50 border-2 border-white"
                      />
                    </div>

                    <h3 className="text-xs text-zinc-800 text-center font-extrabold truncate w-full mt-3">
                      {student.name}
                    </h3>
                    <p className={`text-[10px] uppercase font-bold tracking-wider mt-1 ${
                      isAbsent 
                        ? 'text-red-500' 
                        : student.status === 'Participating' 
                          ? 'text-emerald-700' 
                          : 'text-zinc-400'
                    }`}>
                      {student.status}
                    </p>
                  </div>

                  {/* Floating Action Controls on Hover */}
                  <div className="flex justify-between items-center bg-zinc-50 border border-zinc-100 rounded-full p-0.5 opacity-100 group-hover:opacity-100 transition-all duration-300 shadow-sm">
                    <button
                      onClick={() => onAwardStars(student.id, -1)}
                      title="Deduct 1 Star (-)"
                      disabled={student.stars <= 0}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-20 disabled:hover:bg-transparent"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-[1px] h-3 bg-zinc-200" />
                    <button
                      onClick={() => onAwardStars(student.id, 1)}
                      title="Award 1 Star (+)"
                      className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}

            {/* Empty grid state placeholder */}
            {filteredStudents.length === 0 && (
              <div className="col-span-full py-16 flex flex-col items-center justify-center text-zinc-400 bg-zinc-50/50 rounded-xl border border-dashed border-zinc-200">
                <p className="font-bold text-sm">No students found matching filters.</p>
                <p className="text-xs text-zinc-400 mt-1">Refine your search parameters and try again.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
