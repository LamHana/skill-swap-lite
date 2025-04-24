'use client';

import type React from 'react';

import { useEffect, useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Info, Search, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  date: string;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'contact';
}

export default function Chat() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [messagesByContact, setMessagesByContact] = useState<Record<string, Message[]>>({
    '15': [
      { id: '1', content: 'Hi, how are you doing today?', sender: 'contact' },
      { id: '2', content: 'Let me know if you have any questions! Feel free to ask me anything.', sender: 'contact' },
    ],
  });
  const messageEndRef = useRef<HTMLDivElement | null>(null);

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
    if (!selectedContact && contacts.length > 0) {
      setSelectedContact(contacts[0]);
    }
  }, [contacts]);

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

    hours = hours % 12;
    hours = hours ? hours : 12;

    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    return `${hours}:${formattedMinutes}${ampm}`;
  };

  const handleSendMessage = () => {
    if (inputValue.trim() && selectedContact) {
      const newMessage = {
        id: Date.now().toString(),
        content: inputValue,
        sender: 'user' as const,
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
                lastMessage: inputValue.length > 20 ? inputValue.substring(0, 20) + '...' : inputValue,
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
              lastMessage: inputValue.length > 20 ? inputValue.substring(0, 20) + '...' : inputValue,
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
      {/* Mobile view  */}
      <div
        className={cn(
          'w-full h-full bg-background rounded-lg border-2 border-primary md:hidden',
          selectedContact ? 'hidden' : 'block',
        )}
      >
        <div className='p-4'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <Input placeholder='Search connection' className='pl-9 bg-muted/50' />
          </div>
        </div>
        <div className='overflow-auto h-[calc(100%-72px)]'>
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className='flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer mx-2 my-1 rounded-lg bg-muted/30'
              onClick={() => setSelectedContact(contact)}
            >
              <Avatar className='h-10 w-10'>
                <AvatarImage src={contact.avatar} />
                <AvatarFallback className='bg-muted'>
                  {contact.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div className='flex-1 min-w-0'>
                <div className='flex justify-between items-center'>
                  <p className='font-medium text-sm truncate'>{contact.name}</p>
                  <span className='text-xs text-muted-foreground'>{contact.timestamp || contact.date}</span>
                </div>
                {contact.lastMessage && <p className='text-xs text-muted-foreground truncate'>{contact.lastMessage}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile view - Chat area (shown when a contact is selected) */}
      <div
        className={cn(
          'w-full h-full flex flex-col rounded-lg border-2 border-primary md:hidden overflow-hidden',
          selectedContact ? 'flex' : 'hidden',
        )}
      >
        {/* Chat header */}
        <div className='p-3 flex items-center justify-between border-b border-border z-60'>
          <div className='flex items-center gap-3'>
            <Button variant='ghost' size='icon' onClick={() => setSelectedContact(null)}>
              <ArrowLeft className='h-5 w-5' />
            </Button>
            <Avatar className='h-8 w-8'>
              <AvatarImage src={selectedContact?.avatar} />
              <AvatarFallback className='bg-muted'>
                {selectedContact
                  ? selectedContact.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                  : 'MJ'}
              </AvatarFallback>
            </Avatar>
            <span className='font-medium'>{selectedContact ? selectedContact.name : 'Mike Johnson'}</span>
          </div>
          <Button variant='ghost' size='icon'>
            <Info className='h-5 w-5' />
          </Button>
        </div>

        {/* Messages */}
        <div className='flex-1 overflow-auto p-4 flex flex-col gap-1'>
          {((selectedContact && messagesByContact[selectedContact.id]) || []).map((message) => (
            <div key={message.id} className={cn('flex', message.sender === 'user' ? 'justify-end' : 'justify-start')}>
              {message.sender === 'contact' && (
                <Avatar className='h-8 w-8 mr-2 flex-shrink-0 self-end'>
                  <AvatarImage src={selectedContact?.avatar} />
                  <AvatarFallback className='bg-muted'>
                    {selectedContact?.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  'max-w-[70%] rounded-lg px-4 py-2 text-sm',
                  message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted',
                )}
              >
                {message.content}
              </div>
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>

        {/* Message input */}
        <div className='border-t border-border p-3 flex items-center gap-2 mt-auto sticky bottom-0 bg-white'>
          <Input
            placeholder='Type something here...'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className='bg-muted/50'
          />
          <Button size='icon' className='text-primary' onClick={handleSendMessage}>
            <Send className='h-5 w-5 fill-primary' />
          </Button>
        </div>
      </div>

      {/* Desktop view */}
      <div className='hidden md:flex flex-row h-full w-full gap-4'>
        {/* Connection list */}
        <div className='w-80 bg-background flex-shrink-0 rounded-lg border-2 border-primary'>
          <div className='p-4'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <Input placeholder='Search connection' className='pl-9 bg-muted/50' />
            </div>
          </div>
          <div className='overflow-auto h-[calc(100%-72px)]'>
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className={cn(
                  'flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer mx-2 my-1 rounded-lg bg-muted/30',
                  selectedContact?.id === contact.id && 'bg-muted',
                )}
                onClick={() => setSelectedContact(contact)}
              >
                <Avatar className='h-10 w-10'>
                  <AvatarImage src={contact.avatar} />
                  <AvatarFallback className='bg-muted'>
                    {contact.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div className='flex-1 min-w-0'>
                  <div className='flex justify-between items-center'>
                    <p className='font-medium text-sm truncate'>{contact.name}</p>
                    <span className='text-xs text-muted-foreground'>{contact.timestamp || contact.date}</span>
                  </div>
                  {contact.lastMessage && (
                    <p className='text-xs text-muted-foreground truncate'>{contact.lastMessage}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className='flex-1 flex flex-col rounded-lg border-2 border-primary'>
          {/* Chat header */}
          <div className='p-3 flex items-center justify-between border-b border-border'>
            <div className='flex items-center gap-3'>
              <Avatar className='h-8 w-8'>
                <AvatarImage src={selectedContact?.avatar} />
                <AvatarFallback className='bg-muted'>
                  {selectedContact
                    ? selectedContact.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                    : 'MJ'}
                </AvatarFallback>
              </Avatar>
              <span className='font-medium'>{selectedContact ? selectedContact.name : 'Mike Johnson'}</span>
            </div>
            <Button variant='ghost' size='icon'>
              <Info className='h-5 w-5' />
            </Button>
          </div>

          {/* Messages */}
          <div className='flex-1 overflow-auto p-4 flex flex-col gap-1'>
            {((selectedContact && messagesByContact[selectedContact.id]) || []).map((message) => (
              <div key={message.id} className={cn('flex', message.sender === 'user' ? 'justify-end' : 'justify-start')}>
                {message.sender === 'contact' && (
                  <Avatar className='h-8 w-8 mr-2 flex-shrink-0 self-end'>
                    <AvatarImage src={selectedContact?.avatar} />
                    <AvatarFallback className='bg-muted'>
                      {selectedContact?.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-[70%] rounded-lg px-4 py-2 text-sm',
                    message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted',
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>

          {/* Message input */}
          <div className='border-t border-border p-3 flex items-center gap-2'>
            <Input
              placeholder='Type something here...'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className='bg-muted/50'
            />
            <Button variant='ghost' size='icon' className='text-primary' onClick={handleSendMessage}>
              <Send className='h-5 w-5 fill-primary' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
