import { config } from '@/config/app';
import { Skill } from '@/types/skill.type';

import { getDocs } from 'firebase/firestore';
import { collection } from 'firebase/firestore';

export const GET_SKILLS_QUERY_KEY = 'GET_SKILLS_QUERY_KEY';

export const getSkills = async () => {
  const querySnapshot = await getDocs(collection(config.firebase.db, config.collections.skills));
  const skills = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
    } as Skill;
  });
  return skills;
};
