import { z } from 'zod';

export const formSchema = z.object({
  name: z.string().min(2).max(50),
  bio: z
    .string()
    .min(10, {
      message: 'Bio must be at least 10 characters.',
    })
    .max(160, {
      message: 'Bio must not be longer than 30 characters.',
    }),
  learn: z.array(z.string()).nonempty('Please select at least one skill.'),
  teach: z.array(z.string()).nonempty('Please select at least one skill.'),
});
