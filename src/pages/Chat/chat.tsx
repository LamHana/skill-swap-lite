'use client';

import { useEffect, useRef, useState } from 'react';
import type { Contact, Message } from './components/types';
import { MobileChatView } from './components/mobileChatView';
import { DesktopChatView } from './components/desktopChatView';
import { useAuth } from '@/hooks';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  query,
  where,
  updateDoc,
  arrayUnion,
  Timestamp,
} from 'firebase/firestore';
import firebase from '@/config/firebase';
const db = firebase.db;

export default function Chat() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messagesByContact, setMessagesByContact] = useState<Record<string, Message[]>>({});
  const [inputValue, setInputValue] = useState('');
  const messageEndRef = useRef<HTMLDivElement>(null!);

  // ---------- 1) Ensure chat rooms exist & then subscribe realtime ----------
  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      // 1.a) Lấy danh sách connections
      const userSnap = await getDoc(doc(db, 'users', user.id));
      const connections: string[] = userSnap.exists() ? (userSnap.data().connections as string[]) || [] : [];

      // 1.b) Tạo chat doc nếu chưa có
      await Promise.all(
        connections.map(async (contactId) => {
          const chatId = [user.id, contactId].sort().join('_');
          const chatRef = doc(db, 'chats', chatId);
          const chatSnap = await getDoc(chatRef);
          if (!chatSnap.exists()) {
            // khởi tạo participants + messages rỗng
            await setDoc(chatRef, {
              participants: [user.id, contactId],
              messages: [],
            });
          }
        }),
      );

      // 1.c) Bây giờ subscribe tất cả chat room của user
      const chatsQ = query(collection(db, 'chats'), where('participants', 'array-contains', user.id));
      const unsub = onSnapshot(chatsQ, async (snap) => {
        const msgsMap: Record<string, Message[]> = {};
        const ids = new Set<string>();

        snap.docs.forEach((docSnap) => {
          const data = docSnap.data();
          const parts = data.participants as string[];
          const otherId = parts.find((id) => id !== user.id);
          if (!otherId) return;

          const raw = (data.messages as any[]) || [];
          msgsMap[otherId] = raw.map((m) => ({
            id: m.id,
            content: m.content,
            senderId: m.senderId,
            timestamp: m.timestamp,
            sender: m.senderId === user.id ? 'user' : 'contact',
          }));
          ids.add(otherId);
        });

        setMessagesByContact(msgsMap);

        // load info contacts
        const loaded: Contact[] = await Promise.all(
          Array.from(ids).map(async (contactId) => {
            const uSnap = await getDoc(doc(db, 'users', contactId));
            const udata = uSnap.exists() ? uSnap.data()! : {};
            const msgs = msgsMap[contactId] || [];
            const last = msgs[msgs.length - 1];
            return {
              id: contactId,
              name: udata.fullName || 'Unknown',
              avatar: udata.photoURL || '',
              lastMessage: last?.content || '',
              timestamp: last ? new Date((last.timestamp as any).seconds * 1000).toLocaleTimeString() : '',
              date: '',
            };
          }),
        );
        setContacts(loaded);
      });

      return () => unsub();
    })().catch(console.error);
  }, [user]);

  // ---------- 2) Trên desktop auto chọn contact đầu tiên ----------
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    if (!isMobile && !selectedContact && contacts.length > 0) {
      setSelectedContact(contacts[0]);
    }
  }, [contacts, selectedContact]);

  // ---------- 3) Scroll xuống cuối khi có message mới ----------
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messagesByContact, selectedContact]);

  const formatTime = () => {
    const now = new Date();
    let h = now.getHours();
    const m = now.getMinutes();
    const suffix = h >= 12 ? 'pm' : 'am';
    h = h % 12 || 12;
    return `${h}:${m < 10 ? '0' + m : m}${suffix}`;
  };

  // ---------- 4) Gửi tin nhắn vào đúng chat room ----------
  const handleSendMessage = async () => {
    if (!inputValue.trim() || !selectedContact || !user?.id) return;

    const chatId = [user.id, selectedContact.id].sort().join('_');
    const chatRef = doc(db, 'chats', chatId);

    await updateDoc(chatRef, {
      messages: arrayUnion({
        id: Date.now().toString(),
        content: inputValue,
        senderId: user.id,
        timestamp: Timestamp.now(),
      }),
    });

    setInputValue('');
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ---------- 5) Render cả Mobile & Desktop ----------
  return (
    <div className='flex flex-col h-[calc(100vh-64px)] w-full p-4 gap-4'>
      <MobileChatView
        selectedContact={selectedContact}
        contacts={contacts}
        onSelectContact={setSelectedContact}
        onBack={() => setSelectedContact(null)}
        messages={selectedContact ? messagesByContact[selectedContact.id] || [] : []}
        inputValue={inputValue}
        onInputChange={(e) => setInputValue(e.target.value)}
        onSend={handleSendMessage}
        onKeyDown={handleKeyDown}
        endRef={messageEndRef}
      />
      <DesktopChatView
        selectedContact={selectedContact}
        contacts={contacts}
        onSelectContact={setSelectedContact}
        messages={selectedContact ? messagesByContact[selectedContact.id] || [] : []}
        inputValue={inputValue}
        onInputChange={(e) => setInputValue(e.target.value)}
        onSend={handleSendMessage}
        onKeyDown={handleKeyDown}
        endRef={messageEndRef}
      />
    </div>
  );
}
