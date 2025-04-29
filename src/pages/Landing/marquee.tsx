import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { MARQUEE_LOGOS_BOTTOM, MARQUEE_LOGOS_TOP } from './constants';

interface TranslateWrapperProps {
  children: ReactNode;
  reverse?: boolean;
}

interface LogoItemProps {
  Icon: LucideIcon;
  name: string;
}

const TranslateWrapper: React.FC<TranslateWrapperProps> = ({ children, reverse }: TranslateWrapperProps) => {
  return (
    <motion.div
      initial={{ translateX: reverse ? '-100%' : '0%' }}
      animate={{ translateX: reverse ? '0%' : '-100%' }}
      transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
      className='flex px-2'
    >
      {children}
    </motion.div>
  );
};

const LogoItem: React.FC<LogoItemProps> = ({ Icon, name }: LogoItemProps) => {
  return (
    <span className='flex items-center justify-center gap-4 px-4 py-2 md:py-4'>
      <Icon className='text-2xl md:text-3xl text-primary' />
      <span className='whitespace-nowrap text-xl font-semibold uppercase md:text-2xl'>{name}</span>
    </span>
  );
};

const Marquee: React.FC = () => {
  return (
    <section className='relative -mt-2 -rotate-1 scale-[1.01] border-y-2'>
      <div className='relative z-0 flex overflow-hidden border-b-2'>
        <TranslateWrapper>
          {MARQUEE_LOGOS_TOP.map((logo) => (
            <LogoItem key={logo.id} Icon={logo.Icon} name={logo.name} />
          ))}
        </TranslateWrapper>
        <TranslateWrapper>
          {MARQUEE_LOGOS_TOP.map((logo) => (
            <LogoItem key={logo.id} Icon={logo.Icon} name={logo.name} />
          ))}
        </TranslateWrapper>
        <TranslateWrapper>
          {MARQUEE_LOGOS_TOP.map((logo) => (
            <LogoItem key={logo.id} Icon={logo.Icon} name={logo.name} />
          ))}
        </TranslateWrapper>
      </div>
      <div className='relative z-0 flex overflow-hidden'>
        <TranslateWrapper reverse>
          {MARQUEE_LOGOS_BOTTOM.map((logo) => (
            <LogoItem key={logo.id} Icon={logo.Icon} name={logo.name} />
          ))}
        </TranslateWrapper>
        <TranslateWrapper reverse>
          {MARQUEE_LOGOS_BOTTOM.map((logo) => (
            <LogoItem key={logo.id} Icon={logo.Icon} name={logo.name} />
          ))}
        </TranslateWrapper>
        <TranslateWrapper reverse>
          {MARQUEE_LOGOS_BOTTOM.map((logo) => (
            <LogoItem key={logo.id} Icon={logo.Icon} name={logo.name} />
          ))}
        </TranslateWrapper>
      </div>

      <div className='pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-32 bg-gradient-to-r from-white to-white/0 dark:from-black dark:to-black/0' />
      <div className='pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-32 bg-gradient-to-l from-white to-white/0 dark:from-black dark:to-black/0' />
    </section>
  );
};
export default Marquee;
