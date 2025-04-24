import { CircleAlert, Home, LucideIcon, MessageCircle } from 'lucide-react';

type MenuItemType = {
  title: string;
  url: string;
  external?: string;
  icon?: LucideIcon;
  items?: MenuItemType[];
};
type MenuType = MenuItemType[];

export const mainMenu: MenuType = [
  {
    title: 'Home',
    url: '/',
    icon: Home,
  },
  {
    title: 'Error',
    url: '/404',
    icon: CircleAlert,
  },
  {
    title: 'Message',
    url: '/chat',
    icon: MessageCircle,
  },
];
