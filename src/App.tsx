/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Student, RewardItem, Invoice, DiaryPost, StudentStatus } from './types';
import ClassroomLayout from './components/ClassroomLayout';
import AttendanceManager from './components/AttendanceManager';
import ReportsAnalytics from './components/ReportsAnalytics';
import StudentPortal from './components/StudentPortal';
import TuitionTracker from './components/TuitionTracker';
import RewardStore from './components/RewardStore';
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
} from 'lucide-react';

export default function App() {
  // Real-time Database state
  const [students, setStudents] = useState<Student[]>([]);
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [diaryPosts, setDiaryPosts] = useState<DiaryPost[]>([]);

  // Authentication State
  const [user, setUser] = useState<any | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Active navigation logs
  const [activeTab, setActiveTab] = useState<'dashboard' | 'attendance' | 'reports' | 'rewards' | 'student-portal' | 'tuition'>('dashboard');
  const [role, setRole] = useState<'instructor' | 'student'>('instructor');
  const [selectedClass, setSelectedClass] = useState('Period 3: Biology');
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Initial database bootstrapping and core real-time database listener channels
  useEffect(() => {
    async function initDb() {
      try {
        await bootstrapDatabaseIfEmpty();
      } catch (e) {
        console.error('Error bootstrapping database on startup:', e);
      }
    }
    initDb();

    // Subscribe to collections with realtime synchronization listeners
    const unsubStudents = subscribeToStudents((data) => {
      // Sort database list so layout renders deterministically
      const sorted = [...data].sort((a, b) => a.id.localeCompare(b.id));
      setStudents(sorted);
    });

    const unsubRewards = subscribeToRewards((data) => {
      setRewards(data);
    });

    const unsubInvoices = subscribeToInvoices((data) => {
      // Format invoice identifiers back to human-legible if modified
      const mapped = data.map(inv => ({
        ...inv,
        id: inv.id.replace('INV_', '#'),
      }));
      setInvoices(mapped);
    });

    const unsubDiary = subscribeToDiaryPosts((data) => {
      setDiaryPosts(data);
    });

    return () => {
      unsubStudents();
      unsubRewards();
      unsubInvoices();
      unsubDiary();
    };
  }, []);

  // 2. Authentication observer state machine
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
          console.warn('[Firebase Registration Profile failed]: This is expected if the user does not have write access yet or offline.');
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

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background font-sans antialiased text-on-background">
      {/* Dynamic Role & Notification quick toast if needed */}
      
      {/* SideNavBar - Premium frosted container */}
      <aside className="hidden md:flex h-full w-80 shrink-0 flex-col py-lg px-6 bg-surface/75 border-r border-outline-variant/15 glass-panel-accent z-40 shadow-xl justify-between">
        <div className="space-y-md">
          {/* Header context school identity */}
          <div className="flex items-center gap-4 mb-4">
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
              <p className="text-[12px] font-semibold text-on-surface-variant/80 tracking-wide">Instructor Portal</p>
            </div>
          </div>

          {/* Core Portal Switcher buttons */}
          <div className="bg-surface-container-high/50 p-1 rounded-full flex gap-1 border border-outline-variant/20 shadow-inner">
            <button
              onClick={() => {
                setRole('instructor');
                setActiveTab('dashboard');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-full transition-all flex items-center justify-center gap-1.5 ${
                role === 'instructor'
                  ? 'bg-primary text-on-primary shadow-md'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Instructor Portal</span>
            </button>
            <button
              onClick={() => {
                setRole('student');
                setActiveTab('student-portal');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-full transition-all flex items-center justify-center gap-1.5 ${
                role === 'student'
                  ? 'bg-primary text-on-primary shadow-md'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Student Portal</span>
            </button>
          </div>

          {/* Launch live class prompt */}
          <div className="pt-2">
            <button className="w-full bg-secondary-container hover:-translate-y-0.5 text-on-secondary-container rounded-lg py-3 font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2">
              <MessageSquare className="w-4 h-4 fill-on-secondary-container" />
              <span>Launch Live Class Chat</span>
            </button>
          </div>

          {/* Segment Navigation lists based on active Roles */}
          <nav className="space-y-1.5 pt-4">
            {role === 'instructor' ? (
              <>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm transition-all ${
                    activeTab === 'dashboard'
                      ? 'bg-primary/10 text-primary font-bold border-l-4 border-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-primary hover:bg-surface-variant/40'
                  }`}
                >
                  <LayoutDashboard className="w-[18px] h-[18px]" />
                  <span>Seating Grid Config</span>
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
                  <span>Mark Attendance</span>
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
                  <span>Reports & Analytics</span>
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
                  <span>Class Reward Store</span>
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
                  <span>My Student Diary</span>
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
                  <span>Tuition & Ledger</span>
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
                  <span>Browse Reward Store</span>
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Footer Support widgets */}
        <div className="space-y-1 border-t border-outline-variant/20 pt-4">
          <a
            href="#support"
            className="flex items-center gap-4 px-4 py-2 rounded-lg text-xs text-on-surface-variant hover:text-primary transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Customize Workspace</span>
          </a>
          <a
            href="#support"
            className="flex items-center gap-4 px-4 py-2 rounded-lg text-xs text-on-surface-variant hover:text-primary transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Help Desk & Support</span>
          </a>
        </div>
      </aside>

      {/* Main viewport canvas */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top bar header */}
        <header className="h-20 w-full bg-surface/80 backdrop-blur-xl border-b border-outline-variant/15 shadow-sm px-margin-mobile md:px-margin-desktop shrink-0 flex items-center justify-between z-30">
          <div className="flex items-center gap-4">
            <span className="text-xl font-black text-primary md:hidden">EduPulse</span>

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
                    if (window.confirm('Would you like to sign out of EduPulse?')) {
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
                    Disconnect
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
                  <span>Google Login</span>
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
                />
              )}

              {activeTab === 'tuition' && role === 'student' && (
                <TuitionTracker
                  invoices={invoices}
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
              onClick={() => setActiveTab('dashboard')}
              className={`flex flex-col items-center justify-center p-2 text-xs font-bold transition-all ${
                activeTab === 'dashboard' ? 'text-primary scale-105' : 'text-on-surface-variant'
              }`}
            >
              <LayoutDashboard className="w-[18px] h-[18px] mb-1" />
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
    </div>
  );
}
