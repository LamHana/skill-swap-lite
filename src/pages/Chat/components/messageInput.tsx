import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Send } from 'lucide-react';
import React from 'react';
export interface MessageInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export const MessageInput = React.forwardRef<HTMLInputElement, MessageInputProps>(
  ({ value, onChange, onSend, onKeyDown }, ref) => {
    return (
      <div className='border-t border-border rounded-lg p-3 flex items-center gap-2 mt-auto sticky bottom-0'>
        <Input
          ref={ref}
          placeholder='Type something here...'
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          className='bg-muted/50'
        />
        <Button variant='ghost' size='icon' className='text-primary' onClick={onSend}>
          <Send className='h-5 w-5 fill-primary' />
        </Button>
      </div>
    );
  },
);
MessageInput.displayName = 'MessageInput';
