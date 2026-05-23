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
  Gem,
  Coins
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
    <div className="space-y-6 relative">
      <AnimatePresence>
        {purchaseSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-12 left-1/2 -translate-x-1/2 bg-emerald-700 text-white py-3 px-6 rounded-full text-xs font-bold border border-emerald-600 shadow-2xl flex items-center gap-2.5 z-50 select-none"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            <span>{purchaseSuccess}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Header wallet card with premium emerald/amber styling */}
      <section className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#005e3a] via-[#006b47] to-[#004d33] p-6 md:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Lights */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-amber-400/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 text-center md:text-left space-y-2">
          <p className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10.5px] font-bold uppercase tracking-wider text-emerald-200 border border-white/10">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            Milestone Marketplace
          </p>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Student Reward & Perk Store</h2>
          <p className="text-sm text-emerald-100/80 max-w-xl">
            Redeem points earned from classrooms and behavior goals to secure custom items, stationery packs, study perks, or lesson assistance.
          </p>
        </div>

        {/* Floating Star Wallet Card (Glassmorphic) */}
        <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-5 flex items-center gap-4 min-w-[210px] shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-amber-400/20 flex items-center justify-center border border-amber-300/10">
            <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
          </div>
          <div>
            <p className="text-[10.5px] text-emerald-200 font-bold uppercase tracking-wider">My Star Wallet</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-white tracking-tight">{studentWallet.stars}</span>
              <span className="text-[11px] font-bold text-emerald-200">Stars Avail.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid containing store canvas and sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Rewards grid area (Span 8) */}
        <div className="xl:col-span-8 space-y-6">
          {/* Quick Price categorizations filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 select-none no-scrollbar">
            <button
              onClick={() => setFilterPrice('All')}
              className={`px-4.5 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                filterPrice === 'All'
                  ? 'bg-emerald-700 text-white border border-transparent shadow-sm'
                  : 'bg-zinc-100 hover:bg-zinc-200/70 text-zinc-500 border border-zinc-200/20'
              }`}
            >
              All Rewards
            </button>
            <button
              onClick={() => setFilterPrice('Under50')}
              className={`px-4.5 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                filterPrice === 'Under50'
                  ? 'bg-emerald-700 text-white border border-transparent shadow-sm'
                  : 'bg-zinc-100 hover:bg-zinc-200/70 text-zinc-500 border border-zinc-200/20'
              }`}
            >
              Under 50 🌟
            </button>
            <button
              onClick={() => setFilterPrice('50-100')}
              className={`px-4.5 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                filterPrice === '50-100'
                  ? 'bg-emerald-700 text-white border border-transparent shadow-sm'
                  : 'bg-zinc-100 hover:bg-zinc-200/70 text-zinc-500 border border-zinc-200/20'
              }`}
            >
              50 - 100 🌟
            </button>
            <button
              onClick={() => setFilterPrice('Premium')}
              className={`px-4.5 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                filterPrice === 'Premium'
                  ? 'bg-emerald-700 text-white border border-transparent shadow-sm'
                  : 'bg-zinc-100 hover:bg-zinc-200/70 text-zinc-500 border border-zinc-200/20'
              }`}
            >
              200+ Premium
            </button>
          </div>

          {/* Reward cards list grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {filteredRewards.map((reward) => {
              const DynamicIconComponent = iconMap[reward.icon] || ShoppingBag;
              const isLocked = studentWallet.stars < reward.cost;
              const progressPercentage = Math.min(Math.round((studentWallet.stars / reward.cost) * 100), 100);
              const starsNeeded = reward.cost - studentWallet.stars;

              return (
                <article
                  key={reward.id}
                  className={`bg-white rounded-2xl border p-5 flex flex-col justify-between hover:translate-y-[-2px] transition-all duration-300 premium-shadow relative overflow-hidden group ${
                    reward.premium ? 'border-amber-200 shadow-md shadow-amber-500/[0.02]' : 'border-zinc-200/60'
                  }`}
                >
                  <div>
                    {/* Upper Price pill tag */}
                    <div className="flex justify-between items-start mb-4 gap-2 select-none">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        reward.premium 
                          ? 'bg-amber-50 text-amber-700 group-hover:bg-amber-100' 
                          : 'bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100'
                      }`}>
                        <DynamicIconComponent className="w-5 h-5" />
                      </div>
                      
                      <div className={`px-2.5 py-0.5 rounded-full text-[11px] font-black flex items-center gap-0.5 ${
                        reward.premium 
                          ? 'bg-amber-500/10 text-amber-805' 
                          : 'bg-emerald-500/10 text-emerald-805'
                      }`}>
                        <Star className={`w-3 h-3 fill-current`} />
                        <span>{reward.cost} pts</span>
                      </div>
                    </div>

                    <div className="space-y-1 mb-5">
                      <h3 className="text-base font-extrabold text-zinc-800 tracking-tight group-hover:text-[#006b47] transition-colors flex items-center gap-1.5">
                        {reward.title}
                        {reward.premium && (
                          <span className="text-[9px] uppercase tracking-wide bg-amber-500/20 hover:bg-amber-500/30 text-amber-800 px-1.5 py-0.2 rounded font-black">
                            Rare
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        {reward.description}
                      </p>
                    </div>
                  </div>

                  {/* Purchase vs Lock indicators */}
                  <div>
                    {isLocked ? (
                      <div className="space-y-2 mt-2">
                        {/* Progress ratio bars */}
                        <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: `${progressPercentage}%` }} />
                        </div>
                        <div className="flex justify-between items-center text-[10.5px] text-zinc-400 font-bold select-none">
                          <span>{starsNeeded} More needed</span>
                          <span>{progressPercentage}%</span>
                        </div>
                        <button
                          disabled
                          className="w-full py-2.5 rounded-xl bg-zinc-50 text-zinc-400 border border-zinc-100 text-xs font-bold select-none cursor-not-allowed flex items-center justify-center gap-1.5"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Goal Unfinished</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handlePurchase(reward)}
                        className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs hover:shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 mt-4"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Redeem Perk</span>
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Leaderboard visual sidebar space (Span 4) */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          <div className="bg-white border border-zinc-200/60 rounded-2xl p-5 shadow-sm sticky top-24">
            <div className="flex items-center justify-between mb-5 border-b border-zinc-150 pb-4">
              <h3 className="text-sm font-extrabold text-zinc-800 flex items-center gap-2">
                <Trophy className="w-4.5 h-4.5 text-amber-500" />
                <span>Classroom Star Standings</span>
              </h3>
            </div>

            {/* List ranking items */}
            <div className="space-y-2.5 max-h-[460px] overflow-y-auto no-scrollbar">
              {sortedLeaderboard.map((student, idx) => {
                const isCurrentUser = student.id === studentWallet.id;
                const placementIndex = idx + 1;
                
                let iconColor = 'text-zinc-400';
                let itemBgClass = 'border-transparent hover:bg-zinc-50';
                
                if (placementIndex === 1) {
                  iconColor = 'text-amber-500 font-black';
                  itemBgClass = 'bg-amber-500/[0.04] border-amber-200/55';
                } else if (placementIndex === 2) {
                  iconColor = 'text-zinc-400 font-black';
                  itemBgClass = 'bg-zinc-100/50 border-zinc-250/20';
                } else if (placementIndex === 3) {
                  iconColor = 'text-amber-700 font-black';
                  itemBgClass = 'bg-amber-700/[0.04] border-amber-900/[0.05]';
                }

                if (isCurrentUser) {
                  itemBgClass = 'bg-emerald-500/[0.05] border-emerald-500/20';
                }

                return (
                  <div
                    key={student.id}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all ${itemBgClass}`}
                  >
                    {/* Badge placement numbers */}
                    <div className={`w-6 text-center text-xs font-black ${iconColor}`}>
                      {placementIndex === 1 ? '🥇' : placementIndex === 2 ? '🥈' : placementIndex === 3 ? '🥉' : placementIndex}
                    </div>

                    <img
                      src={student.avatar}
                      alt={student.name}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-full object-cover border border-zinc-200"
                    />

                    <div className="flex-1 min-w-0">
                      <p className={`text-xs truncate ${isCurrentUser ? 'font-black text-[#006b47]' : 'font-extrabold text-zinc-705'}`}>
                        {student.name} {isCurrentUser && ' (You)'}
                      </p>
                      <p className="text-[10px] text-zinc-405">Overall: {student.grade}% Grade</p>
                    </div>

                    {/* Stars placement values */}
                    <div className="text-right select-none shrink-0 pr-1">
                      <div className="flex items-center gap-0.5 justify-end text-right">
                        <span className="text-xs font-black text-zinc-900 leading-none">{student.stars}</span>
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      </div>
                      <p className="text-[9px] text-zinc-400 tracking-wider font-semibold uppercase mt-0.5">Stars</p>
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
