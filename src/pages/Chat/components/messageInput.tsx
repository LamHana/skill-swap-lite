import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

export function MessageInput({
  value,
  onChange,
  onSend,
  onKeyDown,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}) {
  return (
    <div className='border-t border-border rounded-lg p-3 flex items-center gap-2 mt-auto sticky bottom-0'>
      <Input
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
}
