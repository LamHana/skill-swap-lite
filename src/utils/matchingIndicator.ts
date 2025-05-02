import { User } from '@/types/user.type';

export const matchingIndicator = (cur: User, user: User) => {
  if (
    !Array.isArray(cur.learn) ||
    !Array.isArray(cur.teach) ||
    !Array.isArray(user.learn) ||
    !Array.isArray(user.teach)
  )
    return 0;

  const curLearnSet = new Set(cur.learn);
  const curTeachSet = new Set(cur.teach);

  const matchA =
    user.teach.length === 0
      ? 0
      : user.teach.reduce((acc: number, curSkill: string) => {
          if (curLearnSet.has(curSkill)) {
            acc++;
          }
          return acc;
        }, 0) / cur.learn.length;

  const matchB =
    user.learn.length === 0
      ? 0
      : user.learn.reduce((acc: number, curSkill: string) => {
          if (curTeachSet.has(curSkill)) {
            acc++;
          }
          return acc;
        }, 0) / user.learn.length;

  return Math.round(((matchA + matchB) / 2) * 100);
};
