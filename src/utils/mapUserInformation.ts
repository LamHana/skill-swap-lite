import { Skill } from '@/types/skill.type';
import { User } from '@/types/user.type';

export const mapSkillInformation = (user: User, skills: Skill[]) => {
  const skillsMap = skills.reduce(
    (map, skill) => {
      map[skill.id] = skill;
      return map;
    },
    {} as Record<string, Skill>,
  );

  const learnSkills = Array.isArray(user.learn) ? user.learn.map((id: string) => skillsMap[id] || 'Unknown Skill') : [];
  const teachSkills = Array.isArray(user.teach) ? user.teach.map((id: string) => skillsMap[id] || 'Unknown Skill') : [];

  return { learnSkills, teachSkills };
};

export const mapConnectionInformation = (user: User, users: User[]) => {
  const connections = user.connections || [];
  const requestConnections = user.requestConnections || [];
  const sentConnections = user.sentConnections || [];

  const connectedUsers = Array.isArray(connections) ? users.filter((u) => connections.includes(u.id)) : [];
  const requestedUsers = Array.isArray(requestConnections)
    ? users.filter((u) => requestConnections.includes(u.id))
    : [];
  const sentRequestedUsers = Array.isArray(sentConnections) ? users.filter((u) => sentConnections.includes(u.id)) : [];

  return { connectedUsers, requestedUsers, sentRequestedUsers };
};
