import { get } from '@/utils/api';

export const getAllUsers = () => {
    return get(`/users`);
};

export const getUser = (id: number) => {
    return get(`/users/${id}`);
};
