import { FieldValue } from 'firebase/firestore';

export interface User {
  id: string;
  fullName: string | FieldValue;
  email: string;
  bio: string | FieldValue;
  learn: string[] | FieldValue;
  teach: string[] | FieldValue;
  connections: string[] | FieldValue;
  requestConnections: string[] | FieldValue;
  sentConnections: string[] | FieldValue;
  photoURL: string | FieldValue;
}

export type GetAllUsersResponse = User[];

export type GetUserResponse = User;

export type CreateUserResponse = User;

export type UpdateUserResponse = User;

export type UserWithPercent = User & { percent: number; matchedLearn: number; matchedTeach: number };
