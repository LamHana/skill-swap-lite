import { config } from '@/config/app';
import { User } from '@/types/user.type';

import { collection, doc, documentId, getDoc, getDocs, query, where } from 'firebase/firestore';

import updateDocument, { getDocuments } from './firebase.service';

export const GET_ALL_USERS = 'GET_ALL_USERS';
export const GET_CURRENT_USER = 'GET_CURRENT_USER';
export const GET_SINGLE_USER = 'GET_SINGLE_USER';
export const GET_ME_QUERY_KEY = 'GET_ME_QUERY_KEY';

export const getUsersByMode = async (excludedIds?: string[], currentUser?: User, mode?: string) => {
  const { data: users } = await getDocuments(config.collections.users);
  let filteredUsers = excludedIds ? users.filter((user) => !excludedIds.includes(user.id)) : users;
  if (!currentUser || mode === 'related') return filteredUsers as User[];
  if (mode === 'teaching') {
    filteredUsers = filteredUsers.filter(
      (user) =>
        Array.isArray(user.learn) &&
        Array.isArray(currentUser.teach) &&
        user.learn.some((skill) => Array.isArray(currentUser.teach) && currentUser.teach.includes(skill)),
    );
  }

  if (mode === 'learning') {
    filteredUsers = filteredUsers.filter(
      (user) =>
        Array.isArray(user.teach) &&
        Array.isArray(currentUser.learn) &&
        user.teach.some((skill) => Array.isArray(currentUser.learn) && currentUser.learn.includes(skill)),
    );
  }

  return filteredUsers as User[];
};

export const getUsers = async (excludedIds?: string[]) => {
  const usersRef = collection(config.firebase.db, config.collections.users);
  const q = query(usersRef);
  const querySnapshot = await getDocs(q);

  const users = querySnapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<User, 'id'>),
  }));

  const filteredUsers = excludedIds ? users.filter((user) => !excludedIds.includes(user.id)) : users;
  console.log('filteredUsers', filteredUsers);
  return filteredUsers as User[];
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

export const updateUser = async (userId: string | undefined, body: Partial<User>) => {
  if (userId) {
    const userDocRef = updateDocument(config.collections.users, userId, body);
    return await userDocRef;
  }
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

export const getUserBySkills = async (skills: string[]) => {
  const usersRef = collection(config.firebase.db, config.collections.users);
  const q = query(usersRef, where('teach', 'array-contains-any', skills));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<User, 'id'>),
  }));
};
