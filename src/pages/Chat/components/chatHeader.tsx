import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { ArrowLeft, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import type { Contact } from './types';

export function ChatHeader({ contact, onBack }: { contact: Contact; onBack?: () => void }) {
  const navigate = useNavigate();
  return (
    <div className='p-3 flex items-center justify-between border-b border-border'>
      <div className='flex items-center gap-3 z-60'>
        {onBack && (
          <Button variant='ghost' size='icon' onClick={onBack}>
            <ArrowLeft className='h-5 w-5' />
          </Button>
        )}
        <Avatar className='h-8 w-8'>
          <AvatarImage src={contact?.avatar} />
          <AvatarFallback className='bg-muted'>
            {contact?.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </AvatarFallback>
        </Avatar>
        <span className='font-medium'>{contact?.name}</span>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant='ghost' size='icon' onClick={() => navigate(`/${contact.id}`)}>
              <Info className='h-5 w-5' />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View profile</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
