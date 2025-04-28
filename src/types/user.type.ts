import { FieldValue } from 'firebase/firestore';

export interface User {
  id: string;
  fullName: string;
  email: string;
  bio: string;
  learn: string[];
  teach: string[];
  connections: string[] | FieldValue;
  requestConnections: string[] | FieldValue;
  sentConnections: string[] | FieldValue;
  photoURL: string;
}

export type GetAllUsersResponse = User[];

export type GetUserResponse = User;

export type CreateUserResponse = User;

export type UpdateUserResponse = User;
