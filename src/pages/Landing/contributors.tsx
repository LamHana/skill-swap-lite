import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { CONTRIBUTORS } from './constants';

const Contributors: React.FC = () => {
  return (
    <section className='container mx-auto px-8 mt-20 mb-40'>
      <header className='text-center mx-auto max-w-[45ch]'>
        <h3 className='font-black text-4xl lg:text-6xl uppercase mb-8'>
          The <span className='text-primary relative'>SkillSwap</span> contributors
        </h3>
        <h4 className='text-xl max-w-[40ch] mx-auto'>
          Meet the passionate minds behind this project — creators, collaborators, and everyday heroes who made it all
          possible.
        </h4>
      </header>
      <div className='grid grid-cols-3 lg:grid-cols-6 gap-5 mt-12 mx-auto w-fit'>
        {CONTRIBUTORS.map((contributor) => {
          const name = contributor.name
            .split(' ')
            .map((word) => word[0]?.toUpperCase())
            .join('');
          return (
            <motion.div whileHover={{ scale: 1.2, transition: { duration: 0.5 } }}>
              <Link to={contributor.github} key={contributor.name}>
                <Avatar className='w-16 h-16'>
                  <AvatarFallback>{name}</AvatarFallback>
                </Avatar>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
export default Contributors;
