import { StepCardType } from './constants';

type StepCardProps = StepCardType;

const StepCard: React.FC<StepCardProps> = ({ title, subtitle, Icon }) => {
  return (
    <div className='w-full border-[1px] border-slate-300 p-4 rounded-lg relative overflow-hidden group'>
      <div className='absolute inset-0 bg-primary translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-500' />
      <Icon className='mb-2 text-2xl text-primary group-hover:text-white transition-colors relative z-10 duration-300' />
      <h3 className='font-medium text-lg group-hover:text-white relative z-10 duration-300'>{title}</h3>
      <p className='group-hover:text-violet-200 relative z-10 duration-300'>{subtitle}</p>
    </div>
  );
};
export default StepCard;
