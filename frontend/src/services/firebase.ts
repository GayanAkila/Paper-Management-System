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
import { jwtDecode } from "jwt-decode";

export const createUserProfile = async (
  userCredential: UserCredential,
  idToken: string,
  refreshToken: string,
  role: UserRole = UserRole.STUDENT
): Promise<UserProfile> => {
  const { user } = userCredential;
  const userRef = doc(db, "users", user.uid);

  const userProfile: UserProfile = {
    uid: user.uid,
    email: user.email!,
    displayName: user.displayName || undefined,
    photoURL:
      user.photoURL ||
      "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=",
    role,
    createdAt: new Date().toISOString(),
    idToken,
    refreshToken,
  };

  await setDoc(userRef, {
    ...userProfile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return userProfile;
};

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

interface DecodedIdToken {
  role: UserRole;
  [key: string]: any;
}

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

    const idToken = await userCredential.user.getIdToken();
    const refreshToken = userCredential.user.refreshToken;

    const decodedToken: DecodedIdToken = jwtDecode(idToken);
    const role = decodedToken.role || UserRole.STUDENT;

    return await createUserProfile(userCredential, idToken, refreshToken, role);
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

    const existingProfile = await getUserProfile(userCredential.user.uid);

    if (existingProfile) {
      return existingProfile;
    }

    const idToken = await userCredential.user.getIdToken();
    const refreshToken = userCredential.user.refreshToken;

    const decodedToken: DecodedIdToken = jwtDecode(idToken);
    const role = decodedToken.role || UserRole.STUDENT;

    return await createUserProfile(userCredential, idToken, refreshToken, role);
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
