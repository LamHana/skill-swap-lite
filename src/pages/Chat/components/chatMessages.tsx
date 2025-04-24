import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { Contact, Message } from './types';

export function ChatMessages({
  messages,
  contact,
  endRef,
}: {
  messages: Message[];
  contact: Contact;
  endRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div className='flex-1 overflow-auto p-4 flex flex-col gap-1'>
      {messages.map((message) => (
        <div key={message.id} className={cn('flex', message.sender === 'user' ? 'justify-end' : 'justify-start')}>
          {message.sender === 'contact' && (
            <Avatar className='h-8 w-8 mr-2 flex-shrink-0 self-end'>
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
              'max-w-[70%] rounded-lg px-4 py-2 text-sm',
              message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted',
            )}
          >
            {message.content}
          </div>
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
}
