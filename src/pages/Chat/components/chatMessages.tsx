// chatMessages.tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

import { Timestamp } from 'firebase/firestore';

import type { Contact, Message } from './types';

import './style.css';
import { useState } from 'react';

function formatTimestamp(ts: Timestamp) {
  const date = ts.toDate();
  const now = new Date();

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const showDate = date < startOfToday;
  let datePart = '';
  if (showDate) {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    datePart = `${d}/${m}/${y} `;
  }

  let h = date.getHours();
  const mnts = date.getMinutes();
  const ampm = h >= 12 ? 'pm' : 'am';
  h = h % 12 || 12;
  const mins = mnts < 10 ? `0${mnts}` : mnts;

  return `${datePart}${h}:${mins}${ampm}`;
}

export function ChatMessages({
  messages,
  contact,
  endRef,
}: {
  messages: Message[];
  contact: Contact;
  endRef: React.RefObject<HTMLDivElement>;
}) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className='chat-scrollbar flex-1 overflow-auto p-4 flex flex-col'>
      {messages.map((message) => (
        <div
          key={message.id}
          onClick={() => toggle(message.id)}
          className={cn(
            'flex items-end mb-2 cursor-pointer',
            message.sender === 'user' ? 'justify-end' : 'justify-start',
          )}
        >
          {message.sender === 'contact' && (
            <Avatar className='h-8 w-8 mr-2 flex-shrink-0'>
              <AvatarImage src={contact.avatar} />
              <AvatarFallback className='bg-muted'>
                {contact.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
          )}

          <div
            className={cn(
              'flex flex-col gap-1 max-w-[70%] rounded-xl p-3',
              message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
            )}
          >
            <p className='break-all whitespace-pre-wrap'>{message.content}</p>
            {expanded.has(message.id) && (
              <span className={cn('text-[0.65rem] opacity-75', message.sender === 'user' ? 'self-end' : 'self-start')}>
                {' '}
                {formatTimestamp(message.timestamp)}
              </span>
            )}
          </div>
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
}
