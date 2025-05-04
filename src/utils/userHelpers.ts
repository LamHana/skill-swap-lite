import { FieldValue } from 'firebase/firestore';

export const asString = (value: string | FieldValue): string => {
  return typeof value === 'string' ? value : '';
};

export const asStringArray = (value: string[] | FieldValue): string[] => {
  return Array.isArray(value) ? value : [];
};
