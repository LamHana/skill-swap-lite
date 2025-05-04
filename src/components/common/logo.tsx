import logo from '@/assets/images/logo.png';
import { config } from '@/config/app';

const Logo = () => {
  return (
    <div className='flex items-center gap-2'>
      <img src={logo} className='w-7' />
      <span className='font-semibold text-nowrap'>{config.name}</span>
    </div>
  );
};

export default Logo;
