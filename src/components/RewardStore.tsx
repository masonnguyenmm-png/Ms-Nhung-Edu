/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, ComponentType } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RewardItem, Student } from '../types';
import {
  Star,
  Search,
  ShoppingCart,
  Lock,
  Sparkles,
  Trophy,
  Award,
  BookOpen,
  Music,
  FileText,
  Compass,
  PenTool,
  Package,
  ShoppingBag,
  CheckCircle,
} from 'lucide-react';

interface RewardStoreProps {
  students: Student[];
  rewards: RewardItem[];
  studentWallet: Student;
  onPurchaseReward: (cost: number, rewardTitle: string) => void;
}

// Icon mapper for dynamic string keys to lucide icon graphics
const iconMap: Record<string, ComponentType<any>> = {
  Music: Music,
  FileText: FileText,
  Compass: Compass,
  PenTool: PenTool,
  BookOpen: BookOpen,
  Package: Package,
};

export default function RewardStore({
  students,
  rewards,
  studentWallet,
  onPurchaseReward,
}: RewardStoreProps) {
  const [filterPrice, setFilterPrice] = useState<'All' | 'Under50' | '50-100' | 'Premium'>('All');
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);

  // Category filters
  const filteredRewards = rewards.filter((rew) => {
    if (filterPrice === 'Under50') return rew.cost <= 50;
    if (filterPrice === '50-100') return rew.cost > 50 && rew.cost <= 100;
    if (filterPrice === 'Premium') return rew.cost > 100;
    return true;
  });

  // Local purchase triggers
  const handlePurchase = (item: RewardItem) => {
    if (studentWallet.stars >= item.cost) {
      onPurchaseReward(item.cost, item.title);
      setPurchaseSuccess(`Successfully redeemed: ${item.title}! 🌟`);
      setTimeout(() => setPurchaseSuccess(null), 3500);
    }
  };

  // Sort student placements for the Leaderboard
  const sortedLeaderboard = [...students].sort((a, b) => b.stars - a.stars);

  return (
    <div className="space-y-md relative">
      <AnimatePresence>
        {purchaseSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-12 left-1/2 -translate-x-1/2 bg-primary text-on-primary py-3.5 px-6 rounded-full font-label-md text-sm border-2 border-white/20 shadow-xl flex items-center gap-3 z-50 select-none font-bold"
          >
            <Sparkles className="w-5 h-5 animate-pulse text-secondary-container" />
            <span>{purchaseSuccess}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Header wallet card */}
      <section className="relative w-full rounded-lg overflow-hidden bg-gradient-to-br from-primary to-[#005235] p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-md">
        {/* Lights */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-primary-fixed opacity-15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-secondary-container opacity-15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 text-center md:text-left space-y-2">
          <h2 className="text-3xl font-extrabold text-on-primary tracking-tight">Reward Store</h2>
          <p className="text-body-md text-primary-fixed-dim max-w-xl">
            Redeem points earned from classroom contributions and standard milestones to obtain essential perks or custom supplies.
          </p>
        </div>

        {/* Floating Star Wallet Card (Glassmorphic) */}
        <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-5 flex items-center gap-4 min-w-[220px]">
          <div className="w-14 h-14 rounded-full bg-secondary-container flex items-center justify-center shadow-inner">
            <Star className="w-7 h-7 text-on-secondary-container fill-on-secondary-container" />
          </div>
          <div>
            <p className="font-label-sm text-xs text-primary-fixed font-semibold uppercase">My Points Wallet</p>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-4xl font-extrabold text-on-primary tracking-tight">{studentWallet.stars}</span>
              <span className="text-lg text-secondary-fixed">🌟</span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid containing store canvas and sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-gutter">
        {/* Rewards grid area (Span 8) */}
        <div className="xl:col-span-8 space-y-md">
          {/* Quick Price categorizations filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            <button
              onClick={() => setFilterPrice('All')}
              className={`px-5 py-2 rounded-full whitespace-nowrap font-label-sm text-xs font-bold transition-all ${
                filterPrice === 'All'
                  ? 'bg-primary text-on-primary shadow shadow-primary/20'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
              }`}
            >
              All Rewards
            </button>
            <button
              onClick={() => setFilterPrice('Under50')}
              className={`px-5 py-2 rounded-full whitespace-nowrap font-label-sm text-xs font-bold transition-all ${
                filterPrice === 'Under50'
                  ? 'bg-primary text-on-primary shadow'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
              }`}
            >
              Under 50 🌟
            </button>
            <button
              onClick={() => setFilterPrice('50-100')}
              className={`px-5 py-2 rounded-full whitespace-nowrap font-label-sm text-xs font-bold transition-all ${
                filterPrice === '50-100'
                  ? 'bg-primary text-on-primary shadow'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
              }`}
            >
              50 - 100 🌟
            </button>
            <button
              onClick={() => setFilterPrice('Premium')}
              className={`px-5 py-2 rounded-full whitespace-nowrap font-label-sm text-xs font-bold transition-all ${
                filterPrice === 'Premium'
                  ? 'bg-primary text-on-primary shadow'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
              }`}
            >
              200+ 🌟 Premium
            </button>
          </div>

          {/* Reward cards list grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm md:gap-md">
            {filteredRewards.map((reward) => {
              const DynamicIconComponent = iconMap[reward.icon] || ShoppingBag;
              const isLocked = studentWallet.stars < reward.cost;
              const progressPercentage = Math.min(Math.round((studentWallet.stars / reward.cost) * 100), 100);
              const starsNeeded = reward.cost - studentWallet.stars;

              return (
                <article
                  key={reward.id}
                  className={`bg-surface-container-lowest/80 backdrop-blur-sm rounded-lg border p-5 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300 shadow-sm relative overflow-hidden group ${
                    reward.premium ? 'border-secondary-container/30' : 'border-outline-variant/20'
                  }`}
                >
                  <div>
                    {/* Upper Price pill tag */}
                    <div className="flex justify-between items-start mb-4 gap-2">
                      <div className="w-11 h-11 bg-surface-container rounded-full flex items-center justify-center text-primary group-hover:scale-105 duration-300 transition-transform">
                        <DynamicIconComponent className="w-5 h-5 text-primary-container" />
                      </div>
                      
                      <div className="px-3 py-1 bg-secondary-container/15 text-on-secondary-container rounded-full text-xs font-extrabold flex items-center gap-1 select-none">
                        <Star className="w-3.5 h-3.5 fill-secondary-container" />
                        <span>{reward.cost} 🌟</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 mb-6">
                      <h3 className="text-xl font-bold text-on-surface tracking-tight group-hover:text-primary transition-colors">
                        {reward.title}
                      </h3>
                      <p className="text-body-md text-sm text-on-surface-variant leading-relaxed">
                        {reward.description}
                      </p>
                    </div>
                  </div>

                  {/* Purchase vs Lock indicators */}
                  <div>
                    {isLocked ? (
                      <div className="space-y-2 mt-2">
                        {/* Progress ratio bars */}
                        <div className="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden shadow-inner">
                          <div className="h-full bg-secondary-container rounded-full" style={{ width: `${progressPercentage}%` }} />
                        </div>
                        <div className="flex justify-between items-center text-xs text-on-surface-variant/80 font-semibold select-none">
                          <span>{starsNeeded} More stars needed</span>
                          <span>{progressPercentage}%</span>
                        </div>
                        <button
                          disabled
                          className="w-full py-2.5 rounded-full bg-surface-container text-outline font-label-sm text-xs select-none cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Almost There</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handlePurchase(reward)}
                        className="w-full py-2.5 rounded-full bg-primary text-on-primary font-bold font-label-sm text-xs hover:bg-primary-container hover:shadow transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Redeem Reward</span>
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Leadboard visual matrix sidebar space (Span 4) */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          <div className="bg-surface-container-lowest/80 backdrop-blur-xl border border-outline-variant/20 rounded-lg p-5 shadow-sm sticky top-24">
            <div className="flex items-center justify-between mb-6 border-b border-outline-variant/15 pb-4">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                <Trophy className="w-5 h-5 text-secondary-container" /> Student Leaderboard
              </h3>
            </div>

            {/* List ranking items */}
            <div className="space-y-3 max-h-[460px] overflow-y-auto no-scrollbar">
              {sortedLeaderboard.map((student, idx) => {
                const isCurrentUser = student.id === studentWallet.id;
                const placementIndex = idx + 1;
                
                return (
                  <div
                    key={student.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                      isCurrentUser
                        ? 'bg-primary/5 border-primary/25 relative'
                        : placementIndex === 1
                          ? 'bg-secondary-container/10 border-secondary-container/20 relative'
                          : 'border-transparent hover:bg-surface-container-low'
                    }`}
                  >
                    {isCurrentUser && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l" />
                    )}
                    {placementIndex === 1 && !isCurrentUser && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary-container rounded-l" />
                    )}

                    {/* Badge numbers */}
                    <div className={`w-7 text-center font-extrabold text-sm ${
                      placementIndex === 1 
                        ? 'text-secondary-container' 
                        : 'text-on-surface-variant'
                    }`}>
                      {placementIndex}
                    </div>

                    <img
                      src={student.avatar}
                      alt={student.name}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-full object-cover border"
                    />

                    <div className="flex-1 min-w-0">
                      <p className={`font-label-sm text-xs truncate ${isCurrentUser ? 'font-extrabold text-primary' : 'font-semibold text-on-surface'}`}>
                        {student.name} {isCurrentUser && ' (You)'}
                      </p>
                      <p className="font-label-xs text-[10px] text-outline mt-0.5">Grade: {student.grade}%</p>
                    </div>

                    {/* Stars placement values */}
                    <div className="text-right select-none shrink-0">
                      <p className="font-label-sm text-xs font-bold text-on-surface">{student.stars}</p>
                      <p className="font-label-xs text-[9px] text-outline leading-none">stars</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
