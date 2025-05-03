import { GET_SKILLS_QUERY_KEY, getSkills } from '@/services/skill.service';
import { CategoryWithSkills, Skill } from '@/types/skill.type';
import { User } from '@/types/user.type';

import React from 'react';

import { useQuery } from '@tanstack/react-query';

const useSkill = () => {
  const { data: skills } = useQuery({
    queryKey: [GET_SKILLS_QUERY_KEY],
    queryFn: () => getSkills(),
  });

  const skillsMap =
    skills?.reduce(
      (map, skill) => {
        map[skill.id] = skill;
        return map;
      },
      {} as Record<string, Skill>,
    ) || {};

  const skillMapping = React.useCallback(
    (user: User) => {
      if (!skills || !Array.isArray(user.learn) || !Array.isArray(user.teach)) {
        return { learn: [], teach: [] };
      }
      const learning = user.learn.map((id: string) => skillsMap[id]?.name || 'Unknown Skill');
      const teaching = user.teach.map((id: string) => skillsMap[id]?.name || 'Unknown Skill');
      return { learning, teaching };
    },
    [skills],
  );

  const skillCategories = React.useMemo(() => {
    if (!skills) return [];
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
  }, [skills]);
  return {
    skills,
    skillMapping,
    skillCategories,
  };
};

export default useSkill;
