/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Student, RewardItem, Invoice, DiaryPost, StudentStatus } from './types';
import { Language, translations } from './translations';
import {
  initialStudents,
  initialRewards,
  initialInvoices,
  initialDiaryPosts,
} from './data/mockData';
import ClassroomLayout from './components/ClassroomLayout';
import AttendanceManager from './components/AttendanceManager';
import ReportsAnalytics from './components/ReportsAnalytics';
import StudentPortal from './components/StudentPortal';
import TuitionTracker from './components/TuitionTracker';
import RewardStore from './components/RewardStore';
import ClassOverview from './components/ClassOverview';
import {
  auth,
  signInWithGoogle,
  logoutUser,
  db,
} from './firebase';
import {
  bootstrapDatabaseIfEmpty,
  subscribeToStudents,
  subscribeToRewards,
  subscribeToInvoices,
  subscribeToDiaryPosts,
  updateStudentFields,
  purchaseRewardStoreItem,
  updateDiaryPostHomework,
} from './dbService';
import { doc, setDoc, getDocFromServer } from 'firebase/firestore';
import {
  LayoutDashboard,
  CalendarCheck,
  TrendingDown,
  Gift,
  Coins,
  ChevronDown,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  User,
  GraduationCap,
  MessageSquare,
  Search,
  BookOpen,
  Database,
  RefreshCw,
  ArrowRight,
  Lock,
  X,
  Check,
  LogIn,
} from 'lucide-react';

