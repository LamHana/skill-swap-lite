export interface Skill {
  id: number;
  name: string;
  category: string;
}

export type GetAllSkillsResponse = Skill[];

export type GetSkillResponse = Skill;

export type CreateSkillResponse = Skill;
