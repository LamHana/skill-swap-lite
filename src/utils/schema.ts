import { z } from 'zod';

import { PASSWORD_REGEX, USER_MESSAGES } from './constants';

// GLOBAL SCHEMA
export const emailSchema = z
  .string({
    message: USER_MESSAGES.EMAIL_MESSAGE,
  })
  .email({
    message: USER_MESSAGES.EMAIL_MESSAGE,
  });

export const passwordSchema = (message: string = '') =>
  z
    .string({
      message: message,
    })
    .refine((value) => PASSWORD_REGEX.test(value), {
      message: message,
    });

export const fullnameSchema = z
  .string({
    message: USER_MESSAGES.FULLNAME_MESSAGE,
  })
  .min(1, {
    message: USER_MESSAGES.FULLNAME_MESSAGE,
  });

export const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
});
