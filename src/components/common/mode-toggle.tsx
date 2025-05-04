import { Button } from '@/components/ui/button';

import { Moon, Sun } from 'lucide-react';
import { useModeAnimation } from 'react-theme-switch-animation';

export function ModeToggle() {
  const { ref, toggleSwitchTheme } = useModeAnimation();

  return (
    <Button variant='ghost' className='w-9 px-0' onClick={toggleSwitchTheme} ref={ref}>
      <Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
      <Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
      <span className='sr-only'>Toggle theme</span>
    </Button>
  );
}
