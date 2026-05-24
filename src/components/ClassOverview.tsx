/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Student, DiaryPost } from '../types';
import {
  Sparkles,
  Award,
  BookOpen,
  TrendingUp,
  Clock,
  CheckCircle,
  HelpCircle,
  Plus,
  Users,
  Target,
  ChevronRight,
  Bookmark,
  Activity,
  Flame,
  Star,
  Heart
} from 'lucide-react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';

import { Language, translations } from '../translations';

interface ClassOverviewProps {
  students: Student[];
  diaryPosts: DiaryPost[];
  onNavigateToTab: (tab: 'dashboard' | 'attendance' | 'reports' | 'rewards' | 'student-portal' | 'tuition') => void;
  userEmail?: string | null;
  lang?: Language;
  nhungMemo?: string;
  onUpdateMemo?: (newMemo: string) => void;
  loveHearts?: number;
  onAddHeart?: () => void;
  onAddStudent?: (studentData: { name: string; grade: number; stars: number; avatar: string; classId: string }) => Promise<void>;
  selectedClass?: string;
}

export default function ClassOverview({
  students,
  diaryPosts,
  onNavigateToTab,
  userEmail,
  lang = 'vi',
  nhungMemo = '',
  onUpdateMemo,
  loveHearts = 128,
  onAddHeart,
  onAddStudent,
  selectedClass = 'Period 3: Biology',
}: ClassOverviewProps) {
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [classGoal, setClassGoal] = useState('Read 50 books collectively by Friday.');
  const [tempGoal, setTempGoal] = useState(classGoal);

  // States for student enrollment
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentGrade, setNewStudentGrade] = useState(90);
  const [newStudentStars, setNewStudentStars] = useState(10);
  const [newStudentAvatar, setNewStudentAvatar] = useState('👩‍🎓');
  const [addStudentClass, setAddStudentClass] = useState(selectedClass);
  const [modalError, setModalError] = useState<string | null>(null);

  const t = (key: keyof typeof translations['en']) => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  // States for Ms Nhung's interactive message corner
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number }[]>([]);
  const [editingMemo, setEditingMemo] = useState(false);
  const [memoInput, setMemoInput] = useState(nhungMemo);

  // Synchronize input when prop changes
  React.useEffect(() => {
    setMemoInput(nhungMemo);
  }, [nhungMemo]);

  const triggerLocalHeart = () => {
    if (onAddHeart) onAddHeart();
    const id = Date.now();
    const x = Math.random() * 80 - 40; // horizontal deviation
    setFloatingHearts(prev => [...prev, { id, x }]);
    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(h => h.id !== id));
    }, 1500);
  };

  // Dynamic Metrics and Stats
  const totalStudents = students.length || 1;
  const totalStars = students.reduce((sum, s) => sum + (s.stars || 0), 0);
  
  const presentCount = students.filter(s => s.status === 'Present' || s.status === 'Participating' || s.status === 'Late').length;
  const attendanceRate = Math.round((presentCount / totalStudents) * 100);

  // Top Achievers (sorted by stars descending)
  const topAchievers = [...students]
    .sort((a, b) => (b.stars || 0) - (a.stars || 0))
    .slice(0, 3);

  // Handle goal edit
  const handleSaveGoal = () => {
    setClassGoal(tempGoal);
    setShowGoalModal(false);
  };

  return (
    <div className="space-y-8 select-text">
      {/* Dynamic Announcement Banner with High-End Glass Backdrops */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#005e3a] via-[#006b47] to-[#004d33] text-white p-6 md:p-8 shadow-xl">
        {/* Abstract organic background shapes */}
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl" />
        <div className="absolute right-1/4 bottom-0 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl animate-pulse" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[11px] font-bold uppercase tracking-wider text-emerald-200 border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              {lang === 'en' ? 'Active Classroom Homeroom' : 'Lớp Học Chủ Nhiệm Hoạt Động'}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight animate-fade-in">
              {lang === 'en' ? "Welcome to Ms Nhung's Classroom" : "Chào mừng đến Lớp của Cô Nhung"} <span className="inline-block hover:scale-125 transition-transform duration-200 cursor-pointer">✨</span>
            </h1>
            <p className="text-sm md:text-base text-emerald-100/90 leading-relaxed font-normal">
              {lang === 'en' 
                ? "Inspire curiosity, spark bright innovations, and level up student performance. Today is a great day to unlock another set of brilliant educational milestones!"
                : "Khơi dậy sự tò mò, thúc đẩy các đổi mới sáng tạo và nâng cao thành tích của học sinh. Hôm nay là ngày tuyệt vời để chinh phục các mục tiêu mới!"}
            </p>
          </div>

          <div className="shrink-0">
            <motion.div 
              whileHover={{ scale: 1.02, y: -2 }}
              onClick={() => {
                setTempGoal(classGoal);
                setShowGoalModal(true);
              }}
              className="bg-white/10 backdrop-blur-md hover:bg-white/15 text-white p-5 rounded-xl border border-white/10 shadow-xl max-w-xs transition-all duration-300 cursor-pointer animate-fade-in"
            >
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
                <Award className="w-4 h-4 fill-amber-400/20" />
                <span>{lang === 'en' ? 'ACTIVE CLASSROOM GOAL' : 'MỤC TIÊU LỚP HỌC CHUNG'}</span>
              </div>
              <p className="text-xs text-emerald-100 mt-1 line-clamp-3 italic font-medium">
                "{classGoal}"
              </p>
              <div className="text-[11px] text-amber-300 hover:text-amber-200 hover:underline font-bold mt-3.5 flex items-center gap-1">
                <span>{lang === 'en' ? 'Update Class Goal' : 'Cập nhật mục tiêu'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Cô Nhung's Special Bulletin Board & Warm Interactive Corner */}
      <section className="bg-gradient-to-br from-rose-50/70 via-white to-emerald-50/40 border border-rose-100/50 p-6 rounded-3xl premium-shadow relative overflow-hidden">
        {/* Abstract background blobs for a warm, cozy handcrafted feel */}
        <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-rose-200/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-amber-200/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-rose-500/10 rounded-full text-rose-600">
                <Heart className="w-4 h-4 fill-rose-500" />
              </span>
              <span className="text-xs font-black tracking-widest text-rose-600 uppercase">
                {lang === 'en' ? "CO NHUNG'S DAILY INSPIRATION" : "GÓC NHỎ TRUYỀN CẢM HỨNG CỦA CÔ NHUNG"}
              </span>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                {lang === 'en' ? "Cozy Class Advisor" : "Giáo Viên Chủ Nhiệm"}
              </span>
            </div>

            {editingMemo ? (
              <div className="space-y-2 mt-2">
                <textarea
                  value={memoInput}
                  onChange={(e) => setMemoInput(e.target.value)}
                  maxLength={200}
                  className="w-full p-3 border border-rose-200 focus:border-rose-400 focus:ring-1 focus:ring-rose-400 rounded-xl text-sm bg-white text-zinc-800 font-medium"
                  placeholder={lang === 'en' ? "Write a warm note to your class..." : "Viết vài lời nhắn gửi yêu thương..."}
                  rows={2}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (onUpdateMemo) onUpdateMemo(memoInput);
                      setEditingMemo(false);
                    }}
                    className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                  >
                    {lang === 'en' ? "Save Note" : "Lưu lời nhắn"}
                  </button>
                  <button
                    onClick={() => {
                      setMemoInput(nhungMemo);
                      setEditingMemo(false);
                    }}
                    className="px-3.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-lg text-xs font-bold transition-all"
                  >
                    {lang === 'en' ? "Cancel" : "Hủy"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <blockquote className="text-sm md:text-base font-medium text-zinc-900 leading-relaxed italic pr-4">
                  "{nhungMemo || (lang === 'en' ? "Believe in yourself and shine always!" : "Hãy luôn tự tin vào bản thân và tỏa sáng nhé!")}"
                </blockquote>
                <div className="flex items-center gap-2 text-zinc-500 text-xs">
                  <span>— <strong>Ms Nhung (Cô Nhung)</strong></span>
                  <button 
                    onClick={() => setEditingMemo(true)} 
                    className="text-[10px] text-zinc-400 hover:text-rose-500 underline font-semibold transition-colors animate-fade-in"
                  >
                    [{lang === 'en' ? "Edit Live Note" : "Sửa lời nhắn"}]
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Heart Giving Station */}
          <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-zinc-100 pt-4 md:pt-0 md:pl-8 min-w-[190px] relative">
            <div className="text-center space-y-1 mb-2">
              <span className="text-xs font-bold text-zinc-400 tracking-wider">
                {lang === 'en' ? "HEARTS RECEIVED" : "TIM YÊU THƯƠNG ĐÃ NHẬN"}
              </span>
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-2xl font-black text-rose-600 tracking-tight">
                  {loveHearts.toLocaleString()}
                </span>
                <span className="text-lg">💖</span>
              </div>
            </div>

            <button
              onClick={triggerLocalHeart}
              className="px-5 py-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold rounded-full text-xs shadow-md shadow-rose-500/10 hover:shadow-rose-500/20 active:scale-95 duration-200 flex items-center gap-1.5 transition-all text-center select-none"
            >
              <Heart className="w-3.5 h-3.5 fill-white text-white animate-pulse" />
              <span>{lang === 'en' ? "Send Heart!" : "Thả tim tặng Cô!"}</span>
            </button>

            {/* Floating animations container */}
            <div className="absolute inset-x-0 bottom-0 overflow-visible pointer-events-none flex justify-center">
              <AnimatePresence>
                {floatingHearts.map((h) => (
                  <motion.span
                    key={h.id}
                    initial={{ opacity: 1, y: -20, x: h.x, scale: 0.6 }}
                    animate={{ opacity: 0, y: -130, x: h.x + Math.sin(h.id) * 35, scale: 1.5 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.3, ease: 'easeOut' }}
                    className="absolute text-rose-500 pointer-events-none text-2xl z-20"
                    style={{ bottom: '26px' }}
                  >
                    ❤️
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Metrics Stats Row - Bento-Box Premium Layout */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Class Spirit Multi-Star Tracker */}
        <div className="bg-white border border-zinc-200/50 p-6 rounded-2xl flex items-center justify-between premium-shadow premium-shadow-hover transition-all duration-300">
          <div className="space-y-3">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5 animate-fade-in">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
              {lang === 'en' ? 'Classwide Spirit' : 'Tinh thần Lập thành tích'}
            </p>
            <div className="flex items-baseline gap-1.5 animate-fade-in">
              <h2 className="text-4xl font-black text-zinc-900 tracking-tight">
                {totalStars.toLocaleString()}
              </h2>
              <span className="text-xs font-bold text-zinc-500">{lang === 'en' ? 'Total Stars' : 'Tổng số sao'}</span>
            </div>
            <p className="text-[11px] text-zinc-500 animate-fade-in">
              {lang === 'en' ? 'Redeemable points across all active students.' : 'Điểm tích lũy quy đổi của tất cả học sinh.'}
            </p>
          </div>

          <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
            {/* Soft decorative spinning accent */}
            <div className="absolute inset-0 rounded-full border-2 border-emerald-600/10 border-t-emerald-600 animate-spin" style={{ animationDuration: '4s' }} />
            <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-700 font-black text-sm">
              ★
            </div>
          </div>
        </div>

        {/* Current Interactive Lesson Subject Topic */}
        <div 
          onClick={() => onNavigateToTab('student-portal')}
          className="bg-white border border-zinc-200/50 p-6 rounded-2xl flex items-start gap-4 premium-shadow premium-shadow-hover transition-all duration-300 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-all duration-300">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="space-y-1.5 flex-1 animate-fade-in">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{lang === 'en' ? 'Active Curriculum' : 'Giáo trình Học tập'}</p>
            <h3 className="font-extrabold text-base text-zinc-800 leading-snug">
              {lang === 'en' ? 'Advanced English & Lit' : 'Văn học & Tiếng Anh Nâng cao'}
            </h3>
            <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1 group-hover:underline">
              <span>{lang === 'en' ? 'Module 4: Poetry & Metaphor' : 'Chuyên đề 4: Thơ ca & Ẩn dụ'}</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </p>
          </div>
        </div>

        {/* Attendance Daily Counter Gauge */}
        <div 
          onClick={() => onNavigateToTab('attendance')}
          className="bg-white border border-zinc-200/50 p-6 rounded-2xl flex flex-col justify-between premium-shadow premium-shadow-hover transition-all duration-300 cursor-pointer group"
        >
          <div className="flex items-center justify-between animate-fade-in">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-zinc-500" />
              {lang === 'en' ? 'Daily Handcount' : 'Điểm diện Hàng ngày'}
            </p>
            <span className="text-[11px] font-bold text-emerald-700 px-2.5 py-0.5 bg-emerald-50 rounded-full">
              {presentCount} / {totalStudents} {lang === 'en' ? 'present' : 'có mặt'}
            </span>
          </div>

          <div className="mt-4 space-y-2 animate-fade-in">
            <div className="flex justify-between items-baseline">
              <h3 className="font-extrabold text-xl text-zinc-800">{attendanceRate}% {lang === 'en' ? 'Attendance' : 'Sĩ số có mặt'}</h3>
              <span className="text-[10px] font-bold text-zinc-400 uppercase">{lang === 'en' ? 'Goal' : 'Chỉ tiêu'}: 85%</span>
            </div>
            
            <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden border border-zinc-200/10">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, attendanceRate)}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={`h-full rounded-full ${attendanceRate >= 85 ? 'bg-emerald-600' : 'bg-amber-500'}`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid Content Panels */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Side: Top Achievers High Ranking Panel */}
        <div className="lg:col-span-3 bg-white border border-zinc-200/50 p-6 rounded-2xl flex flex-col justify-between premium-shadow">
          <div>
            <div className="flex justify-between items-center mb-6 border-b border-zinc-100 pb-4">
              <h3 className="font-extrabold text-base text-zinc-800 flex items-center gap-2.5">
                <Award className="w-5 h-5 text-amber-500 fill-amber-500/10" />
                <span>Classroom Honor Roll</span>
              </h3>
              <div className="flex items-center gap-2.5">
                <button 
                  onClick={() => {
                    setNewStudentName('');
                    setNewStudentGrade(90);
                    setNewStudentStars(10);
                    setNewStudentAvatar('👩‍🎓');
                    setAddStudentClass(selectedClass);
                    setModalError(null);
                    setShowAddStudentModal(true);
                  }}
                  className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/50 px-3 py-1.5 rounded-xl flex items-center gap-1 font-bold transition-all active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t('addStudentBtn')}</span>
                </button>
                <button 
                  onClick={() => onNavigateToTab('dashboard')}
                  className="text-xs font-bold text-zinc-500 hover:text-emerald-700 hover:underline flex items-center gap-0.5"
                >
                  <span>Reward</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {topAchievers.map((st, i) => {
                const isGold = i === 0;
                const isSilver = i === 1;
                
                const rankBadgeClass = isGold 
                  ? 'bg-amber-500 text-white border-amber-400' 
                  : isSilver 
                    ? 'bg-zinc-400 text-white border-zinc-300' 
                    : 'bg-amber-700 text-white border-amber-800';
                
                const ringStyle = isGold
                  ? 'ring-2 ring-amber-400 ring-offset-2'
                  : isSilver
                    ? 'ring-2 ring-zinc-300 ring-offset-2'
                    : 'ring-1 ring-zinc-200';

                return (
                  <motion.div
                    key={st.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center justify-between p-3 px-4 rounded-xl border border-zinc-100 hover:border-zinc-200/80 hover:bg-zinc-50/50 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img 
                          src={st.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuAtw2WtZ_69Sh-L3Y_kFCAcVW6AzYLBdDpO9PBsf-w6VXo09FR8XwFmP07mT_e3h1ahGe6OQsC2AoJOHlJ0rNzSihjl98Bihusu45prxtkwt6trIzNL0UhzOEg06b8d0Jrx-hK1Ta5zeyxx_BWseQkMcL6ycuFkUppK6bK0QBdPnH2p2j1wzYR411EIM_C8c1Np4AvORTIz0jftVBUBU-G4m_nqluJ2zSXm6rG8BaDEYp_CrVQ2KRBesmlNd_xfSLKcl2BAp88KF2I"} 
                          alt={st.name} 
                          className={`w-11 h-11 rounded-full object-cover ${ringStyle} shadow-sm`}
                          referrerPolicy="no-referrer"
                        />
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold ${rankBadgeClass}`}>
                          {i + 1}
                        </div>
                      </div>

                      <div className="space-y-0.5">
                        <h4 className="font-extrabold text-sm text-zinc-850">{st.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold text-zinc-400">
                            Seat {st.seatId || 'N/A'}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-zinc-300" />
                          <span className="text-[11px] font-bold text-zinc-500 px-1.5 py-0.2 bg-zinc-100 rounded">
                            Grade: {st.grade}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="font-black text-sm text-amber-600 block flex items-center gap-0.5 justify-end">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          {st.stars}
                        </span>
                        <span className={`text-[9px] font-bold uppercase tracking-wide inline-block px-1.5 py-0.5 rounded mt-0.5 ${
                          st.status === 'Present' || st.status === 'Participating'
                            ? 'bg-emerald-50 text-emerald-800'
                            : st.status === 'Late'
                              ? 'bg-amber-55 text-amber-800'
                              : 'bg-zinc-100 text-zinc-600'
                        }`}>
                          {st.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {students.length === 0 && (
                <div className="text-center py-8 text-zinc-400 font-medium text-xs">
                  No classroom roster configured yet.
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={() => onNavigateToTab('reports')}
            className="w-full mt-6 py-2.5 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 hover:text-zinc-800 rounded-xl font-bold text-xs border border-zinc-200/50 transition-all"
          >
            Open Analytics & Reports
          </button>
        </div>

        {/* Right Side: Timeline of Instruction Activities */}
        <div className="lg:col-span-2 bg-white border border-zinc-200/50 p-6 rounded-2xl flex flex-col justify-between shadow-sm premium-shadow">
          <div>
            <div className="flex justify-between items-center mb-6 border-b border-zinc-100 pb-4">
              <h3 className="font-extrabold text-base text-zinc-800 flex items-center gap-2.5">
                <Activity className="w-5 h-5 text-emerald-600" />
                <span>Class Classroom Diary Feed</span>
              </h3>
              <button 
                onClick={() => onNavigateToTab('student-portal')}
                className="p-1 text-zinc-400 hover:text-emerald-700 transition-colors"
                title="View All Class Posts"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="relative pl-1 space-y-4">
              {/* Central vertical timeline divider */}
              <div className="absolute left-1.5 top-1 bottom-1 w-0.5 bg-zinc-100" />

              {diaryPosts.slice(0, 3).map((post, index) => (
                <div key={post.id} className="relative pl-6 space-y-1 group">
                  {/* Timeline bullet indicator */}
                  <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-emerald-600 border-2 border-white shadow-sm group-hover:bg-amber-500 transition-colors" />
                  
                  <div className="bg-zinc-50/50 group-hover:bg-zinc-50 p-3.5 border border-zinc-100 rounded-xl hover:shadow-xs transition-all duration-200">
                    <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400 tracking-wider uppercase">
                      <span>{post.subject}</span>
                      <span>{post.date}</span>
                    </div>

                    <h4 className="text-xs font-bold text-zinc-800 mt-1.5 tracking-tight group-hover:text-[#006b47] transition-colors">
                      {post.title}
                    </h4>
                    
                    <p className="text-[11px] text-zinc-500 leading-relaxed line-clamp-2 mt-1">
                      {post.content}
                    </p>
                    
                    {post.homework && post.homework.length > 0 && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 px-2 py-0.5 bg-amber-50 rounded-full mt-2">
                        <Bookmark className="w-3 h-3 text-amber-600" />
                        <span>{post.homework.length} Homework Tasks</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {diaryPosts.length === 0 && (
                <div className="text-center py-10 text-zinc-400 font-medium text-xs">
                  No notes or journals recorded.
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={() => onNavigateToTab('student-portal')}
            className="w-full mt-6 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl font-bold text-xs transition-all"
          >
            Launch Class Diary & Homework
          </button>
        </div>
      </section>

      {/* Goal configuration Popup Modal */}
      <AnimatePresence>
        {showGoalModal && (
          <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-white max-w-md w-full rounded-2xl p-6 border border-zinc-200 shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-2 text-zinc-800">
                <Target className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-lg">Classroom Milestone Goal</h3>
              </div>

              <p className="text-xs text-zinc-500 leading-relaxed">
                Set an active milestone or target for all students in the Homeroom. This status is prominently displayed to instructors and students in their respective portals!
              </p>

              <textarea
                value={tempGoal}
                onChange={(e) => setTempGoal(e.target.value)}
                maxLength={120}
                rows={3}
                className="w-full p-3 bg-zinc-50 border border-zinc-200 focus:border-emerald-600 text-zinc-800 placeholder:text-zinc-300 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600 transition-all font-medium"
                placeholder="E.g. Read 50 books collectively by Friday."
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowGoalModal(false)}
                  className="px-4 py-2 border border-zinc-200 hover:bg-zinc-50 rounded-xl text-xs font-bold text-zinc-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveGoal}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                >
                  Apply Goal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Student Enrollment Popup Modal */}
      <AnimatePresence>
        {showAddStudentModal && (
          <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-white max-w-sm w-full rounded-2xl p-6 border border-zinc-200 shadow-2xl space-y-5 relative text-left text-zinc-805"
            >
              <div className="flex items-center gap-3 border-b border-zinc-100 pb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-750 flex items-center justify-center font-bold text-lg shadow-inner">
                  ➕
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-zinc-800 tracking-tight">{t('addStudentModalTitle')}</h3>
                  <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">{lang === 'en' ? 'School Registry' : 'Đồng bộ Học bạ'}</p>
                </div>
              </div>

              {modalError && (
                <div className="bg-rose-50 border border-rose-100/60 text-rose-700 px-3 py-2 rounded-xl text-xs font-bold leading-relaxed">
                  ⚠️ {modalError}
                </div>
              )}

              <div className="space-y-3.5">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">
                    {lang === 'en' ? 'STUDENT FULL NAME' : 'HỌ VÀ TÊN HỌC SINH'}
                  </label>
                  <input
                    type="text"
                    value={newStudentName}
                    onChange={(e) => {
                      setNewStudentName(e.target.value);
                      setModalError(null);
                    }}
                    placeholder={t('studentNamePlaceholder')}
                    className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 focus:border-emerald-600 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600 transition-all font-medium text-zinc-850"
                    autoFocus
                  />
                </div>

                {/* School Classroom Selection Selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">
                    {lang === 'en' ? 'ASSIGN TO CLASSROOM' : 'ĐĂNG KÝ VÀO LỚP HỌC'}
                  </label>
                  <select
                    value={addStudentClass}
                    onChange={(e) => setAddStudentClass(e.target.value)}
                    className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 focus:border-emerald-600 rounded-xl text-xs font-bold text-zinc-800 focus:outline-none transition-all cursor-pointer"
                  >
                    {['Period 3: Biology', 'Advanced Physics 301', 'Starfish 1A'].map((clsName) => (
                      <option key={clsName} value={clsName}>
                        {clsName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Initial Grade & Starting Stars */}
                <div className="grid grid-cols-2 gap-35">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">
                      {lang === 'en' ? 'INITIAL GRADE %' : 'ĐIỂM SỐ BAN ĐẦU %'}
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={newStudentGrade}
                      onChange={(e) => setNewStudentGrade(Math.min(100, Math.max(0, parseInt(e.target.value, 10) || 0)))}
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 focus:border-emerald-600 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600 transition-all font-mono font-bold text-zinc-850"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">
                      {lang === 'en' ? 'STARTING STARS' : 'SỐ SAO KHỞI ĐẦU'}
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={1000}
                      value={newStudentStars}
                      onChange={(e) => setNewStudentStars(Math.max(0, parseInt(e.target.value, 10) || 0))}
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 focus:border-emerald-600 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600 transition-all font-mono font-bold text-zinc-850"
                    />
                  </div>
                </div>

                {/* Avatar select */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">
                    {t('avatarSelectLabel')}
                  </label>
                  <div className="grid grid-cols-6 gap-1.5 p-2 bg-zinc-50 rounded-xl border border-zinc-150 max-h-[85px] overflow-y-auto">
                    {['👩‍🎓', '👨‍🎓', '🦁', '🦉', '🦊', '🐼', '🎨', '🚀', '🎸', '⚽', '🦄', '🐳', '🍀', '🍎', '🧩', '🧸', '🌟', '💖'].map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setNewStudentAvatar(emoji)}
                        className={`w-8 h-8 text-base rounded-lg flex items-center justify-center transition-all ${
                          newStudentAvatar === emoji
                            ? 'bg-emerald-600 text-white scale-105 shadow-sm'
                            : 'bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200/80'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-zinc-100">
                <button
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-3.5 py-1.5 border border-zinc-200 hover:bg-zinc-50 rounded-xl text-xs font-bold text-zinc-500 transition-colors"
                >
                  {lang === 'en' ? 'Cancel' : 'Hủy bỏ'}
                </button>
                <button
                  onClick={async () => {
                    if (!newStudentName.trim()) {
                      setModalError(t('errorNameRequired'));
                      return;
                    }
                    if (onAddStudent) {
                      await onAddStudent({
                        name: newStudentName.trim(),
                        grade: newStudentGrade,
                        stars: newStudentStars,
                        avatar: newStudentAvatar,
                        classId: addStudentClass
                      });
                    }
                    setShowAddStudentModal(false);
                  }}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                >
                  {t('saveBtn')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
