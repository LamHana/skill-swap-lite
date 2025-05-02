import { config } from '@/config/app';
import { GET_SKILLS_QUERY_KEY, getSkills } from '@/services/skill.service';
import { GET_SINGLE_USER, getUserByUID, getUsersByUIDs } from '@/services/user.service';
import { Skill } from '@/types/skill.type';
import { User } from '@/types/user.type';

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import useAuth from './useAuth';

import { useQuery } from '@tanstack/react-query';

const useGetSingleProfile = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const uid = id ? id : user?.id;
  console.log('uid', id);
  const { data: cur } = useQuery({
    queryKey: [GET_SINGLE_USER, uid],
    queryFn: async () => {
      if (!uid) {
        throw new Error('User not logged in');
      }

      const userData = await getUserByUID(uid);

      if (!userData) {
        throw new Error('User data not found');
      }

      const connectionIds = (userData.connections ?? []) as string[];

      if (connectionIds.length === 0) {
        return [];
      }

      // get the connected users data
      const connectedUsers = await getUsersByUIDs(connectionIds as string[]);

      return {
        userData,
        connectedUsers,
      };
    },
    enabled: !!user?.id,
  });

  const { data: skills } = useQuery({
    queryKey: [GET_SKILLS_QUERY_KEY],
    queryFn: () => getSkills(),
  });

  const [currentUser, setCurrentUser] = useState<User>();
  const [learn, setLearn] = useState<Skill[]>([]);
  const [teach, setTeach] = useState<Skill[]>([]);
  const [skillsList, setSkillsList] = useState<Skill[]>([]);
  const [userConnections, setUserConnections] = useState<User[]>([]);

  const handleEditProfile = () => {
    navigate(config.routes.editProfile);
  };

  useEffect(() => {
    if (cur) {
      setCurrentUser(cur.userData);
      setUserConnections(cur.connectedUsers);
    }
  }, [cur]);

  useEffect(() => {
    if (skills) {
      setSkillsList(skills);
    }
  }, [skills]);

  useEffect(() => {
    if (
      currentUser &&
      Array.isArray(currentUser.learn) &&
      Array.isArray(currentUser.teach) &&
      skillsList.length !== 0
    ) {
      const learningSkills = currentUser.learn
        .map((id: string) => skillsList.filter((skill: Skill) => skill.id === id))
        .flat();
      const teachingSkills = currentUser.teach
        .map((id: string) => skillsList.filter((skill: Skill) => skill.id === id))
        .flat();
      setLearn(learningSkills);
      setTeach(teachingSkills);
    }
  }, [currentUser, skillsList]);

  return {
    id,
    currentUser,
    learn,
    teach,
    handleEditProfile,
    userConnections,
  };
};

export default useGetSingleProfile;
