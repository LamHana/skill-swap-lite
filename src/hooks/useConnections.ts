import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';
import { getUsersByUIDs } from '@/services/user.service';
import { User } from '@/types/user.type';
import { getSkills } from '@/services/skill.service';
import { Skill } from '@/types/skill.type';

const useConnections = () => {
  const { user } = useAuth();

  return useQuery<User[]>({
    queryKey: ['connections', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('User not logged in');
      }

      // // get the current user data
      // const userData = await getUserByUID(user.id);

      // if (!userData) {
      //   throw new Error('User data not found');
      // }

      // const connectionIds = (userData.connections ?? []) as string[];

      // if (connectionIds.length === 0) {
      //   return [];
      // }

      // get all skills to create a mapping
      const skills = await getSkills();
      const skillsMap = skills.reduce(
        (map, skill) => {
          map[skill.id] = skill;
          return map;
        },
        {} as Record<string, Skill>,
      );

      // get the connected users data
      const connectedUsers = await getUsersByUIDs(user.connections as string[]);

      // map skills to their names
      return connectedUsers.map((connectedUser) => {
        // map teach skills
        const teachSkills = Array.isArray(connectedUser.teach)
          ? (connectedUser.teach as string[]).map((skillId) => skillsMap[skillId]?.name || 'Unknown Skill')
          : [];

        // map learn skills
        const learnSkills = Array.isArray(connectedUser.learn)
          ? (connectedUser.learn as string[]).map((skillId) => skillsMap[skillId]?.name || 'Unknown Skill')
          : [];

        return {
          ...connectedUser,
          teach: teachSkills,
          learn: learnSkills,
        };
      });
    },
    enabled: !!user?.id,
  });
};

export default useConnections;
