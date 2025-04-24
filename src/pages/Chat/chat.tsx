'use client';
import { useEffect, useRef, useState } from 'react';
import type { Contact, Message } from './components/types';
import { MobileChatView } from './components/mobileChatView';
import { DesktopChatView } from './components/desktopChatView';

export default function Chat() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [messagesByContact, setMessagesByContact] = useState<Record<string, Message[]>>({
    '15': [
      { id: '1', content: 'Hi, how are you doing today?', sender: 'contact' },
      { id: '2', content: 'Let me know if you have any questions! Feel free to ask me anything.', sender: 'contact' },
    ],
  });
  const messageEndRef = useRef<HTMLDivElement>(null!);

  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '15',
      name: 'Patricia Green',
      avatar: 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/46.jpg',
      lastMessage: 'Let me know if you have any questions! Feel free to ask me anything.',
      timestamp: '10:05am',
      date: '',
    },
    {
      id: '8',
      name: 'Ada Blanda',
      avatar: 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/95.jpg',
      lastMessage: '',
      timestamp: '',
      date: '',
    },
  ]);

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    if (!isMobile && !selectedContact && contacts.length > 0) {
      setSelectedContact(contacts[0]);
    }
  }, [contacts, selectedContact]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messagesByContact, selectedContact]);

  const formatTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${formattedMinutes}${ampm}`;
  };

  const handleSendMessage = () => {
    if (inputValue.trim() && selectedContact) {
      const newMessage: Message = {
        id: Date.now().toString(),
        content: inputValue,
        sender: 'user',
      };

      setMessagesByContact((prev) => ({
        ...prev,
        [selectedContact.id]: [...(prev[selectedContact.id] || []), newMessage],
      }));

      const currentTime = formatTime();
      setContacts((prev) =>
        prev.map((contact) =>
          contact.id === selectedContact.id
            ? {
                ...contact,
                lastMessage: inputValue.slice(0, 20) + (inputValue.length > 20 ? '...' : ''),
                timestamp: currentTime,
                date: '',
              }
            : contact,
        ),
      );

      setSelectedContact((prev) =>
        prev
          ? {
              ...prev,
              lastMessage: inputValue.slice(0, 20) + (inputValue.length > 20 ? '...' : ''),
              timestamp: currentTime,
              date: '',
            }
          : null,
      );

      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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
