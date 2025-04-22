import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface PreviewCardProps {
  name: string;
  percent: number;
  teaching: string[];
  learning: string[];
  image: string;
}

export function PreviewCard({ name, percent, teaching, learning, image }: PreviewCardProps) {
  const getDisplayData = (): { teachingDisplay: string[]; learningDisplay: string[] } => {
    const teachingDisplay: string[] =
      teaching.length <= 2 ? teaching : [teaching[0], teaching[1], '+' + (teaching.length - 2)];
    const learningDisplay: string[] =
      learning.length <= 2 ? learning : [learning[0], learning[1], '+' + (learning.length - 2)];
    return { teachingDisplay, learningDisplay };
  };

  const { teachingDisplay, learningDisplay } = getDisplayData();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    console.log('Button clicked');
  };

  return (
    <Card className='w-full md:w-[400px] md:h-[315px] relative overflow-hidden'>
      <div className='absolute top-0 right-0 bg-primary text-white font-bold py-2 px-4 rounded-tr-lg rounded-bl-lg'>
        {percent}%
      </div>
      <CardHeader>
        <div className='flex items-center gap-6'>
          <div className='rounded-lg'>
            <Avatar className='w-[100px] h-[100px] !rounded-lg border-2 border-gray-200'>
              <AvatarImage className='object-cover' src={image} alt={name} />
              <AvatarFallback className='!rounded-lg'>{name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className='text-xl'>{name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className='flex flex-col gap-2'>
        <div className='flex items-center gap-3 '>
          <span className='font-bold text-lg'>Teaching</span>
          <div className='flex gap-2'>
            {teachingDisplay.map((item, index) => (
              <span key={index} className={index !== 2 ? 'rounded-full px-3 py-1 border border-gray-300' : 'py-1'}>
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className='flex items-center gap-3 mt-2'>
          <span className='font-bold text-lg'>Learning</span>
          <div className='flex gap-2'>
            {learningDisplay.map((item, index) => (
              <span key={index} className={index !== 2 ? 'rounded-full px-3 py-1 border border-gray-300' : ''}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className='w-[100%]' onClick={handleClick}>
          Connect
        </Button>
      </CardFooter>
    </Card>
  );
}
