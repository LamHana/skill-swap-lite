import { config } from '@/config/app';
import { GetAllUsersResponse, User } from '@/types/user.type';
import http from '@/utils/http';
import { doc, getDoc } from 'firebase/firestore';
import updateDocument from './firebase.service';

export const GET_ALL_USERS = 'GET_ALL_USERS';
export const GET_SINGLE_USER = 'GET_SINGLE_USER';
export const GET_ME_QUERY_KEY = 'GET_ME_QUERY_KEY';

export const getUsers = () => http.get<GetAllUsersResponse>('/users');

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
