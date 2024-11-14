// src/utils/authHandler.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { User, UserRole } from "../store/slices/authSlice";

export const handleEmailSignUp = async (
  email: string,
  password: string
): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  // Create user document with default role
  const userData = {
    email: userCredential.user.email!,
    id: userCredential.user.uid,
    photoUrl: userCredential.user.photoURL,
    role: "user" as UserRole, // Default role
    createdAt: new Date().toISOString(),
  };

  await setDoc(doc(db, "users", userCredential.user.uid), userData);

  return userData;
};

export const handleEmailSignIn = async (
  email: string,
  password: string
): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  // Get user data including role from Firestore
  const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

  if (!userDoc.exists()) {
    throw new Error("User document not found");
  }

  const userData = userDoc.data() as User;
  return userData;
};

export const handleGoogleSignIn = async (): Promise<User> => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);

  // Check if user document exists
  const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

  if (!userDoc.exists()) {
    // Create new user document for first-time Google sign-in
    const userData = {
      email: userCredential.user.email!,
      id: userCredential.user.uid,
      photoUrl: userCredential.user.photoURL,
      role: "user" as UserRole, // Default role
      displayName: userCredential.user.displayName ?? undefined,
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(db, "users", userCredential.user.uid), userData);
    return userData;
  }

  return userDoc.data() as User;
};
