import { ArrowLeftRight, LucideIcon, Search, UserRoundPlus } from 'lucide-react';

export type HeroCardInfoType = {
  id: number;
  avatar: string;
  name: string;
  skill: string;
  stars: number;
  desc: string;
  background: string;
  colorOval: string;
};

export type FeaturesType = {
  title: string;
  desc: string;
  background: string;
};

export type StepCardType = {
  title: string;
  subtitle: string;
  Icon: LucideIcon;
};

export type ContributorsType = { name: string; github: string };

export const HERO_CARD_INFO: HeroCardInfoType[] = [
  {
    id: 1,
    avatar: '/clarissa-profile.webp',
    name: 'Clarissa Gayton',
    skill: 'Modern JavaScript',
    stars: 5,
    desc: '“What a gem! I’ve just completed a bootcamp and have been studying on my own for quite some time now. I spent a few weeks doing research on the best online courses ... and I’m sad to say I didn’t find Tyler McGinnis earlier.”',
    background: '#ed203d',
    colorOval: '#f9f4da',
  },
  {
    id: 2,
    avatar: '/malak-profile.webp',
    name: 'Malak Joseph',
    skill: 'TypeScript',
    stars: 5,
    desc: '“I hated TypeScript when I dealt with it at work because I didn’t know how to use it and only produced red lines! Now, can’t say I’m an expert but an app without TS is full of distractions and more complicated!”',
    background: '#fcba28',
    colorOval: '#7b5ea7',
  },
  {
    id: 3,
    avatar: '/kellee-profile.webp',
    name: 'Kellee Martins',
    skill: 'Advanced JavaScript',
    stars: 5,
    desc: '“Mind blown. Every other moment a light bulb was going off in my head. Without a traditional CS background sometimes it can be hard to wrap my head around ‘why’ things are done. This really bridged some huge gaps for me. Fabulous, well done.”',
    background: '#0ba95b',
    colorOval: '#f38ba3',
  },
];

export const FEATURES: FeaturesType[] = [
  {
    title: 'No Money Required',
    desc: 'Exchange skills directly without any financial transactions',
    background: '#0ba95b',
  },
  {
    title: 'Equal Value Exchange',
    desc: 'Trade your expertise for services of equivalent value',
    background: '#ed203d',
  },
  {
    title: 'Trust Score System',
    desc: 'Trade confidently with verified users and their reputation scores',
    background: '#fcba28',
  },
  {
    title: 'AI-Powered Matching (Coming Soon)',
    desc: 'Get matched with traders who need your skills and have what you need',
    background: '#f38ba3',
  },
];

export const STEPS: StepCardType[] = [
  {
    title: '1. Create Your Profile',
    subtitle: 'Sign up and list skills you can offer and skills you want to receive from others.',
    Icon: UserRoundPlus,
  },
  {
    title: '2. Find Perfect Matches',
    subtitle: 'Our AI instantly matches you with users who need your skills and offer what you want.',
    Icon: Search,
  },
  {
    title: '3. Exchange Skills',
    subtitle: 'Chat with your matches, arrange the details, and execute your skill swap - no money needed!',
    Icon: ArrowLeftRight,
  },
];

export const CONTRIBUTORS: ContributorsType[] = [
  {
    name: 'Nhi Nguyen',
    github: 'https://github.com/nhinbm',
  },
  {
    name: 'Luong Bui',
    github: 'https://github.com/LuongBui1311',
  },
  {
    name: 'Han Lam',
    github: 'https://github.com/LamHana',
  },
  {
    name: 'Thao Dao',
    github: 'https://github.com/DaoHuongThao',
  },
  {
    name: 'My Nguyen',
    github: 'https://github.com/mirumiru215',
  },
  {
    name: 'Anh Nguyen',
    github: 'https://github.com/alicee-19',
  },
];
