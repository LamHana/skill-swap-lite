import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactNode } from 'react';

export interface PreviewCardProps {
  id: string;
  name: string;
  percent: number;
  teach: string[];
  learn: string[];
  photoUrl?: string;
  button: ReactNode;
  className?: string;
}

export default function PreviewCard({
  id,
  name,
  percent,
  teach,
  learn,
  photoUrl,
  button,
  className = '',
}: PreviewCardProps) {
  const getDisplayData = (): { teachDisplay: string[]; learnDisplay: string[] } => {
    const teachDisplay: string[] = teach.length <= 2 ? teach : [teach[0], teach[1], '+' + (teach.length - 2)];
    const learnDisplay: string[] = learn.length <= 2 ? learn : [learn[0], learn[1], '+' + (learn.length - 2)];
    return { teachDisplay, learnDisplay };
  };

  const { teachDisplay, learnDisplay } = getDisplayData();

  return (
    <Card
      className={`w-full md:max-w-[280px] md:max-h-[240px] gap-3 relative mx-auto overflow-hidden ${className}`}
      key={id}
    >
      <div className='absolute top-0 right-0 bg-primary text-white font-bold py-2 px-4 rounded-tr-lg rounded-bl-lg'>
        {percent}%
      </div>
      <CardHeader>
        <div className='flex items-center gap-6'>
          <div className='rounded-lg'>
            <Avatar className='w-[70px] h-[70px] !rounded-lg border-2 border-gray-200'>
              <AvatarImage className='object-cover' src={photoUrl} alt={name} />
              <AvatarFallback className='!rounded-lg'>{name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className='text-lg'>{name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className='flex flex-col gap-1'>
        <div className='flex items-center gap-1 '>
          <span className='font-bold text-sm'>Teaching</span>
          <div className='flex gap-1'>
            {teachDisplay.map((item, index) => (
              <span
                key={index}
                className={index !== 2 ? 'rounded-full px-3 py-1 border border-gray-300 text-xs' : 'py-1 text-xs'}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className='flex items-center gap-1 mt-2'>
          <span className='font-bold text-sm'>Learning</span>
          <div className='flex gap-1'>
            {learnDisplay.map((item, index) => (
              <span
                key={index}
                className={index !== 2 ? 'rounded-full px-3 py-1 border border-gray-300 text-xs' : 'py-1 text-xs'}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>{button}</CardFooter>
    </Card>
  );
}
