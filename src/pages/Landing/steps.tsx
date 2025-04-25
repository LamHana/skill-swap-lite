import StepCard from './step-card';
import { STEPS } from './constants';

const Steps: React.FC = () => {
  return (
    <section className='container mx-auto px-8 mt-20 mb-40'>
      <header className='text-center mx-auto max-w-[45ch]'>
        <h3 className='font-black text-4xl lg:text-6xl xl:text-7xl uppercase mb-8'>As Easy As 1-2-3</h3>
        <h4 className='text-xl max-w-[40ch] mx-auto'>
          SkillSwap simplifies skill trading to just three easy steps — no payments, just fair value exchanges between
          people.
        </h4>
      </header>
      <div className='grid gap-4 grid-cols-1 lg:grid-cols-3 mt-12'>
        {STEPS.map((step) => (
          <StepCard key={step.title} title={step.title} subtitle={step.subtitle} Icon={step.Icon} />
        ))}
      </div>
    </section>
  );
};
export default Steps;
