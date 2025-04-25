import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroCard from './hero-card';
import { HERO_CARD_INFO, HeroCardInfoType } from './constants';
import { motion, useMotionValue, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';

const Hero: React.FC = () => {
  const [cards, setCards] = useState<HeroCardInfoType[]>(HERO_CARD_INFO);

  const containerRef = useRef(null);
  const xMotionValues = useRef(cards.map((_, index) => useMotionValue(index * 80)));
  const scaleMotionValues = useRef(cards.map((_, index) => useMotionValue(1 - index * 0.1)));
  const initialRotateValues = useRef(cards.map((_, index) => (-1) ** (index + 1) * 3));
  const rotateMotionValues = useRef(initialRotateValues.current.map((val) => useMotionValue(val)));

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end start'],
  });

  useMotionValueEvent(scrollYProgress, 'change', () => {
    const progress = scrollYProgress.get();

    rotateMotionValues.current.forEach((rotateVal, index) => {
      const initial = initialRotateValues.current[index];
      const target = initial > 0 ? -3 : 3;

      const newRotate = initial + progress * (target - initial);
      rotateVal.set(newRotate);
    });
  });

  const handleDragEnd = () => {
    const draggedX = xMotionValues.current[0].get();
    if (draggedX < -50) {
      setCards((prev) => {
        const [first, ...rest] = prev;
        return [...rest, first];
      });
      xMotionValues.current.push(xMotionValues.current.shift()!);
      scaleMotionValues.current.push(scaleMotionValues.current.shift()!);
      rotateMotionValues.current.push(rotateMotionValues.current.shift()!);
    }
  };

  return (
    <section className='lg:h-[calc(100vh-57px)] grid lg:grid-cols-12 gap-12 container mx-auto overflow-hidden px-8 place-items-center'>
      {/* Left Side */}
      <div className='mt-8 lg:mt-0 lg:col-span-5 h-full grid items-center'>
        <div className='grid gap-8'>
          <div>
            <h1 className='text-4xl lg:text-7xl uppercase font-black'>Welcome, friend</h1>
            <h2 className='text-xl xl:text-4xl'>Swap Skills - Grow Together</h2>
          </div>
          <p className='text-xl max-w-[40ch]'>
            Learn new skills and share what you know — whether you're a coder picking up guitar or a designer curious
            about cooking.
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
      <aside ref={containerRef} className='my-12 lg:my-0 lg:col-span-7'>
        <div title='Swipe to see more' className='col-span-7 grid grid-cols-3 grid-rows-1 md:justify-items-center'>
          {cards.map((info, index) => {
            const draggable = index === 0;
            const zIndex = cards.length - 1 - index;
            const x = xMotionValues.current[index];

            // Scale
            const scaleLevels = [1, 0.9, 0.8];
            const baseScale = scaleLevels[index] ?? 0.8;
            const scale = useTransform(
              xMotionValues.current[0],
              [-120, 0],
              baseScale < 1 ? [baseScale + 0.1, baseScale] : [1, 1],
            );
            scaleMotionValues.current[index].set(scale.get());

            // Rotate
            const rotate = rotateMotionValues.current[index];

            return (
              <motion.div
                style={{
                  gridArea: '1 / 1 / auto / 4',
                  zIndex,
                  x,
                  scale,
                  rotate,
                }}
                animate={{ x: index * 80, scale: 1 - index * 0.1, rotate: (-1) ** (index + 1) * 3 }}
                transition={{ duration: 0.5 }}
                drag={draggable && 'x'}
                dragListener={draggable}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.35}
                onDragEnd={handleDragEnd}
                className={`${draggable && 'cursor-grab active:cursor-grabbing'}`}
                key={info.id}
              >
                <HeroCard info={info} />
              </motion.div>
            );
          })}
        </div>
      </aside>
    </section>
  );
};
export default Hero;
