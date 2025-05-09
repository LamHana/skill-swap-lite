import { ChatHeader } from './chatHeader';
import { ChatMessages } from './chatMessages';
import { ContactList } from './contactList';
import { MessageInput } from './messageInput';
import type { Contact, Message } from './types';

interface DesktopChatViewProps {
  selectedContact: Contact | null;
  contacts: Contact[];
  onSelectContact: (contact: Contact) => void;
  messages: Message[];
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  endRef: React.RefObject<HTMLDivElement>;
  inputRef: React.RefObject<HTMLInputElement>;
}

export function DesktopChatView({
  selectedContact,
  contacts,
  onSelectContact,
  messages,
  inputValue,
  onInputChange,
  onSend,
  onKeyDown,
  endRef,
  inputRef,
}: DesktopChatViewProps) {
  return (
    <div className='hidden md:flex flex-row h-full w-full gap-4'>
      <ContactList contacts={contacts} selectedId={selectedContact?.id} onSelect={onSelectContact} />

      <div className='flex-1 flex flex-col rounded-lg border-2 border-primary'>
        {selectedContact && (
          <>
            <ChatHeader contact={selectedContact} />
            <ChatMessages messages={messages} contact={selectedContact} endRef={endRef} />
            <MessageInput
              ref={inputRef}
              value={inputValue}
              onChange={onInputChange}
              onSend={onSend}
              onKeyDown={onKeyDown}
            />
          </>
        )}
      </div>
    </div>
  );
}
