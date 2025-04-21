type AppConfigType = {
  name: string;
  API_URL: string;
};

export const config: AppConfigType = {
  name: import.meta.env.VITE_APP_NAME ?? 'SkillSwapLite',
  API_URL: import.meta.env.VITE_API_URL ?? '',
};

export const baseUrl = import.meta.env.VITE_BASE_URL ?? '';
