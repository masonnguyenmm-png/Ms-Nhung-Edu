/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
  writeBatch,
  query,
  limit,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Student, RewardItem, Invoice, DiaryPost } from './types';
import {
  initialStudents,
  initialRewards,
  initialInvoices,
  initialDiaryPosts,
} from './data/mockData';

/**
 * Bootstraps the database collections with mock data if they do not contain any documents.
 * This ensures the live-preview shows full interactive data immediately after creation.
 */
export async function bootstrapDatabaseIfEmpty(): Promise<void> {
  try {
    const studentsSnap = await getDocs(query(collection(db, 'students'), limit(1)));
    if (studentsSnap.empty) {
      console.log('[Firebase Bootstrapper]: Bootstrapping initial students...');
      const batch = writeBatch(db);
      initialStudents.forEach((student) => {
        const docRef = doc(db, 'students', student.id);
        batch.set(docRef, student);
      });
      await batch.commit();
    }

    const rewardsSnap = await getDocs(query(collection(db, 'rewards'), limit(1)));
    if (rewardsSnap.empty) {
      console.log('[Firebase Bootstrapper]: Bootstrapping initial rewards catalog...');
      const batch = writeBatch(db);
      initialRewards.forEach((reward) => {
        const docRef = doc(db, 'rewards', reward.id);
        batch.set(docRef, reward);
      });
      await batch.commit();
    }

    const invoicesSnap = await getDocs(query(collection(db, 'invoices'), limit(1)));
    if (invoicesSnap.empty) {
      console.log('[Firebase Bootstrapper]: Bootstrapping tuition billing invoices...');
      const batch = writeBatch(db);
      initialInvoices.forEach((invoice) => {
        // Document paths must match our isValidId validation, so we replace '#' with a standard slug
        const invoiceId = invoice.id.replace('#', 'INV_');
        const docRef = doc(db, 'invoices', invoiceId);
        // We'll map standard details and append a dummy studentId '9' (Leo Mercer) as mock owner
        batch.set(docRef, {
          ...invoice,
          id: invoiceId,
          studentId: '9', // Owner links directly to our representational student portal
        });
      });
      await batch.commit();
    }

    const diarySnap = await getDocs(query(collection(db, 'diaryPosts'), limit(1)));
    if (diarySnap.empty) {
      console.log('[Firebase Bootstrapper]: Bootstrapping classroom instruction diary notes...');
      const batch = writeBatch(db);
      initialDiaryPosts.forEach((post) => {
        const docRef = doc(db, 'diaryPosts', post.id);
        batch.set(docRef, post);
      });
      await batch.commit();
    }
    
    console.log('[Firebase Bootstrapper]: Bootstrapping complete');
  } catch (error) {
    console.error('[Firebase Bootstrapper Failed]:', error);
  }
}

// --- Students Collection Operations ---

/**
 * Registers a real-time listener for students list
 */
export function subscribeToStudents(
  onData: (data: Student[]) => void,
  onError?: (err: unknown) => void
) {
  const colRef = collection(db, 'students');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: Student[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as Student);
      });
      onData(list);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, 'students');
    }
  );
}

/**
 * Updates a Student attribute in Firestore (Admin instructor-level)
 */
export async function updateStudentFields(studentId: string, updates: Partial<Student>): Promise<void> {
  const docRef = doc(db, 'students', studentId);
  try {
    await updateDoc(docRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `students/${studentId}`);
  }
}

/**
 * Deducts stars on Student's wallet during store purchases (Student owner-level)
 * Enforces strict self-decrementing security bounds
 */
export async function purchaseRewardStoreItem(studentId: string, cost: number, currentStars: number): Promise<void> {
  const nextStars = Math.max(0, currentStars - cost);
  const docRef = doc(db, 'students', studentId);
  try {
    await idxStudentPurchase(studentId, nextStars);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `students/${studentId}`);
  }
}

// Explicit helper to handle restricted client star adjustments
async function idxStudentPurchase(studentId: string, nextStars: number) {
  const docRef = doc(db, 'students', studentId);
  await updateDoc(docRef, { stars: nextStars });
}

// --- Rewards Catalog Operations ---

export function subscribeToRewards(onData: (data: RewardItem[]) => void) {
  const colRef = collection(db, 'rewards');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: RewardItem[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as RewardItem);
      });
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'rewards');
    }
  );
}

// --- Invoices Operations ---

export function subscribeToInvoices(onData: (data: Invoice[]) => void) {
  const colRef = collection(db, 'invoices');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: Invoice[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as Invoice);
      });
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'invoices');
    }
  );
}

// --- Classroom Diary posts ---

export function subscribeToDiaryPosts(onData: (data: DiaryPost[]) => void) {
  const colRef = collection(db, 'diaryPosts');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: DiaryPost[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as DiaryPost);
      });
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'diaryPosts');
    }
  );
}

/**
 * Toggles dynamic homework completion states
 */
export async function updateDiaryPostHomework(postId: string, homeworkList: DiaryPost['homework']): Promise<void> {
  const docRef = doc(db, 'diaryPosts', postId);
  try {
    await updateDoc(docRef, { homework: homeworkList });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `diaryPosts/${postId}`);
  }
}

/**
 * Creates a new diary post in the database
 */
export async function createDiaryPost(post: DiaryPost): Promise<void> {
  const colRef = collection(db, 'diaryPosts');
  try {
    await setDoc(doc(db, 'diaryPosts', post.id), post);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'diaryPosts');
  }
}

/**
 * Adds a new student to the database
 */
export async function addStudent(student: Student): Promise<void> {
  const docRef = doc(db, 'students', student.id);
  try {
    await setDoc(docRef, student);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `students/${student.id}`);
  }
}
