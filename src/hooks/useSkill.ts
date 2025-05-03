import { GET_SKILLS_QUERY_KEY, getSkills } from '@/services/skill.service';
import { CategoryWithSkills, Skill } from '@/types/skill.type';
import { asStringArray } from '@/utils/userHelpers';

import React from 'react';

import useAuth from './useAuth';

import { useQuery } from '@tanstack/react-query';

const useSkill = () => {
  const { user: currentUser } = useAuth();

  const { data: skills } = useQuery({
    queryKey: [GET_SKILLS_QUERY_KEY],
    queryFn: () => getSkills(),
  });

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

  const skillsMap = React.useMemo(() => {
    return (
      skills?.reduce(
        (map, skill) => {
          map[skill.id] = skill;
          return map;
        },
        {} as Record<string, Skill>,
      ) || {}
    );
  }, [skills]);

  const skillMapping = React.useCallback(
    (learn: string[], teach: string[]) => {
      if (!skills) {
        return { learn: [], teach: [] };
      }
      const learning = learn.map((id: string) => skillsMap[id]?.name || 'Unknown Skill');
      const teaching = teach.map((id: string) => skillsMap[id]?.name || 'Unknown Skill');
      return { learning, teaching };
    },
    [skills, skillsMap],
  );

  const { skillSet, currentLearning, currentTeaching } = React.useMemo(() => {
    if (!currentUser)
      return {
        skillSet: { learningSet: new Set<string>(), teachingSet: new Set<string>() },
        currentLearning: [],
        currentTeaching: [],
      };
    const { learning, teaching } = skillMapping(
      (currentUser && asStringArray(currentUser.learn)) || [],
      (currentUser && asStringArray(currentUser.teach)) || [],
    );
    const learningSet = new Set<string>(learning);
    const teachingSet = new Set<string>(teaching);
    return { skillSet: { learningSet, teachingSet }, currentLearning: learning, currentTeaching: teaching };
  }, [currentUser, skillMapping]);

  const checkMatching = (skillArray: string[], type: 'learn' | 'teach') => {
    if (!skills || skillArray.length === 0) return false;
    const matches: string[] = [];
    const nonMatches: string[] = [];
    const compareSet = type === 'learn' ? skillSet.teachingSet : skillSet.learningSet;
    skillArray.forEach((skill) => {
      if (compareSet.has(skill)) {
        matches.push(skill);
      } else {
        nonMatches.push(skill);
      }
    });
    return {
      matchedSkills: [...matches, ...nonMatches],
      hasMatch: matches.length > 0,
      matchedSkillsCount: matches.length,
    };
  };

  return {
    skills,
    skillMapping,
    skillCategories,
    checkMatching,
    currentLearning,
    currentTeaching,
  };
};

export default useSkill;
