export const USER_MESSAGES = {
  FULLNAME_MESSAGE: 'Please enter at least 1 character',
  EMAIL_MESSAGE: 'Please enter a valid email',
  PASSWORD_MESSAGE:
    'Password must be between 8 and 16 characters, including one number, one uppercase letter, and one lowercase letter',
} as const;

export const PASSWORD_REGEX = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,16}$/;
