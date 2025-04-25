export interface User {
  id: string;
  fullName: string;
  email: string;
  bio: string;
  learn: string[];
  teach: string[];
  connections: number[];
  requestConnections: number[];
  sentConnections: number[];
  photoURL: string;
}

export type GetAllUsersResponse = User[];

export type GetUserResponse = User;

export type CreateUserResponse = User;

export type UpdateUserResponse = User;
