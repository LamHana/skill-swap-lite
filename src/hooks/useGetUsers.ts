import { GET_ALL_USERS, getUsers } from '@/services/user.service';
import { User, UserWithPercent } from '@/types/user.type';
import { matchingIndicator } from '@/utils/matchingIndicator';

import React, { useRef } from 'react';

import useAuth from './useAuth';
import useSkill from './useSkill';

import { useQuery } from '@tanstack/react-query';

const useGetUsers = () => {
  const { user } = useAuth();
  const { skillMapping } = useSkill();
  const matchCache = useRef(new Map<string, UserWithPercent>());

  const { data, isLoading, isError } = useQuery({
    queryKey: [GET_ALL_USERS],
    queryFn: () => getUsers(user?.id || ''),
    enabled: !!user?.id,
  });

  const processUsers = React.useCallback(
    (users: User[]) => {
      if (!users || !user) return [];
      return users.map((userItem: User) => {
        const cacheKey = `${user.id}->${userItem.id}`;
        if (matchCache.current.has(cacheKey)) {
          const cachedUser = matchCache.current.get(cacheKey)!;
          return { ...cachedUser, percent: cachedUser.percent ?? 0 };
        }
        const percent = matchingIndicator(user, userItem);
        const { learning, teaching } = skillMapping(userItem);
        const newUserItem: UserWithPercent = { ...userItem, learn: learning ?? [], teach: teaching ?? [], percent };
        matchCache.current.set(cacheKey, newUserItem);
        return newUserItem;
      });
    },
    [skillMapping],
  );

  const processedUsers: UserWithPercent[] = React.useMemo(() => {
    return processUsers(data || []);
  }, [data, user, skillMapping]);

  const sortUsersByMatching = (list: UserWithPercent[]) => {
    return [...list].sort((a, b) => b.percent - a.percent);
  };

  return {
    users: processedUsers,
    isLoading: isLoading,
    isError,
    processUsers,
    sortUsersByMatching,
  };
};

export default useGetUsers;
