import { USER_MESSAGES } from '@/utils/constants';
import { emailSchema, passwordSchema } from '@/utils/schema';

import { z } from 'zod';

export const registerSchema = z.object({
  fullname: z.string().min(1, 'Please enter your fullname'),
  email: emailSchema,
  password: passwordSchema(USER_MESSAGES.PASSWORD_MESSAGE),
  learnSkills: z.array(z.string()).min(1, 'Please select at least one skill you want to learn'),
  teachSkills: z.array(z.string()).min(1, 'Please select at least one skill you want to teach'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
