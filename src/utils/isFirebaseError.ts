import { FirebaseError } from 'firebase/app';

export default function isFirebaseError(error: unknown): error is FirebaseError {
  return (error as FirebaseError).code !== undefined;
}
