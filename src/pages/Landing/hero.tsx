import React from 'react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <section className='lg:h-[calc(100vh-57px)] grid lg:grid-cols-12 gap-12 container mx-auto overflow-hidden sm:overflow-visible px-8'>
      {/* Left Side */}
      <div className='lg:col-span-6 h-full grid items-center'>
        <div className='grid gap-8'>
          <div>
            <h1 className='mt-8 text-4xl lg:text-7xl uppercase font-black'>Welcome, friend</h1>
            <h2 className='text-xl xl:text-4xl'>Swap Skills - Grow Together</h2>
          </div>
          <p className='text-2xl max-w-[40ch]'>
            Whether you're a coder who wants to learn guitar, or a designer curious about cooking, connect with people
            who have the skills you're looking for — and share what you know in return.
          </p>
          <Link
            to='#'
            className='w-max px-6 py-4 bg-primary text-primary-foreground rounded-full uppercase font-black cursor-pointer'
          >
            Start Swapping
          </Link>
        </div>
      </div>

      {/* Right Side */}
      <aside className='mt-12 lg:col-span-6'></aside>
    </section>
  );
};
export default Hero;
