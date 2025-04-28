import { z } from 'zod';

export const updateProfileSchema = z.object({
  learnSkills: z.array(z.string()).min(1, {
    message: 'Please select at least one skill to learn',
  }),
  teachSkills: z.array(z.string()).min(1, {
    message: 'Please select at least one skill to teach',
  }),
});
