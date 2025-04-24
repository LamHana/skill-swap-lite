import { z } from 'zod';

export const formSchema = z.object({
  name: z.string().max(50).nonempty('Please enter your name.'),
  bio: z
    .string()
    .max(160, {
      message: 'Bio must not be longer than 30 characters.',
    }),
  learn: z.array(z.string()).nonempty('Please select at least one skill.'),
  teach: z.array(z.string()).nonempty('Please select at least one skill.'),
});
