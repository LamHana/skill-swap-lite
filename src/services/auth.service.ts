import { config } from '@/config/app';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  UserCredential,
  updateProfile,
  User,
} from 'firebase/auth';
import updateDocument, { getDocument, setDocument } from './firebase.service';
import { RegisterFormData } from '@/pages/Register/register.schema';

export const AUTH_KEYS = {
  currentUser: 'auth.currentUser',
};

export type SignInCredentials = {
  email: string;
  password: string;
};

export type SignUpCredentials = {
  email: string;
  password: string;
  displayName?: string;
};

export const signInWithEmail = async (credentials: SignInCredentials): Promise<UserCredential> => {
  const { email, password } = credentials;
  return signInWithEmailAndPassword(config.firebase.auth, email, password);
};

export const signInWithGoogle = async (): Promise<UserCredential> => {
  const result = await signInWithPopup(config.firebase.auth, config.firebase.googleProvider);

  const docSnap = await getDocument(config.collections.users, result.user.uid);

  if (!docSnap.exists()) {
    await setDocument(config.collections.users, result.user.uid, {
      email: result.user.email,
      fullName: result.user.displayName,
      learn: [],
      teach: [],
      connections: [],
      requestConnections: [],
      sentConnections: [],
      photoURL: result.user.photoURL,
    });
  } else {
    if (!docSnap.data().avatarUrl) {
      await updateDocument(config.collections.users, result.user.uid, {
        avatarUrl: result.user.photoURL,
      });
    } else if (!docSnap.data().fullName) {
      await updateDocument(config.collections.users, result.user.uid, {
        fullName: result.user.displayName,
      });
    }
  }

  return result;
};

export const signUpWithEmail = async (body: RegisterFormData) => {
  const result = await createUserWithEmailAndPassword(config.firebase.auth, body.email, body.password);

  await updateProfile(result.user, {
    displayName: body.fullname,
  });

  await setDocument(config.collections.users, result.user.uid, {
    name: body.fullname,
    email: body.email,
    learn: body.learnSkills,
    teach: body.teachSkills,
    connections: [],
    requestConnections: [],
    sentConnections: [],
    photoURL: '',
  });

  return result;
};

export const signOutSystem = async (): Promise<void> => {
  return firebaseSignOut(config.firebase.auth);
};

export const getCurrentUser = (): User | null => {
  const user = config.firebase.auth.currentUser;
  if (!user) return null;

  return user;
};
