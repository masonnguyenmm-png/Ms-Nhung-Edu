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
    <div className="space-y-md">
      {/* Header and Core Context Controls */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-md pb-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary font-bold">Classroom Layout</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-on-background mt-1">Biology 101</h2>
          <p className="text-body-md text-on-surface-variant">
            Manage seating arrangement, individual behavior, and instant rewards for {students.length} students.
          </p>
        </div>

        {/* Global Toolbar */}
        <div className="flex flex-wrap items-center gap-sm w-full xl:w-auto">
          {/* Quick Search Container */}
          <div className="relative flex-1 sm:flex-initial sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/60" />
            <input
              type="text"
              placeholder="Search student or desk ID..."
              value={search}
              onChange={(e) => setSearch(e.value ?? e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-full py-2 pl-10 pr-4 text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all placeholder:text-on-surface-variant/40 text-on-surface"
            />
          </div>

          <button
            onClick={handleRandomizeSelect}
            disabled={isShuffling}
            className="flex items-center gap-2 px-5 py-2.5 bg-surface-container-high text-on-surface rounded-full font-label-md hover:bg-surface-container-highest active:scale-95 duration-200 transition-all border border-outline-variant/30 disabled:opacity-50"
          >
            <Shuffle className={`w-4 h-4 text-primary ${isShuffling ? 'animate-spin' : ''}`} />
            <span>Random Selector</span>
          </button>

          <button
            onClick={() => onAwardAll(5)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-container text-on-primary-container rounded-full font-label-md hover:bg-primary transition-all active:scale-95 shadow-md shadow-primary-container/15"
          >
            <Award className="w-4 h-4" />
            <span>Award All (+5🌟)</span>
          </button>
        </div>
      </div>

      {/* Classroom Seating Canvas grid container */}
      <div className="bg-surface-container-low/70 backdrop-blur-md rounded-lg p-md md:p-lg border border-outline-variant/20 shadow-sm relative overflow-hidden">
        {/* Subtle grid layout lines background to evoke smart-floor style */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{ 
            backgroundImage: `radial-gradient(circle at 1px 1px, #006b47 1px, transparent 0)`, 
            backgroundSize: '40px 40px' 
          }} 
        />

        {/* Board focus anchor */}
        <div className="flex justify-center mb-md relative z-10">
          <div className="px-8 py-2.5 bg-surface-container-highest/90 backdrop-blur-md rounded-full border border-outline-variant/30 shadow-sm flex items-center gap-3">
            <Monitor className="w-4 h-4 text-outline" />
            <span className="font-label-sm text-on-surface-variant uppercase tracking-widest">Smart Board / Front of Room</span>
          </div>
        </div>

        {/* Desk slots grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-sm md:gap-md relative z-10">
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
                        ? 'rgba(189,202,192,0.2)' 
                        : 'rgba(189,202,192,0.5)',
                    boxShadow: isHighlighted
                      ? '0 10px 25px rgba(254,170,0,0.15)'
                      : '0 4px 6px -1px rgba(0,0,0,0.01)'
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={`bg-surface-container-lowest/95 backdrop-blur-sm rounded-lg p-4 border relative group transition-shadow hover:shadow-md ${
                    isAbsent ? 'opacity-65 grayscale-[30%]' : ''
                  }`}
                >
                  {/* Highlight pulse aura */}
                  {isHighlighted && (
                    <div className="absolute inset-0 rounded-lg ring-4 ring-secondary-container/30 animate-pulse pointer-events-none" />
                  )}

                  {/* Stars bubble corner tag */}
                  <div className="absolute top-2 right-2 px-2.5 py-0.5 bg-secondary-container/15 text-secondary-container rounded-full flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-secondary-container" />
                    <span className="font-label-sm">{student.stars}</span>
                  </div>

                  {/* Seat Identifier Desk Label */}
                  <div className="absolute top-2.5 left-2.5 px-1.5 py-0.5 bg-surface-container text-on-surface-variant font-mono text-[10px] rounded">
                    {student.seatId || 'N/A'}
                  </div>

                  {/* Central Student Media Avatar */}
                  <div className="flex flex-col items-center mt-6 mb-4">
                    <div className={`w-16 h-16 rounded-full overflow-hidden p-1 border-2 relative transition-transform group-hover:scale-105 duration-300 ${
                      isHighlighted 
                        ? 'border-secondary-container' 
                        : isAbsent 
                          ? 'border-outline-variant/40' 
                          : 'border-primary-container'
                    }`}>
                      <img
                        src={student.avatar}
                        alt={`${student.name} profile`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover rounded-full"
                      />
                      {/* Active Participation Sparkle indicator */}
                      {student.status === 'Participating' && (
                        <span className="absolute bottom-0 right-0 w-4 h-4 bg-primary-container rounded-full flex items-center justify-center border border-white">
                          <Sparkles className="w-2.5 h-2.5 text-white" />
                        </span>
                      )}
                    </div>

                    <h3 className="font-label-md text-on-surface text-center leading-tight mt-3 font-semibold truncate w-full">
                      {student.name}
                    </h3>
                    <p className={`font-label-sm text-[11px] mt-1 ${
                      isAbsent 
                        ? 'text-error font-bold' 
                        : student.status === 'Participating' 
                          ? 'text-primary font-bold' 
                          : 'text-on-surface-variant/80'
                    }`}>
                      {student.status}
                    </p>
                  </div>

                  {/* Floating Action Controls on Hover */}
                  <div className="flex justify-between items-center bg-surface-container rounded-full p-1 opacity-100 group-hover:opacity-100 md:opacity-0 transition-opacity duration-200">
                    <button
                      onClick={() => onAwardStars(student.id, -1)}
                      title="Deduct 1 Star"
                      disabled={student.stars <= 0}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-error hover:bg-error-container/30 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-[1px] h-4 bg-outline-variant/30 rounded-full" />
                    <button
                      onClick={() => onAwardStars(student.id, 1)}
                      title="Award 1 Star"
                      className="w-8 h-8 rounded-full flex items-center justify-center text-primary hover:bg-primary-container/15 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}

            {/* Empty grid state placeholder */}
            {filteredStudents.length === 0 && (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-on-surface-variant">
                <ChevronRight className="w-12 h-12 text-outline-variant stroke-1 rotate-90" />
                <p className="font-label-md mt-2">No students match your active filters.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
