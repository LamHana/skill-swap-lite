import { z } from 'zod';

import { USER_MESSAGES } from '@/utils/constants';
import { emailSchema, passwordSchema } from '@/utils/schema';

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema(USER_MESSAGES.PASSWORD_MESSAGE),
});

export default loginSchema;
