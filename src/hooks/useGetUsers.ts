import { GET_SKILLS_QUERY_KEY, getSkills } from '@/services/skill.service';
import { GET_ALL_USERS, getUsers } from '@/services/user.service';
import { User, UserWithPercent } from '@/types/user.type';
import { matchingIndicator } from '@/utils/matchingIndicator';

import useAuth from './useAuth';

import { useQuery } from '@tanstack/react-query';

const useGetUsers = () => {
  const { user: currentUser } = useAuth();

  // const { data: currentUser, isLoading: isLoadingCurrentUser } = useQuery({
  //   queryKey: [GET_CURRENT_USER],
  //   queryFn: () => getUserByUID(user?.id),
  //   enabled: !!user && !!user.id,
  //   refetchOnWindowFocus: false,
  //   notifyOnChangeProps: ['data'],
  // });

  const excludedIds = currentUser
    ? [
        currentUser.id,
        ...(Array.isArray(currentUser.connections) ? currentUser.connections : []),
        ...(Array.isArray(currentUser.requestConnections) ? currentUser.requestConnections : []),
      ]
    : [];

  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: [GET_ALL_USERS],
    queryFn: () => getUsers(excludedIds),
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
      const { percent, learnMatchCount, teachMatchCount, reorderedLearn, reorderedTeach } = matchingIndicator(
        currentUser ?? ({} as User),
        user as User,
      );

      const teachSkills = mapSkillIdsToObjects(reorderedTeach);
      const learnSkills = mapSkillIdsToObjects(reorderedLearn);

      return {
        ...user,
        percent: percent,
        matchedLearn: learnMatchCount,
        matchedTeach: teachMatchCount,
        learn: learnSkills,
        teach: teachSkills,
      };
    }) ?? [];

  const sortedMatchedUsers = matchedUsers.sort((a, b) => b.percent - a.percent);

  return {
    users: sortedMatchedUsers,
    isLoading: isLoadingUsers || isLoadingSkills,
  };
};

export default useGetUsers;
