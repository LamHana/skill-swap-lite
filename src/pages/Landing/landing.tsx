import Contributors from './contributors';
import Features from './features';
import Hero from './hero';
import Marquee from './marquee';
import Steps from './steps';

const Landing: React.FC = () => {
  return (
    <div>
      <Hero />
      <Marquee />
      <Features />
      <Steps />
      <Contributors />
    </div>
  );
};
export default Landing;
