import { getSkills } from '@/services/skill.service';
import { Skill } from '@/types/skill.type';

const useSkillMapping = async (userSkills: string[]) => {
  const skills = await getSkills();

  const skillsMap = skills.reduce(
    (map, skill) => {
      map[skill.id] = skill;
      return map;
    },
    {} as Record<string, Skill>,
  );

  const mappingSkills = Array.isArray(userSkills)
    ? (userSkills as string[]).map((skillId) => skillsMap[skillId]?.name || 'Unknown Skill')
    : [];

  return mappingSkills;
};

export default useSkillMapping;
