import { Button } from '@/components/ui/button';
import { config } from '@/config/app';
import SideBar from '@/pages/EditProfile/components/side-bar';

import { ChevronLeft } from 'lucide-react';
import { Outlet } from 'react-router-dom';

const SettingLayout = () => {
  const sidebarNavItems = [
    {
      title: 'Profile',
      href: `${config.routes.setting}${config.routes.editProfile}`,
    },
    {
      title: 'Account',
      href: '/examples/forms/account',
    },
    {
      title: 'Appearance',
      href: '/examples/forms/appearance',
    },
    {
      title: 'Notifications',
      href: '/examples/forms/notifications',
    },
    {
      title: 'Display',
      href: '/examples/forms/display',
    },
  ];

  return (
    <div className='flex flex-col space-y-8 mt-10 mb-20 md:flex-row xl:space-x-12 lxl:space-y-0'>
      <aside className='lg:w-1/5'>
        <Button variant={'ghost'} className='mb-4 xl:mb-6'>
          <ChevronLeft /> Back
        </Button>
        <SideBar items={sidebarNavItems} />
      </aside>
      <div className='flex-1 lg:max-w-2xl'>
        <Outlet />
      </div>
    </div>
  );
};

export default SettingLayout;
