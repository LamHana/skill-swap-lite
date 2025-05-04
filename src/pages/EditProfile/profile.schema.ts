import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().max(50).nonempty('Please enter your name.'),
  bio: z.string(),
  photoUrl: z.string(),
  learn: z.array(z.string()).min(1, 'Please select at least one skill.'),
  teach: z.array(z.string()).min(1, 'Please select at least one skill.'),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
