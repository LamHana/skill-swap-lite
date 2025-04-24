export interface User {
  id: string;
  fullName: string;
  email: string;
  bio: string;
  learn: number[];
  teach: number[];
  connections: number[];
  requestConnections: number[];
  sentConnections: number[];
  photoURL: string;
}

export type GetAllUsersResponse = User[];

export type GetUserResponse = User;

export type CreateUserResponse = User;

export type UpdateUserResponse = User;
