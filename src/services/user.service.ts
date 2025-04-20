import { GetAllUsersResponse } from '@/types/user.type';
import http from '@/utils/http';

export const GET_ALL_USERS = 'GET_ALL_USERS';

export const getUsers = () => http.get<GetAllUsersResponse>('/users');
