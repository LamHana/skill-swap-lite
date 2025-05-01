'use client';

import firebase from '@/config/firebase';
import { useAuth } from '@/hooks';

import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';

import { DesktopChatView } from './components/desktopChatView';
import { MobileChatView } from './components/mobileChatView';
import type { Contact, Message } from './components/types';
const db = firebase.db;

function formatTimestamp(ts: Timestamp): string {
  const date = ts.toDate();
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12 || 12;
  const mins = minutes < 10 ? `0${minutes}` : minutes;
  return `${hours}:${mins}${ampm}`;
}

export default function Chat() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messagesByContact, setMessagesByContact] = useState<Record<string, Message[]>>({});
  const [inputValue, setInputValue] = useState('');
  const messageEndRef = useRef<HTMLDivElement>(null!);
  const inputRef = useRef<HTMLInputElement>(null!);

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

        // 1.d) Sau khi có msgsMap và ids…
        const contactsWithTs: Array<{ contact: Contact; millis: number }> = await Promise.all(
          Array.from(ids).map(async (contactId) => {
            const uSnap = await getDoc(doc(db, 'users', contactId));
            const udata = uSnap.exists() ? uSnap.data()! : {};
            const rawMsgs = msgsMap[contactId] || [];
            const lastMsg = rawMsgs[rawMsgs.length - 1];

            // Tính timestamp dưới dạng milliseconds để sort
            const millis = lastMsg ? (lastMsg.timestamp as Timestamp).toDate().getTime() : 0;

            const contact: Contact = {
              id: contactId,
              name: udata.fullName || 'Unknown',
              avatar: udata.photoURL || '',
              lastMessage: lastMsg?.content || '',
              timestamp: lastMsg ? formatTimestamp(lastMsg.timestamp as Timestamp) : '',
              date: '',
            };
            return { contact, millis };
          }),
        );

        // 1.e) Sort giảm dần theo millis
        contactsWithTs.sort((a, b) => b.millis - a.millis);

        // 1.f) Cập nhật state chỉ với contact đã sort
        setContacts(contactsWithTs.map((x) => x.contact));
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

    // cập nhật contact list ngay
    setContacts((prev) => {
      // lọc bỏ contact cũ
      const rest = prev.filter((c) => c.id !== selectedContact.id);
      // build lại contact vừa chat với lastMessage/timestamp mới
      const updated: Contact = {
        ...selectedContact,
        lastMessage: inputValue,
        timestamp: formatTimestamp(Timestamp.now()),
      };
      // đưa lên đầu
      return [updated, ...rest];
    });

    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // mỗi khi selectedContact thay đổi → focus
  useEffect(() => {
    if (selectedContact) {
      inputRef.current?.focus();
    }
  }, [selectedContact]);

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
        inputRef={inputRef}
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
        inputRef={inputRef}
      />
    </div>
  );
}
