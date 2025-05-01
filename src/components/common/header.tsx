import { AppSidebar } from '@/components/common/app-sidebar';
import { ModeToggle } from '@/components/common/mode-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { config } from '@/config/app';
import { mainMenu } from '@/config/menu';
import { useAuth } from '@/hooks';
import useSignOut from '@/hooks/useSignOut';
import { cn } from '@/lib/utils';

import { ChevronDown } from 'lucide-react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';

import Logo from './logo';
const Header = ({ isAuthLayout = false }: { isAuthLayout?: boolean }) => {
  const location = useLocation();
  const { user } = useAuth();
  const { onSignOut } = useSignOut();
  const navigate = useNavigate();

  const onClickProfile = () => {
    navigate(config.routes.profile);
  };

  return (
    <header className='bg-background sticky top-0 z-50 border-b'>
      <div className='w-full ~max-w-7xl mx-auto flex items-center justify-between gap-2 h-14 px-4 md:px-8'>
        <div className='flex items-center gap-2 md:gap-0'>
          <AppSidebar />
          <Link to='/'>
            <Logo />
          </Link>
        </div>

        <div className={cn('ml-4 flex items-center justify-between', !isAuthLayout && 'flex-1')}>
          {!isAuthLayout && (
            <div className='flex-1'>
              <nav className='hidden md:flex gap-1'>
                {mainMenu.map((item, index) =>
                  item.items && item.items.length > 0 ? (
                    <DropdownMenu key={index}>
                      <DropdownMenuTrigger className='focus-visible:outline-none'>
                        <NavLink
                          key={index}
                          to={item.url}
                          className={({ isActive }) =>
                            cn(
                              'flex items-center gap-2 overflow-hidden rounded-md p-2.5 text-left text-sm outline-none transition-[width,height,padding] hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 active:bg-accent active:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>svg]:size-4',
                              'h-8 text-sm hover:bg-accent hover:text-accent-foreground',
                              isActive ? 'text-foreground bg-accent' : 'text-foreground/70',
                            )
                          }
                        >
                          {item.icon && <item.icon />}
                          <span className='font-medium'>{item.title}</span>
                          <ChevronDown className='!size-3 -ml-1' />
                        </NavLink>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='start' className='min-w-56'>
                        {item.items.map((subItem, index) => (
                          <DropdownMenuItem key={index} asChild>
                            <NavLink
                              to={subItem.url}
                              className={cn('cursor-pointer', subItem.url === location.pathname && 'bg-muted')}
                            >
                              {subItem.title}
                            </NavLink>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <NavLink
                      key={index}
                      to={item.url}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-2 overflow-hidden rounded-md p-2.5 text-left text-sm outline-none transition-[width,height,padding] hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 active:bg-accent active:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>svg]:size-4',
                          'h-8 text-sm hover:bg-accent hover:text-accent-foreground',
                          isActive ? 'text-foreground bg-accent' : 'text-foreground/70',
                        )
                      }
                    >
                      {item.icon && <item.icon />}
                      <span className='font-medium'>{item.title}</span>
                    </NavLink>
                  ),
                )}
              </nav>
            </div>
          )}
          <nav className='flex gap-1'>
            <ModeToggle />
            {!user && (
              <Button className='relative bg-primary text-primary-foreground cursor-pointer ml-2'>
                <Link to='/login'>Login</Link>
              </Button>
            )}
            {!isAuthLayout && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='default' className='relative h-8 w-8 rounded-full cursor-pointer ml-2'>
                    <Avatar className='h-8 w-8'>
                      <AvatarImage src={user?.photoURL || ''} alt='shadcn' />
                      <AvatarFallback className='bg-primary text-primary-foreground'>
                        {user?.fullName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56' align='end' forceMount>
                  <DropdownMenuLabel className='font-normal'>
                    <div className='flex flex-col space-y-1'>
                      <p className='text-sm font-medium leading-none'>{user?.fullName}</p>
                      <p className='text-xs leading-none text-muted-foreground'>{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onClickProfile}>Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={onSignOut}>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
