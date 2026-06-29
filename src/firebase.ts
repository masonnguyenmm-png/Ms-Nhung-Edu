/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize core Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore specifying the mandatory database instance ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Authentication
export const auth = getAuth(app);

// Authentication Provider for Google OAuth Login
export const googleProvider = new GoogleAuthProvider();

// Operational Types for custom structured Firestore errors
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

/**
 * Catches Firestore client exceptions and maps them into a strict, traceable stringified JSON error.
 */
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  
  console.error('[Firestore Error Details Auth Secure Trace]:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Validates Firestore Connectivity on startup using test document reads
 */
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('[Firebase Initializer Cache]: Connectivity tested and confirmed.');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase connectivity warning: The client appears to be offline. Please verify config.');
    } else {
      console.warn('[Firebase Connection Test]: Connection test failed, but app will continue with mock data.');
    }
  }
}

// Commented out to prevent blocking on startup
// setTimeout(() => {
//   console.log('[Firebase Timeout]: Connection test timed out, proceeding with app initialization.');
// }, 5000);

// testConnection();

/**
 * Secure Google Popup Authenticator login handler
 */
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Core Authenticators Failed with Error:', error);
    throw error;
  }
}

/**
 * Sign out authentication wrapper
 */
export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Auth Signout Exception triggered:', error);
    throw error;
  }
}
