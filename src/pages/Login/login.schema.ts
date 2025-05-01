import { USER_MESSAGES } from '@/utils/constants';
import { emailSchema, passwordSchema } from '@/utils/schema';

import { z } from 'zod';

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema(USER_MESSAGES.PASSWORD_MESSAGE),
});

export default loginSchema;
