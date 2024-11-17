// src/services/firebase.ts

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  UserCredential,
  signOut as firebaseSignOut,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { UserProfile, UserRole } from "../types/types";

// Create user profile in Firestore
export const createUserProfile = async (
  userCredential: UserCredential,
  role: UserRole = UserRole.STUDENT
): Promise<UserProfile> => {
  const { user } = userCredential;
  const userRef = doc(db, "users", user.uid);

  const userProfile: UserProfile = {
    uid: user.uid,
    email: user.email!,
    displayName: user.displayName || undefined,
    photoURL: user.photoURL,
    role,
    createdAt: new Date().toISOString(),
  };

  await setDoc(userRef, {
    ...userProfile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return userProfile;
};

// Get user profile from Firestore
export const getUserProfile = async (
  uid: string
): Promise<UserProfile | null> => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data() as UserProfile;
  }

  return null;
};

// Update user profile in Firestore
export const updateUserProfile = async (
  uid: string,
  data: Partial<UserProfile>
): Promise<void> => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

// Email Sign Up
export const signUpWithEmail = async (
  email: string,
  password: string
): Promise<UserProfile> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return await createUserProfile(userCredential);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Email Sign In
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<UserProfile> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const userProfile = await getUserProfile(userCredential.user.uid);

    if (!userProfile) {
      throw new Error("User profile not found");
    }

    return userProfile;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Google Sign In
export const signInWithGoogle = async (): Promise<UserProfile> => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);

    // Check if user profile exists
    const existingProfile = await getUserProfile(userCredential.user.uid);

    if (existingProfile) {
      return existingProfile;
    }

    // Create new profile if doesn't exist
    return await createUserProfile(userCredential);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Sign Out
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
};
