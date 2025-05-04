import { collections } from './collections';
import firebase from './firebase';
import routes from './routes';

export const config = {
  name: import.meta.env.VITE_APP_NAME ?? 'SkillSwapLite',
  firebase,
  collections,
  routes,
};
