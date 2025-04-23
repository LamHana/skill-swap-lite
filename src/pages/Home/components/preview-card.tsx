import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export interface PreviewCardProps {
  id: number;
  name: string;
  percent: number;
  teach: string[];
  learn: string[];
  photoUrl?: string;
}

export default function PreviewCard({ id, name, percent, teach, learn, photoUrl }: PreviewCardProps) {
  const getDisplayData = (): { teachDisplay: string[]; learnDisplay: string[] } => {
    const teachDisplay: string[] = teach.length <= 2 ? teach : [teach[0], teach[1], '+' + (teach.length - 2)];
    const learnDisplay: string[] = learn.length <= 2 ? learn : [learn[0], learn[1], '+' + (learn.length - 2)];
    return { teachDisplay, learnDisplay };
  };

  const { teachDisplay, learnDisplay } = getDisplayData();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    console.log('Button clicked');
  };

  return (
    <Card className='w-full md:max-w-[400px] md:max-h-[315px] relative mx-auto overflow-hidden' key={id}>
      <div className='absolute top-0 right-0 bg-primary text-white font-bold py-2 px-4 rounded-tr-lg rounded-bl-lg'>
        {percent}%
      </div>
      <CardHeader>
        <div className='flex items-center gap-6'>
          <div className='rounded-lg'>
            <Avatar className='w-[100px] h-[100px] !rounded-lg border-2 border-gray-200'>
              <AvatarImage className='object-cover' src={photoUrl} alt={name} />
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
            {teachDisplay.map((item, index) => (
              <span key={index} className={index !== 2 ? 'rounded-full px-3 py-1 border border-gray-300' : 'py-1'}>
                {item}  
              </span>
            ))}
          </div>
        </div>
        <div className='flex items-center gap-3 mt-2'>
          <span className='font-bold text-lg'>Learning</span>
          <div className='flex gap-2'>
            {learnDisplay.map((item, index) => (
              <span key={index} className={index !== 2 ? 'rounded-full px-3 py-1 border border-gray-300' : 'py-1'}>
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
