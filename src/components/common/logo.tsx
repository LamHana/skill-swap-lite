import { config } from '@/config/app';

const Logo = () => {
  return (
    <div className='flex items-center gap-2'>
      <svg viewBox='0 0 24 24' className='size-6 fill-gray-900 dark:fill-gray-50'>
        <rect x='2' y='2' width='20' height='20' rx='7' />
      </svg>
      <span className='font-semibold text-nowrap'>{config.name}</span>
    </div>
  );
};

export default Logo;
