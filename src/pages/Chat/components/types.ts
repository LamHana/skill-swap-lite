import { Timestamp } from 'firebase/firestore'

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  date: string;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'contact';
  timestamp: Timestamp
  senderId: string;
}
