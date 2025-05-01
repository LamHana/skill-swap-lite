import { config } from '@/config/app';
import { User } from '@/types/user.type';

import { collection, doc, documentId, getDoc, getDocs, query, where } from 'firebase/firestore';

import updateDocument from './firebase.service';

export const GET_ALL_USERS = 'GET_ALL_USERS';
export const GET_SINGLE_USER = 'GET_SINGLE_USER';
export const GET_ME_QUERY_KEY = 'GET_ME_QUERY_KEY';

export const getUsers = async (curId: string) => {
  const usersRef = collection(config.firebase.db, config.collections.users);
  const q = query(usersRef, where(documentId(), '!=', curId));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<User, 'id'>),
  }));
};

export const getUserByUID = async (uid: string | undefined) => {
  if (!uid) return null;

  const userDocRef = doc(config.firebase.db, config.collections.users, uid);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    return null;
  }

  return {
    id: userDoc.id,
    ...userDoc.data(),
  } as User;
};

export const updateUser = async (userId: string, body: Partial<User>) => {
  const userDocRef = updateDocument(config.collections.users, userId, body);
  return await userDocRef;
};

export const getUsersByUIDs = async (uids: string[] | undefined): Promise<User[]> => {
  if (uids?.length === 0) return [];

  const usersRef = collection(config.firebase.db, config.collections.users);
  const q = query(usersRef, where(documentId(), 'in', uids));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<User, 'id'>),
  }));
};
