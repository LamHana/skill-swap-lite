import { config } from '@/config/app';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  UserCredential,
  updateProfile,
  User,
  sendEmailVerification,
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

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(config.firebase.auth, config.firebase.googleProvider);
  const docSnap = await getDocument(config.collections.users, result.user.uid);

  const initialUserData = {
    id: result.user.uid,
    email: result.user.email || '',
    fullName: result.user.displayName || '',
    photoURL: result.user.photoURL || '',
    bio: '',
    learn: [],
    teach: [],
    connections: [],
    requestConnections: [],
    sentConnections: [],
  };

  if (!docSnap.exists()) {
    await setDocument(config.collections.users, result.user.uid, initialUserData);
    return {
      user: initialUserData,
      isNewUser: true,
      userFirebase: result.user,
    };
  }

  const existingData = docSnap.data();
  const updatedData = {
    ...initialUserData,
    ...existingData,
    id: result.user.uid,
    photoURL: existingData.photoURL || result.user.photoURL || '',
    fullName: existingData.fullName || result.user.displayName || '',
    email: existingData.email || result.user.email || '',
  };

  if (!existingData.photoURL || !existingData.fullName) {
    await updateDocument(config.collections.users, result.user.uid, updatedData);
  }

  return {
    user: updatedData,
    isNewUser: false,
  };
};

export const signUpWithEmail = async (body: RegisterFormData) => {
  const result = await createUserWithEmailAndPassword(config.firebase.auth, body.email, body.password);

  await sendEmailVerification(result.user);
  console.log('result', result.user);

  await updateProfile(result.user, {
    displayName: body.fullname,
  });
  await setDocument(config.collections.users, result.user.uid, {
    fullName: body.fullname,
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
