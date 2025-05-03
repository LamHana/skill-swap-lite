import { GET_SKILLS_QUERY_KEY, getSkills } from '@/services/skill.service';
import { GET_ALL_USERS, GET_CURRENT_USER, getUserByUID, getUsersByMode } from '@/services/user.service';
import { User, UserWithPercent } from '@/types/user.type';
import { matchingIndicator } from '@/utils/matchingIndicator';

import useAuth from './useAuth';
import useSkill from './useSkill';

import { useQuery } from '@tanstack/react-query';

const useGetUsers = (mode: string = 'related') => {
  const { user } = useAuth();

  const { data: currentUser, isLoading: isLoadingCurrentUser } = useQuery({
    queryKey: [GET_CURRENT_USER],
    queryFn: () => getUserByUID(user?.id),
    enabled: !!user && !!user.id,
    refetchOnWindowFocus: false,
  });

  const excludedIds = currentUser
    ? [
        currentUser.id,
        ...(Array.isArray(currentUser.connections) ? currentUser.connections : []),
        ...(Array.isArray(currentUser.requestConnections) ? currentUser.requestConnections : []),
      ]
    : [];

  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: [GET_ALL_USERS, mode],
    queryFn: () => getUsersByMode(excludedIds, currentUser || undefined, mode),
    enabled: !!currentUser,
    refetchOnWindowFocus: false,
  });

  const { data: skills, isLoading: isLoadingSkills } = useQuery({
    queryKey: [GET_SKILLS_QUERY_KEY],
    queryFn: () => getSkills(),
    refetchOnWindowFocus: false,
  });

  const skillsMap = Object.fromEntries((skills ?? []).map((s) => [s.id, s.name]));

  const mapSkillIdsToObjects = (ids: string[] = []): string[] => {
    return ids.map((id) => skillsMap[id]).filter(Boolean);
  };

  const matchedUsers: UserWithPercent[] =
    users?.map((user) => {
      const teachSkills = Array.isArray(user.teach) ? mapSkillIdsToObjects(user.teach) : [];
      const learnSkills = Array.isArray(user.learn) ? mapSkillIdsToObjects(user.learn) : [];

      return {
        ...user,
        percent: currentUser ? matchingIndicator(currentUser, user as User) : 0,
        learn: learnSkills,
        teach: teachSkills,
      };
    }) ?? [];

  const sortedMatchedUsers = matchedUsers.sort((a, b) => b.percent - a.percent);

  return {
    users: sortedMatchedUsers,
    isLoading: isLoadingCurrentUser || isLoadingUsers || isLoadingSkills,
  };
};

export default useGetUsers;
