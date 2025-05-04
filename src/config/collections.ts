// Collection types
export type CollectionKey = 'users' | 'skills' | 'conversations' | 'messages';

export type CollectionValue = 'users' | 'skills' | 'conversations' | 'messages';

export type CollectionType = {
  [key in CollectionKey]: CollectionValue;
};

export const collections: CollectionType = {
  users: 'users',
  skills: 'skills',
  conversations: 'conversations',
  messages: 'messages',
};
