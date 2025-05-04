import { User } from '@/types/user.type';

export const matchingIndicator = (cur: User, user: User) => {
  if (
    !Array.isArray(cur.learn) ||
    !Array.isArray(cur.teach) ||
    !Array.isArray(user.learn) ||
    !Array.isArray(user.teach)
  )
    return { percent: 0, matchedLearn: [], matchedTeach: [], learnMatchCount: 0, teachMatchCount: 0 };

  const curLearnSet = new Set(cur.learn);
  const curTeachSet = new Set(cur.teach);

  const matchedLearn: string[] = [];
  const nonMatchedLearn: string[] = [];
  const matchedTeach: string[] = [];
  const nonMatchedTeach: string[] = [];
  const matchA =
    user.teach.length === 0
      ? 0
      : user.teach.reduce((acc: number, curSkill: string) => {
          if (curLearnSet.has(curSkill)) {
            acc++;
            matchedLearn.push(curSkill);
          } else {
            nonMatchedLearn.push(curSkill);
          }
          return acc;
        }, 0) / cur.learn.length;

  const matchB =
    user.learn.length === 0
      ? 0
      : user.learn.reduce((acc: number, curSkill: string) => {
          if (curTeachSet.has(curSkill)) {
            acc++;
            matchedTeach.push(curSkill);
          } else {
            nonMatchedTeach.push(curSkill);
          }
          return acc;
        }, 0) / user.learn.length;

  return {
    percent: Math.round(((matchA + matchB) / 2) * 100) || 0,
    reorderedLearn: [...matchedTeach, ...nonMatchedTeach],
    reorderedTeach: [...matchedLearn, ...nonMatchedLearn],
    learnMatchCount: matchedLearn.length,
    teachMatchCount: matchedTeach.length,
  };
};
