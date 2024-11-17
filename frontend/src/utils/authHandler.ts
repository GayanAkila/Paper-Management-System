// src/utils/authHandler.ts

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  UserCredential,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  DocumentSnapshot,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { UserProfile, UserRole } from "../types/types";

class AuthError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = "AuthError";
  }
}

const createUserDocument = async (
  userCredential: UserCredential,
  role: UserRole = UserRole.STUDENT
): Promise<UserProfile> => {
  const userData: UserProfile = {
    uid: userCredential.user.uid,
    email: userCredential.user.email!,
    displayName: userCredential.user.displayName || undefined,
    photoURL: userCredential.user.photoURL,
    role,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, "users", userCredential.user.uid), {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return userData;
  } catch (error: any) {
    throw new AuthError("Failed to create user document", error.code);
  }
};

const getUserFromSnapshot = (snapshot: DocumentSnapshot): UserProfile => {
  if (!snapshot.exists()) {
    throw new AuthError("User document not found");
  }

  const data = snapshot.data();
  if (!data?.email || !data?.role) {
    throw new AuthError("Invalid user document data");
  }

  return {
    uid: snapshot.id,
    email: data.email,
    displayName: data.displayName,
    photoURL: data.photoUrl,
    role: data.role as UserRole,
    createdAt:
      data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    updatedAt:
      data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
  };
};

export const handleEmailSignUp = async (
  email: string,
  password: string
): Promise<UserProfile> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return await createUserDocument(userCredential);
  } catch (error: any) {
    switch (error.code) {
      case "auth/email-already-in-use":
        throw new AuthError("This email is already registered");
      case "auth/invalid-email":
        throw new AuthError("Invalid email address");
      case "auth/operation-not-allowed":
        throw new AuthError("Email/password accounts are not enabled");
      case "auth/weak-password":
        throw new AuthError("Password should be at least 6 characters");
      default:
        throw new AuthError(
          error.message || "Failed to create account",
          error.code
        );
    }
  }
};

export const handleEmailSignIn = async (
  email: string,
  password: string
): Promise<UserProfile> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
    return getUserFromSnapshot(userDoc);
  } catch (error: any) {
    switch (error.code) {
      case "auth/user-not-found":
        throw new AuthError("No account found with this email");
      case "auth/wrong-password":
        throw new AuthError("Incorrect password");
      case "auth/user-disabled":
        throw new AuthError("This account has been disabled");
      case "auth/invalid-email":
        throw new AuthError("Invalid email address");
      default:
        throw new AuthError(error.message || "Failed to sign in", error.code);
    }
  }
};

export const handleGoogleSignIn = async (): Promise<UserProfile> => {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account",
    });

    const userCredential = await signInWithPopup(auth, provider);

    // Check if user already exists
    const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

    if (!userDoc.exists()) {
      // Create new user document for first-time Google sign-in
      return await createUserDocument(userCredential);
    }

    return getUserFromSnapshot(userDoc);
  } catch (error: any) {
    switch (error.code) {
      case "auth/popup-closed-by-user":
        throw new AuthError("Sign in cancelled by user");
      case "auth/popup-blocked":
        throw new AuthError("Popup was blocked by the browser");
      case "auth/cancelled-popup-request":
        throw new AuthError("Another sign in attempt is in progress");
      case "auth/account-exists-with-different-credential":
        throw new AuthError(
          "An account already exists with the same email address but different sign-in credentials"
        );
      default:
        throw new AuthError(
          error.message || "Failed to sign in with Google",
          error.code
        );
    }
  }
};

// Helper function to check if user has required role
export const hasRole = (
  user: UserProfile | null,
  requiredRole: UserRole
): boolean => {
  if (!user) return false;
  return user.role === requiredRole;
};

// Helper function to get user document
export const getUserDocument = async (userId: string): Promise<UserProfile> => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    return getUserFromSnapshot(userDoc);
  } catch (error: any) {
    throw new AuthError("Failed to fetch user data", error.code);
  }
};
