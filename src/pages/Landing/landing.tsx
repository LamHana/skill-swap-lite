import Contributors from './contributors';
import Features from './features';
import Hero from './hero';
import Steps from './steps';

const Landing: React.FC = () => {
  return (
    <div>
      <Hero />
      <Features />
      <Steps />
      <Contributors />
    </div>
  );
};
export default Landing;
