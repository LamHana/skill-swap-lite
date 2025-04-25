import { HeroCardInfoType } from './constants';

type HeroCardProps = {
  info: HeroCardInfoType;
};

const HeroCard: React.FC<HeroCardProps> = ({ info }) => {
  return (
    <div
      className='scale-80 md:scale-100 p-4 md:p-10 pt-0 rounded-2xl max-w-[420px] border-2 border-black text-[#231f20]'
      style={{
        filter: 'drop-shadow(rgb(0, 0, 0) 7px 5px 0px)',
        background: info.background,
      }}
    >
      {/* Header */}
      <header className='relative mb-8'>
        <figure className='mb-4' style={{ color: info.colorOval }}>
          <svg viewBox='0 0 370 383'>
            <defs>
              <image width='380' id={info.avatar} href={info.avatar} x='-20' />
              <clipPath id='avatar-clip'>
                <path d='M346.508 100.318C386.726 154.262 345.448 253.074 254.311 321.021C163.175 388.968 56.6908 400.32 16.4728 346.376C-23.7452 292.432 56.9316 76.6467 139.357 25.4459C230.494 -42.5011 306.29 46.3742 346.508 100.318Z' />
              </clipPath>
              <symbol id='oval' transform='scale(.8)'>
                <path
                  d='M353.721 104.805C394.031 158.873 352.658 257.913 261.311 326.017C169.965 394.121 56.7836 400.445 16.4728 346.376C-23.838 292.308 23.9863 198.322 115.333 130.218C206.68 62.1144 313.41 50.7364 353.721 104.805Z'
                  fill='black'
                />
                <path
                  d='M346.72 99.805C387.031 153.873 345.658 252.914 254.311 321.017C162.964 389.121 56.2348 400.499 15.924 346.431C-24.3867 292.362 16.9862 193.322 108.333 125.218C199.68 57.1145 306.41 45.7366 346.72 99.805Z'
                  fill='currentColor'
                />
              </symbol>
            </defs>

            <use href='#oval' stroke='#000' strokeWidth='1' />
            <use href={`#${info.avatar}`} clipPath='url(#avatar-clip)' />
          </svg>
        </figure>

        <div className='absolute bottom-[-20px] right-[-24px] rotate-2'>
          <div
            className='rounded-3xl border-2 border-black py-2 md:py-3 px-3 md:px-5 min-w-[180px]'
            style={{
              filter: 'drop-shadow(3px 4px 0px rgb(0, 0, 0))',
              background: '#f9f4da',
            }}
          >
            <h5 className='font-bold'>{info.name}</h5>
            <p>{info.skill}</p>
            <div className='inline-flex gap-1 mt-2'>
              {Array.from({ length: info.stars }).map((_, i) => (
                <img key={i} src='/star.svg' alt='star' />
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Description */}
      <p className='text-sm md:text-base'>{info.desc}</p>
    </div>
  );
};
export default HeroCard;
