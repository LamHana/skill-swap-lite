export interface User {
  id: number;
  name: string;
  email: string;
  learn: number[];
  teach: number[];
  connections: number[];
  requestConnections: number[];
  sentConnections: number[];
}

export type GetAllUsersResponse = User[];

export type GetUserResponse = User;

export type CreateUserResponse = User;

export type UpdateUserResponse = User;
