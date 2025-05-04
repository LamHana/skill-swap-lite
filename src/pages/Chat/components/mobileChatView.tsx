import { cn } from '@/lib/utils';

import { ChatHeader } from './chatHeader';
import { ChatMessages } from './chatMessages';
import { ContactList } from './contactList';
import { MessageInput } from './messageInput';
import type { Contact, Message } from './types';

type MobileChatViewProps = {
  selectedContact: Contact | null;
  contacts: Contact[];
  onSelectContact: (contact: Contact) => void;
  onBack: () => void;
  messages: Message[];
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  endRef: React.RefObject<HTMLDivElement>;
  inputRef: React.RefObject<HTMLInputElement>;
};

export function MobileChatView({
  selectedContact,
  contacts,
  onSelectContact,
  onBack,
  messages,
  inputValue,
  onInputChange,
  onSend,
  onKeyDown,
  endRef,
  inputRef,
}: MobileChatViewProps) {
  return (
    <>
      {/* Contact List - Only show when no contact selected */}
      <div
        className={cn(
          'w-full h-full bg-background rounded-lg border-2 border-primary md:hidden',
          selectedContact ? 'hidden' : 'block',
        )}
      >
        <ContactList contacts={contacts} selectedId={selectedContact?.id} onSelect={onSelectContact} />
      </div>

      {/* Chat Area - Only show when contact selected */}
      {selectedContact && (
        <div className='w-full h-full flex flex-col rounded-lg border-2 border-primary md:hidden overflow-hidden'>
          <ChatHeader contact={selectedContact} onBack={onBack} />
          <ChatMessages messages={messages} contact={selectedContact} endRef={endRef} />
          <MessageInput
            ref={inputRef}
            value={inputValue}
            onChange={onInputChange}
            onSend={onSend}
            onKeyDown={onKeyDown}
          />
        </div>
      )}
    </>
  );
}
