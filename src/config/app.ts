import firebase from './firebase';
import { collections } from './collections';
import routes from './routes';

export const config = {
  name: import.meta.env.VITE_APP_NAME ?? 'SkillSwapLite',
  API_URL: import.meta.env.VITE_API_URL ?? '',
  firebase,
  collections,
  routes,
};
