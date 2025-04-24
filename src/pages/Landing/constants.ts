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
