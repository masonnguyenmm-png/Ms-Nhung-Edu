/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type StudentStatus = 'Present' | 'Absent' | 'Late' | 'Excused' | 'Participating';

export interface Student {
  id: string;
  name: string;
  avatar: string;
  grade: number;
  stars: number;
  status: StudentStatus;
  consecutiveAbsences?: number;
  isPresent: boolean;
  seatId?: string | null; // desk layout assignment
  classId?: string; // class identifier
}

export interface RewardItem {
  id: string;
  title: string;
  description: string;
  cost: number;
  icon: string; // lucide icon name
  category: 'All' | 'Classroom Perks' | 'Academic Bonuses' | 'Physical Items';
  starsRequired?: number;
  popular?: boolean;
  premium?: boolean;
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
}

export interface HomeworkTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface DiaryPost {
  id: string;
  date: string;
  time: string;
  subject: string;
  topic: string;
  title: string;
  content: string;
  tags: string[];
  homework: HomeworkTask[];
  images?: string[];
  pdf?: { name: string; size: string } | null;
}