export default function App() {
  // Real-time Database state with high-fidelity local memory fallbacks
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [rewards, setRewards] = useState<RewardItem[]>(initialRewards);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [diaryPosts, setDiaryPosts] = useState<DiaryPost[]>(initialDiaryPosts);

  // Custom states dedicated to Ms Nhung / Cô Nhung's Classroom
  const [loveHearts, setLoveHearts] = useState<number>(() => {
    const saved = localStorage.getItem('nhung_love_hearts');
    return saved ? parseInt(saved, 10) : 128;
  });

  const [nhungMemo, setNhungMemo] = useState<string>(() => {
    const saved = localStorage.getItem('nhung_memo_text');
    return saved || 'Hãy luôn tự tin vào bản thân và nỗ lực hết mình các con nhé. Mỗi ngày đến lớp là một ngày chúng ta cùng nhau học tập và tỏa sáng! 🌟💖';
  });

  const handleUpdateMemo = (newMemo: string) => {
    setNhungMemo(newMemo);
    localStorage.setItem('nhung_memo_text', newMemo);
  };

  const handleAddHeart = () => {
    const updated = loveHearts + 1;
    setLoveHearts(updated);
    localStorage.setItem('nhung_love_hearts', updated.toString());
  };

  // Authentication State
  const [user, setUser] = useState<any | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Security Verification controls
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [isPinUnlocked, setIsPinUnlocked] = useState(() => {
    return localStorage.getItem('edupulse_teacher_unlocked') === 'true';
  });

  const TEACHER_EMAILS = [
    'mason.nguyen@academica.edu',
    'teacher@example.com',
    'masonnguyenmm@gmail.com',
    'nhung.co@edupulse.edu.vn',
    'conhung@gmail.com',
    'nhungclassroom@gmail.com',
    'nhung@edupulse.edu.vn'
  ];

  const isTeacherUser = !!(user && user.email && TEACHER_EMAILS.includes(user.email));

  // Active navigation logs
  const [activeTab, setActiveTab] = useState<'overview' | 'dashboard' | 'attendance' | 'reports' | 'rewards' | 'student-portal' | 'tuition'>('overview');
  
  // Persistent separation of student/instructor portals
  const [role, setRoleState] = useState<'instructor' | 'student' | null>(() => {
    const saved = localStorage.getItem('edupulse_role');
    return (saved === 'instructor' || saved === 'student') ? saved : null;
  });

  const setRole = (newRole: 'instructor' | 'student' | null) => {
    setRoleState(newRole);
    if (newRole) {
      localStorage.setItem('edupulse_role', newRole);
    } else {
      localStorage.removeItem('edupulse_role');
      localStorage.removeItem('edupulse_teacher_unlocked');
      setIsPinUnlocked(false);
    }
  };

  // Persistent language choice (English & Vietnamese), defaulting to Vietnamese (vi)
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('edupulse_lang');
    return (saved === 'en' || saved === 'vi') ? saved : 'vi';
  });

  const toggleLanguage = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('edupulse_lang', newLang);
  };

  const t = (key: keyof typeof translations['en']) => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  const [selectedClass, setSelectedClass] = useState('Period 3: Biology');
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Core real-time database listener channels (no-flicker startup)
  useEffect(() => {
    // Subscribe to collections with realtime synchronization listeners
    const unsubStudents = subscribeToStudents((data) => {
      if (data && data.length > 0) {
        // Sort database list so layout renders deterministically
        const sorted = [...data].sort((a, b) => a.id.localeCompare(b.id));
        setStudents(sorted);
      }
    });

    const unsubRewards = subscribeToRewards((data) => {
      if (data && data.length > 0) {
        setRewards(data);
      }
    });

    const unsubInvoices = subscribeToInvoices((data) => {
      if (data && data.length > 0) {
        // Format invoice identifiers back to human-legible if modified
        const mapped = data.map(inv => ({
          ...inv,
          id: inv.id.replace('INV_', '#'),
        }));
        setInvoices(mapped);
      }
    });

    const unsubDiary = subscribeToDiaryPosts((data) => {
      if (data && data.length > 0) {
        setDiaryPosts(data);
      }
    });

    return () => {
      unsubStudents();
      unsubRewards();
      unsubInvoices();
      unsubDiary();
    };
  }, []);

  // 2. Authentication observer state machine + Admin Bootstrapper Trigger
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      setIsInitializing(false);

      if (currentUser) {
        // Automatically check/provision a real validated Student profile for testing owner purchases!
        try {
          const studentRef = doc(db, 'students', currentUser.uid);
          const studentSnap = await getDocFromServer(studentRef);
          if (!studentSnap.exists()) {
            await setDoc(studentRef, {
              id: currentUser.uid,
              name: currentUser.displayName || 'EduPulse Explorer',
              avatar: currentUser.photoURL || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtw2WtZ_69Sh-L3Y_kFCAcVW6AzYLBdDpO9PBsf-w6VXo09FR8XwFmP07mT_e3h1ahGe6OQsC2AoJOHlJ0rNzSihjl98Bihusu45prxtkwt6trIzNL0UhzOEg06b8d0Jrx-hK1Ta5zeyxx_BWseQkMcL6ycuFkUppK6bK0QBdPnH2p2j1wzYR411EIM_C8c1Np4AvORTIz0jftVBUBU-G4m_nqluJ2zSXm6rG8BaDEYp_CrVQ2KRBesmlNd_xfSLKcl2BAp88KF2I',
              grade: 92,
              stars: 150, // startup star gift to immediately spend in Reward Store!
              status: 'Present',
              isPresent: true,
              seatId: 'G1'
            });
            console.log('[Firebase Auth Observer]: Synced real-time Student profile:', currentUser.uid);
          }
        } catch (error) {
          console.warn('[Firebase Registration Profile failed]: Expected if user is not in students write flow yet.');
        }

        // Safe Admin-only Bootstrapping check
        const isAdminEmail = currentUser.email && ['mason.nguyen@academica.edu', 'teacher@example.com', 'masonnguyenmm@gmail.com'].includes(currentUser.email);
        if (isAdminEmail) {
          console.log('[Firebase Auth Observer]: Admin detected. Running dynamic bootstrapping if empty...');
          try {
            await bootstrapDatabaseIfEmpty();
          } catch (boostrapErr) {
            console.error('[Firebase Auth Observer]: Bootstrapping empty collections failed:', boostrapErr);
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Find representational student: logged-in user profile, fallback to Leo Mercer ('9'), or fallback first student
  const currentStudent = (user && students.find((s) => s.id === user.uid)) ||
                         students.find((s) => s.id === '9') ||
                         students[0] || {
                           id: 'none',
                           name: 'Offline Student',
                           avatar: '',
                           grade: 100,
                           stars: 0,
                           status: 'Present',
                           isPresent: true,
                         };

  // Global triggers mapped directly to real-time Firestore mutations
  const handleAwardStars = async (studentId: string, count: number) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;
    try {
      await updateStudentFields(studentId, { stars: Math.max(0, student.stars + count) });
    } catch (e) {
      console.error('Error awarding stars in database:', e);
    }
  };

  const handleLevelAllStars = async (count: number) => {
    try {
      for (const student of students) {
        await updateStudentFields(student.id, { stars: student.stars + count });
      }
    } catch (e) {
      console.error('Error leveling up classroom stars:', e);
    }
  };

  const handleUpdateStatus = async (studentId: string, status: StudentStatus) => {
    try {
      await updateStudentFields(studentId, {
        status,
        isPresent: status !== 'Absent',
      });
    } catch (e) {
      console.error('Error updating status in database:', e);
    }
  };

  // Star purchase deduction - uses strict secure self-decrementing update
  const handlePurchaseReward = async (cost: number, rewardTitle: string) => {
    if (!currentStudent || currentStudent.id === 'none') {
      alert('Please log in with Google to perform secure purchases in the reward store!');
      return;
    }
    try {
      await purchaseRewardStoreItem(currentStudent.id, cost, currentStudent.stars);
    } catch (e) {
      console.error('Star purchase decrement rejected:', e);
      alert('Purchase failed. Check console trace or permission privileges.');
    }
  };

  // Toggle tasks in student view
  const handleToggleTask = async (postId: string, taskId: string) => {
    const post = diaryPosts.find((p) => p.id === postId);
    if (!post) return;
    try {
      const updatedHomework = post.homework.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );
      await updateDiaryPostHomework(postId, updatedHomework);
    } catch (e) {
      console.error('Error toggling task completion state:', e);
    }
  };

  const handleEnterInstructorPortal = () => {
    // 1. If user is a verified teacher via Google Oauth automatically let them in
    if (isTeacherUser) {
      setRole('instructor');
      setActiveTab('overview');
      return;
    }

    // 2. Otherwise request PIN authentication or Teacher login
    setPinInput('');
    setPinError(null);
    setShowVerifyModal(true);
  };

  const handleVerifyPin = () => {
    if (pinInput === '2026' || pinInput.toLowerCase() === 'nhungteacher') {
      localStorage.setItem('edupulse_teacher_unlocked', 'true');
      setIsPinUnlocked(true);
      setRole('instructor');
      setActiveTab('overview');
      setShowVerifyModal(false);
      setPinError(null);
    } else {
      setPinError(t('invalidPin'));
    }
  };

  if (role === null) {
    return (
      <div className="min-h-screen w-screen bg-zinc-950 flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
        {/* Floating Language Switcher */}
        <div className="absolute top-6 right-6 z-50 flex items-center gap-2 select-none">
          <button
            onClick={() => toggleLanguage('vi')}
            className={`px-3 py-1.5 rounded-full text-xs font-black transition-all border flex items-center gap-1.5 ${
              lang === 'vi'
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                : 'bg-zinc-900/60 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'
            }`}
          >
            <span className="text-sm">🇻🇳</span>
            <span>VIỆT</span>
          </button>
          <button
            onClick={() => toggleLanguage('en')}
            className={`px-3 py-1.5 rounded-full text-xs font-black transition-all border flex items-center gap-1.5 ${
              lang === 'en'
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                : 'bg-zinc-900/60 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'
            }`}
          >
            <span className="text-sm">🇺🇸</span>
            <span>ENG</span>
          </button>
        </div>

        {/* Decorative premium aura lights */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_0.7px,transparent_0.7px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        {/* Gateway Card */}
        <div className="max-w-4xl w-full text-center space-y-12 z-10">
          {/* Brand identity */}
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-emerald-650/15 border border-emerald-500/25 flex items-center justify-center shadow-xl">
                <GraduationCap className="w-9 h-9 text-emerald-400 font-black" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                EduPulse <span className="text-emerald-400 font-extrabold text-[#006b47]">{lang === 'en' ? 'Academica' : 'Học Viện'}</span>
              </h1>
            </div>
            <p className="text-zinc-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              {t('gatewayDesc')}
            </p>
          </div>

          {/* Directory Entry Doors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Instructor Gate Card */}
            <motion.div
              whileHover={{ y: -6, scale: 1.01 }}
              onClick={handleEnterInstructorPortal}
              className="bg-zinc-900/60 border border-zinc-850 hover:border-emerald-500/50 hover:bg-zinc-900/90 rounded-2xl p-8 flex flex-col justify-between text-left cursor-pointer transition-all duration-300 shadow-2xl relative group h-full min-h-[300px]"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/[0.03] rounded-bl-full pointer-events-none group-hover:bg-emerald-500/[0.05] transition-all" />
              <div className="space-y-5">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-all">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {t('facultyPortalTitle')}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {t('facultyPortalDesc')}
                  </p>
                </div>
              </div>
              
              <div className="mt-8 flex items-center gap-2 text-xs font-bold text-emerald-405 group-hover:text-emerald-305 transition-colors">
                <span>{t('facultyPortalBtn')}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>

            {/* Student Gate Card */}
            <motion.div
              whileHover={{ y: -6, scale: 1.01 }}
              onClick={() => {
                setRole('student');
                setActiveTab('student-portal');
              }}
              className="bg-zinc-900/60 border border-zinc-850 hover:border-amber-500/50 hover:bg-zinc-900/90 rounded-2xl p-8 flex flex-col justify-between text-left cursor-pointer transition-all duration-300 shadow-2xl relative group h-full min-h-[300px]"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/[0.02] rounded-bl-full pointer-events-none group-hover:bg-amber-500/[0.04] transition-all" />
              <div className="space-y-5">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 group-hover:bg-amber-500/20 transition-all">
                  <User className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                    {t('studentPortalTitle')}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {t('studentPortalDesc')}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-2 text-xs font-bold text-amber-405 group-hover:text-amber-305 transition-colors">
                <span>{t('studentPortalBtn')}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          </div>

          {/* Footer info/creds */}
          <p className="text-[11px] font-medium text-zinc-600 uppercase tracking-widest pt-4">
            {t('footerInfo')}
          </p>
        </div>
      </div>
    );
  }

  // Strict role security guard intercepting unauthorized desk entries
  if (role === 'instructor' && !isTeacherUser && !isPinUnlocked) {
    return (
      <div className="min-h-screen w-screen bg-zinc-950 flex flex-col items-center justify-center p-6 relative overflow-hidden select-none text-center">
        <div className="absolute inset-0 bg-[radial-gradient(#f43f5e_0.6px,transparent_0.6px)] [background-size:32px_32px] opacity-10 pointer-events-none" />
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-6 shadow-2xl relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-500 mb-2">
            <Lock className="w-8 h-8 animate-bounce" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white tracking-tight">
              {t('accessDeniedTitle')}
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {t('accessDeniedDesc')}
            </p>
          </div>

          <div className="space-y-3 pt-4">
            <button
              onClick={() => {
                setRole('student');
                setActiveTab('student-portal');
              }}
              className="w-full py-3 bg-zinc-800 hover:bg-zinc-750 text-white font-bold rounded-xl text-xs transition-all active:scale-[0.98]"
            >
              {t('studentPortalBtn')}
            </button>
            <button
              onClick={() => {
                setRole(null);
              }}
              className="w-full py-3 border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white font-bold rounded-xl text-xs transition-all"
            >
              {t('changePortal')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background font-sans antialiased text-on-background">
      {/* Dynamic Role & Notification quick toast if needed */}
      
      {/* SideNavBar - Premium frosted container */}
      <aside className="hidden md:flex h-full w-80 shrink-0 flex-col py-lg px-6 bg-surface/75 border-r border-outline-variant/15 glass-panel-accent z-40 shadow-xl justify-between">
        <div className="space-y-md">
          {/* Header context school identity */}
          <div className="flex items-center gap-4 mb-4 select-none">
            <div className="w-12 h-12 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xl overflow-hidden shadow-sm">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7z5JIdEfiaIE7TJcD1rmWvqrhbT5Mmui1c98RAFZ1pDdGekQggbsdPHgyVPsRWPzaWHOuFKbM-KS1tz_84zr2WTCr0CSrAovalu3qKboQB7LZTUM2kWuYyBZRb9GFqzT0QN_4wH8swT_Ge4t35U2CCBZwwWeLFN0R-CoLno54xLuwqA4Pxglk1UShgy8ubp3pq7xK5dd2BUejEYhVvhBpCWz0IuTne2Z5FI61mlLzOrTq2SgXHogrRA-NCVnlcTWdyGw2DZcA80Q"
                alt="School crest"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-primary leading-tight">Academica High</h1>
              <p className="text-[10px] font-black uppercase tracking-wider text-emerald-700 mt-0.5 animate-fade-in">
                {role === 'instructor' ? t('facultyPortalTitle') : t('studentPortalTitle')}
              </p>
            </div>
          </div>

          {/* Active Dedicated Role Indicator */}
          {role === 'instructor' ? (
            <div className="bg-emerald-50 text-[#006b47] border border-emerald-100/70 px-4 py-2.5 rounded-xl font-bold text-xs select-none flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#006b47]" />
              <span>{t('facultyMode')}</span>
            </div>
          ) : (
            <div className="bg-amber-50 text-amber-800 border border-amber-100 px-4 py-2.5 rounded-xl font-bold text-xs select-none flex items-center gap-2 animate-fade-in">
              <User className="w-4 h-4 text-amber-500" />
              <span>{t('studentMode')}</span>
            </div>
          )}

          {/* Launch live class prompt */}
          <div className="pt-2">
            <button className="w-full bg-secondary-container hover:-translate-y-0.5 text-on-secondary-container rounded-lg py-3 font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2">
              <MessageSquare className="w-4 h-4 fill-on-secondary-container" />
              <span>{t('liveChatBtn')}</span>
            </button>
          </div>

          {/* Segment Navigation lists based on active Roles */}
          <nav className="space-y-1.5 pt-4">
            {role === 'instructor' ? (
              <>
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm transition-all ${
                    activeTab === 'overview'
                      ? 'bg-primary/10 text-primary font-bold border-l-4 border-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-primary hover:bg-surface-variant/40'
                  }`}
                >
                  <LayoutDashboard className="w-[18px] h-[18px]" />
                  <span>{t('tabDashboard')}</span>
                </button>

                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm transition-all ${
                    activeTab === 'dashboard'
                      ? 'bg-primary/10 text-primary font-bold border-l-4 border-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-primary hover:bg-surface-variant/40'
                  }`}
                >
                  <GraduationCap className="w-[18px] h-[18px]" />
                  <span>{t('tabSeating')}</span>
                </button>

                <button
                  onClick={() => setActiveTab('attendance')}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm transition-all ${
                    activeTab === 'attendance'
                      ? 'bg-primary/10 text-primary font-bold border-l-4 border-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-primary hover:bg-surface-variant/40'
                  }`}
                >
                  <CalendarCheck className="w-[18px] h-[18px]" />
                  <span>{t('tabAttendance')}</span>
                </button>

                <button
                  onClick={() => setActiveTab('reports')}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm transition-all ${
                    activeTab === 'reports'
                      ? 'bg-primary/10 text-primary font-bold border-l-4 border-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-primary hover:bg-surface-variant/40'
                  }`}
                >
                  <TrendingDown className="w-[18px] h-[18px]" />
                  <span>{t('tabReports')}</span>
                </button>

                <button
                  onClick={() => setActiveTab('rewards')}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm transition-all ${
                    activeTab === 'rewards'
                      ? 'bg-primary/10 text-primary font-bold border-l-4 border-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-primary hover:bg-surface-variant/40'
                  }`}
                >
                  <Gift className="w-[18px] h-[18px]" />
                  <span>{t('tabRewardStore')}</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveTab('student-portal')}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm transition-all ${
                    activeTab === 'student-portal'
                      ? 'bg-primary/10 text-primary font-bold border-l-4 border-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-primary hover:bg-surface-variant/40'
                  }`}
                >
                  <User className="w-[18px] h-[18px]" />
                  <span>{t('tabStudentDiary')}</span>
                </button>

                <button
                  onClick={() => setActiveTab('tuition')}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm transition-all ${
                    activeTab === 'tuition'
                      ? 'bg-primary/10 text-primary font-bold border-l-4 border-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-primary hover:bg-surface-variant/40'
                  }`}
                >
                  <Coins className="w-[18px] h-[18px]" />
                  <span>{t('tabTuition')}</span>
                </button>

                <button
                  onClick={() => setActiveTab('rewards')}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm transition-all ${
                    activeTab === 'rewards'
                      ? 'bg-primary/10 text-primary font-bold border-l-4 border-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-primary hover:bg-surface-variant/40'
                  }`}
                >
                  <Gift className="w-[18px] h-[18px]" />
                  <span>{t('tabBrowseRewards')}</span>
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Footer Support widgets */}
        <div className="space-y-2 border-t border-outline-variant/20 pt-4">
          <button
            onClick={() => setRole(null)}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-500 hover:text-rose-600 hover:bg-rose-50 border border-dashed border-zinc-200 hover:border-rose-200 transition-all select-none"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t('changePortal')}</span>
          </button>
          <a
            href="#support"
            className="flex items-center gap-4 px-4 py-2 rounded-lg text-xs text-on-surface-variant hover:text-primary transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>{t('customizeWorkspace')}</span>
          </a>
          <a
            href="#support"
            className="flex items-center gap-4 px-4 py-2 rounded-lg text-xs text-on-surface-variant hover:text-primary transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            <span>{t('helpDesk')}</span>
          </a>
        </div>
      </aside>

      {/* Main viewport canvas */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top bar header */}
        <header className="h-20 w-full bg-surface/80 backdrop-blur-xl border-b border-outline-variant/15 shadow-sm px-margin-mobile md:px-margin-desktop shrink-0 flex items-center justify-between z-30">
          <div className="flex items-center gap-4">
            <span className="text-xl font-black text-primary md:hidden">EduPulse</span>
            {role && (
              <button 
                onClick={() => setRole(null)}
                className="md:hidden p-1.5 bg-rose-50 hover:bg-rose-100/90 text-rose-650 rounded-lg text-[10.5px] font-black leading-none border border-rose-100 flex items-center gap-1.5 select-none"
                title={t('changePortal')}
              >
                <LogOut className="w-3 h-3 text-rose-505" />
                <span>{t('exitHub')}</span>
              </button>
            )}

            {/* Selector box with animated dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowClassDropdown(!showClassDropdown)}
                className="flex items-center gap-2 px-3.5 py-1.5 bg-surface-container-high/60 hover:bg-surface-container-high rounded-full text-xs font-bold text-on-surface shadow-sm border border-outline-variant/20 active:scale-95 transition-all"
              >
                <span>{selectedClass}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-on-surface-variant transition-transform duration-200 ${showClassDropdown ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showClassDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowClassDropdown(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-0 mt-2 w-48 bg-surface border border-outline-variant/20 rounded-lg shadow-xl z-50 p-1 pointer-events-auto"
                    >
                      {['Period 3: Biology', 'Advanced Physics 301', 'Starfish 1A'].map((clsName) => (
                        <button
                          key={clsName}
                          onClick={() => {
                            setSelectedClass(clsName);
                            setShowClassDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs font-semibold rounded hover:bg-surface-container-high transition-colors ${
                            selectedClass === clsName ? 'text-primary bg-primary/10' : 'text-on-surface'
                          }`}
                        >
                          {clsName}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-md">
            {/* Compact language switcher toggle bar */}
            <div className="flex items-center gap-1 bg-surface-container-high/60 border border-outline-variant/15 rounded-full p-0.5 shadow-sm select-none">
              <button
                onClick={() => toggleLanguage('vi')}
                className={`px-2 py-1 text-[10px] font-black rounded-full transition-all flex items-center gap-1 ${
                  lang === 'vi'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                title={t('vietnam')}
              >
                <span>🇻🇳</span>
                <span className="hidden sm:inline">VI</span>
              </button>
              <button
                onClick={() => toggleLanguage('en')}
                className={`px-2 py-1 text-[10px] font-black rounded-full transition-all flex items-center gap-1 ${
                  lang === 'en'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                title={t('english')}
              >
                <span>🇺🇸</span>
                <span className="hidden sm:inline">EN</span>
              </button>
            </div>

            {/* Force Cloud Database Seeding trigger */}
            {user && ['mason.nguyen@academica.edu', 'teacher@example.com', 'masonnguyenmm@gmail.com'].includes(user.email || '') && (
              <button
                onClick={async () => {
                  try {
                    await bootstrapDatabaseIfEmpty();
                    alert(lang === 'en' ? 'Successfully synchronized your classroom databases with Google Cloud Firestore! Please refetch/refresh your Firestore Console to view the instantiated collections.' : 'Đồng bộ hóa các bảng lớp học thành công với Google Cloud Firestore! Vui lòng tải lại trang Firestore Console để xem các tập hợp mới khởi tạo.');
                  } catch (e) {
                    alert('Seed failed. You might lack permissions or require a sign-in refresh: ' + (e as Error).message);
                  }
                }}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-secondary-container hover:bg-secondary-container/95 text-on-secondary-container rounded-full text-xs font-black shadow-md transition-all active:scale-95 hover:-translate-y-0.5"
                title="Synchronize Firestore cloud tables"
              >
                <Database className="w-3.5 h-3.5 animate-pulse" />
                <span>{t('publishSync')}</span>
              </button>
            )}

            {/* Quick global notifications bell */}
            <button className="relative w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-secondary-container rounded-full border border-white" />
            </button>

            {/* Profile Avatar with dynamic Google Auth */}
            {user ? (
              <div className="flex items-center gap-3 border-l border-outline-variant/20 pl-4">
                <img
                  src={user.photoURL || "https://lh3.googleusercontent.com/aida-public/AB6AXuDp2GOibOSy34eQx3HKP4XE61XTCZTqeS7NvYv5HqgV4UGZmtdpQhs674JOaX4zxM5KHCmnmejODmvRdrpyLa-eSrcVtme__wlYYk-0DLLyids6Pa38OxyQ9nZFKW_sojWLEPG6QfPBjqwSmPHj70DMHm8Z2wzI6b9xQWbgT-d39TZg8CTF0HKfBgZJHiP5O0Y4iKZTa0-WtvmZaeAkMYIF00g-B_FVTLOZ6ap0k1eappLxHyXnNPc4fIIRHhtDqqF5TAS5tbtQki8"}
                  alt={user.displayName || 'Authorized User'}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-outline-variant/20 cursor-pointer hover:opacity-80 transition-opacity"
                  title="Click to Sign Out"
                  onClick={() => {
                    if (window.confirm(lang === 'en' ? 'Would you like to sign out of EduPulse?' : 'Bạn có muốn đăng xuất khỏi hệ thống EduPulse không?')) {
                      logoutUser();
                    }
                  }}
                />
                <div className="hidden lg:block">
                  <p className="text-xs font-extrabold text-on-surface leading-none">{user.displayName || 'EduPulse User'}</p>
                  <button
                    onClick={() => logoutUser()}
                    className="text-[9px] font-bold text-primary hover:underline mt-0.5 uppercase tracking-wide text-left block"
                  >
                    {t('disconnect')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 border-l border-outline-variant/20 pl-4">
                <button
                  onClick={() => signInWithGoogle()}
                  className="px-4 py-1.5 bg-primary hover:bg-primary/90 text-on-primary rounded-full text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{t('googleLogin')}</span>
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content canvas - Scrollable with animation layout wrappers */}
        <main className="flex-1 overflow-y-auto p-margin-mobile md:p-margin-desktop max-w-[1440px] w-full mx-auto relative select-text pb-28 md:pb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${role}-${activeTab}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="w-full h-full"
            >
              {/* Conditional view routers */}
              {activeTab === 'overview' && (
                <ClassOverview
                  students={students}
                  diaryPosts={diaryPosts}
                  onNavigateToTab={(tabName) => {
                    if (tabName === 'student-portal' || tabName === 'tuition') {
                      setRole('student');
                    } else {
                      setRole('instructor');
                    }
                    setActiveTab(tabName);
                  }}
                  userEmail={user?.email}
                  lang={lang}
                  nhungMemo={nhungMemo}
                  onUpdateMemo={handleUpdateMemo}
                  loveHearts={loveHearts}
                  onAddHeart={handleAddHeart}
                />
              )}

              {activeTab === 'dashboard' && role === 'instructor' && (
                <ClassroomLayout
                  students={students}
                  onAwardStars={handleAwardStars}
                  onAwardAll={handleLevelAllStars}
                />
              )}

              {activeTab === 'attendance' && role === 'instructor' && (
                <AttendanceManager
                  students={students}
                  onUpdateStatus={handleUpdateStatus}
                  lang={lang}
                />
              )}

              {activeTab === 'reports' && role === 'instructor' && (
                <ReportsAnalytics
                  students={students}
                />
              )}

              {activeTab === 'rewards' && (
                <RewardStore
                  students={students}
                  rewards={rewards}
                  studentWallet={currentStudent}
                  onPurchaseReward={handlePurchaseReward}
                />
              )}

              {activeTab === 'student-portal' && role === 'student' && (
                <StudentPortal
                  student={currentStudent}
                  diaryPosts={diaryPosts}
                  onToggleTask={handleToggleTask}
                  onNavigateToStore={() => setActiveTab('rewards')}
                  lang={lang}
                  nhungMemo={nhungMemo}
                  loveHearts={loveHearts}
                  onAddHeart={handleAddHeart}
                />
              )}

              {activeTab === 'tuition' && role === 'student' && (
                <TuitionTracker
                  invoices={invoices}
                  lang={lang}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Floating Bottom Nav for Mobile convenience */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-45 flex justify-around items-center px-4 py-3 pb-safe bg-surface/95 backdrop-blur-lg border-t border-outline-variant/20 shadow-lg rounded-t-lg select-none">
        {role === 'instructor' ? (
          <>
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex flex-col items-center justify-center p-2 text-xs font-bold transition-all ${
                activeTab === 'overview' ? 'text-primary scale-105' : 'text-on-surface-variant'
              }`}
            >
              <LayoutDashboard className="w-[18px] h-[18px] mb-1" />
              <span>Home</span>
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex flex-col items-center justify-center p-2 text-xs font-bold transition-all ${
                activeTab === 'dashboard' ? 'text-primary scale-105' : 'text-on-surface-variant'
              }`}
            >
              <GraduationCap className="w-[18px] h-[18px] mb-1" />
              <span>Seating</span>
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`flex flex-col items-center justify-center p-2 text-xs font-bold transition-all ${
                activeTab === 'attendance' ? 'text-primary scale-105' : 'text-on-surface-variant'
              }`}
            >
              <CalendarCheck className="w-[18px] h-[18px] mb-1" />
              <span>Attendance</span>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`flex flex-col items-center justify-center p-2 text-xs font-bold transition-all ${
                activeTab === 'reports' ? 'text-primary scale-105' : 'text-on-surface-variant'
              }`}
            >
              <TrendingDown className="w-[18px] h-[18px] mb-1" />
              <span>Analytics</span>
            </button>
            <button
              onClick={() => setActiveTab('rewards')}
              className={`flex flex-col items-center justify-center p-2 text-xs font-bold transition-all ${
                activeTab === 'rewards' ? 'text-primary scale-105' : 'text-on-surface-variant'
              }`}
            >
              <Gift className="w-[18px] h-[18px] mb-1" />
              <span>Rewards</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setActiveTab('student-portal')}
              className={`flex flex-col items-center justify-center p-2 text-xs font-bold transition-all ${
                activeTab === 'student-portal' ? 'text-primary scale-105' : 'text-on-surface-variant'
              }`}
            >
              <User className="w-[18px] h-[18px] mb-1" />
              <span>Diary</span>
            </button>
            <button
              onClick={() => setActiveTab('tuition')}
              className={`flex flex-col items-center justify-center p-2 text-xs font-bold transition-all ${
                activeTab === 'tuition' ? 'text-primary scale-105' : 'text-on-surface-variant'
              }`}
            >
              <Coins className="w-[18px] h-[18px] mb-1" />
              <span>Tuition</span>
            </button>
            <button
              onClick={() => setActiveTab('rewards')}
              className={`flex flex-col items-center justify-center p-2 text-xs font-bold transition-all ${
                activeTab === 'rewards' ? 'text-primary scale-105' : 'text-on-surface-variant'
              }`}
            >
              <Gift className="w-[18px] h-[18px] mb-1" />
              <span>Store</span>
            </button>
          </>
        )}
      </nav>

      {/* Premium Verification Modal */}
      <AnimatePresence>
        {showVerifyModal && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-xl z-100 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl relative text-left"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setShowVerifyModal(false);
                  setPinInput('');
                  setPinError(null);
                }}
                className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 transition-colors bg-zinc-800/50 hover:bg-zinc-800 p-1.5 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
                    <Lock className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      {t('teacherVerifyTitle')}
                    </h3>
                    <p className="text-xs text-zinc-400">
                      {t('facultyPortalDesc')}
                    </p>
                  </div>
                </div>

                {pinError && (
                  <div className="bg-rose-500/10 border border-rose-500/20 text-rose-450 p-3.5 rounded-xl text-xs font-semibold leading-relaxed">
                    {pinError}
                  </div>
                )}

                <div className="space-y-2.5">
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                    {t('notLoggedInTeacher')}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={pinInput}
                      onChange={(e) => {
                        setPinInput(e.target.value);
                        setPinError(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleVerifyPin();
                        }
                      }}
                      autoFocus
                      placeholder={t('teacherVerifyInputPlaceholder')}
                      className="flex-1 bg-zinc-950 border border-zinc-805 focus:border-amber-500 focus:outline-none rounded-xl px-4 py-3 text-sm text-white font-mono placeholder-zinc-650"
                    />
                    <button
                      onClick={handleVerifyPin}
                      className="bg-amber-600 hover:bg-amber-700 active:scale-[0.98] transition-all text-white font-bold text-xs px-5 rounded-xl flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>{t('verifyBtn')}</span>
                    </button>
                  </div>
                </div>

                <div className="relative py-2 select-none text-center">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-zinc-800" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-zinc-900 px-3 text-[10px] uppercase font-black tracking-widest text-zinc-600">
                      {t('orLabel')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={async () => {
                    try {
                      const res = await signInWithGoogle();
                      if (res) {
                        const isTeacher = TEACHER_EMAILS.includes(res.email || '');
                        if (isTeacher) {
                          localStorage.setItem('edupulse_teacher_unlocked', 'true');
                          setIsPinUnlocked(true);
                          setRole('instructor');
                          setActiveTab('overview');
                          setShowVerifyModal(false);
                          setPinError(null);
                        } else {
                          // Authenticated but not a registered teacher!
                          setPinError(t('accessDeniedDesc'));
                        }
                      }
                    } catch (err) {
                      console.error('Login error', err);
                    }
                  }}
                  className="w-full py-3 border border-zinc-850 bg-zinc-950 hover:bg-zinc-900 active:scale-[0.98] transition-all rounded-xl text-xs font-bold text-zinc-300 hover:text-white flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4 text-emerald-400" />
                  <span>{t('loginWithTeacherGoogleBtn')}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
