import { config } from "@/config/app";
import { GET_SKILLS_QUERY_KEY, getSkills } from "@/services/skill.service";
import { GET_SINGLE_USER, getUserByUID } from "@/services/user.service";
import { Skill } from "@/types/skill.type";
import { User } from "@/types/user.type";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useAuth from "./useAuth";

import { useQuery } from "@tanstack/react-query";

const useGetSingleProfile = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const uid = id ? id : user?.id;

  const { data: cur } = useQuery({
    queryKey: [GET_SINGLE_USER, uid],
    queryFn: () => getUserByUID(uid),
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

  const handleEditProfile = () => {
    navigate(config.routes.editProfile);
  };

  useEffect(() => {
    if (cur) {
      setCurrentUser(cur);
    }
  }, [cur]);

  useEffect(() => {
    if (skills) {
      setSkillsList(skills);
    }
  }, [skills]);

  useEffect(() => {
    if (currentUser && Array.isArray(currentUser.learn) && Array.isArray(currentUser.teach) && skillsList.length !== 0) {
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
    handleEditProfile
  };
};

export default useGetSingleProfile;
