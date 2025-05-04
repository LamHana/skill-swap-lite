import { motion } from 'framer-motion';

import { FEATURES } from './constants';

const Features: React.FC = () => {
  return (
    <section className='container mx-auto px-8 mt-20 mb-40'>
      <header className='text-center mx-auto max-w-[50ch]'>
        <h3 className='font-black text-4xl lg:text-6xl xl:text-7xl uppercase mb-8'>Why skill swap lite?</h3>
        <h4 className='text-xl max-w-[40ch] mx-auto'>
          See how our innovative barter marketplace compares to traditional service platforms.
        </h4>
      </header>
      <div className='grid md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-8 mt-12 text-[#231f20]'>
        {FEATURES.map((info) => (
          <motion.article
            className='rounded-lg p-6 md:p-8 flex flex-col justify-between'
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5 }}
            key={info.title}
            style={{ filter: 'drop-shadow(8px 8px 0px #231f20)', background: info.background }}
          >
            <h5 className='uppercase font-bold'>{info.title}</h5>
            <p className='my-1'>{info.desc}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
};
export default Features;
