import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import type { Contact } from './types';

// Utility to remove diacritics for accent-insensitive search
function normalizeText(text: string) {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

export function ContactList({
  contacts,
  selectedId,
  onSelect,
}: {
  contacts: Contact[];
  selectedId?: string;
  onSelect: (contact: Contact) => void;
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContacts = useMemo(() => {
    const normalizedTerm = normalizeText(searchTerm.trim());
    if (!normalizedTerm) return contacts;
    return contacts.filter((contact) => normalizeText(contact.name).includes(normalizedTerm));
  }, [contacts, searchTerm]);

  return (
    <div className='w-full md:w-80 bg-background flex-shrink-0 rounded-lg md:border-2 md:border-primary'>
      <div className='p-4'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            placeholder='Search connection'
            className='pl-9 bg-muted/50'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className='overflow-auto flex-1'>
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            className={cn(
              'flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer mx-2 my-1 rounded-lg bg-muted/30',
              selectedId === contact.id && 'bg-muted',
            )}
            onClick={() => onSelect(contact)}
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
  );
}
