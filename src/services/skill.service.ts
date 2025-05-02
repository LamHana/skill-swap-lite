import { config } from '@/config/app';
import { CategoryWithSkills, Skill } from '@/types/skill.type';

import { getDocs } from 'firebase/firestore';
import { collection } from 'firebase/firestore';

export const GET_SKILLS_QUERY_KEY = 'GET_SKILLS_QUERY_KEY';
export const GET_SKILL_CATEGORIES_QUERY_KEY = 'GET_SKILL_CATEGORIES_QUERY_KEY';

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

export const getAllCategories = async (): Promise<string[]> => {
  const skills = await getSkills();
  const uniqueCategories = new Set(skills.map((skill) => skill.category));
  return Array.from(uniqueCategories);
};

export const getCategoriesWithSkills = async (): Promise<CategoryWithSkills[]> => {
  const skills = await getSkills();
  const categoriesMap = new Map<string, Omit<Skill, 'category'>[]>();

  skills.forEach((skill) => {
    if (!categoriesMap.has(skill.category)) {
      categoriesMap.set(skill.category, []);
    }
    categoriesMap.get(skill.category)?.push({ id: skill.id, name: skill.name } as Omit<Skill, 'category'>);
  });

  return Array.from(categoriesMap.entries()).map(
    ([category, skills]) =>
      ({
        category,
        skills,
      }) as CategoryWithSkills,
  );
};
