import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { User } from '@/types/user.type';
import { MoreHorizontal } from 'lucide-react';

const DetailCard = ({ user }: { user: User }) => {
  let matchPercentage = 100;

  return (
    <Card className='w-full border-2 border-secondary-foreground rounded-xl p-4 relative overflow-hidden'>
      <div className='absolute top-0 right-0 bg-primary text-white font-bold py-2 px-4 rounded-tr-xl rounded-bl-xl -translate-y-1 translate-x-1'>
        {matchPercentage}%
      </div>

      <div className='flex flex-col md:flex-row gap-4'>
        <Avatar className='h-[80px] w-[80px] md:h-[100px] md:w-[100px] rounded-md border'>
          <AvatarImage src={user.photoURL || '/placeholder.svg'} alt={user.fullName} />
          <AvatarFallback className='rounded-md text-xs'>
            {user.photoURL
              ? '100 x 100'
              : user.fullName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
          </AvatarFallback>
        </Avatar>

        <div className='flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-4'>
          <div className='flex-1'>
            <CardHeader className='p-0 pb-2'>
              <h2 className='text-lg md:text-xl font-bold'>{user.fullName}</h2>
            </CardHeader>

            <CardContent className='p-0 space-y-4'>
              <p className='text-sm md:text-lg'>{user.bio}</p>

              <div className='flex flex-col md:flex-row gap-6 items-start md:items-center'>
                <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 items-start md:items-center'>
                  <p className='font-bold text-sm md:text-lg'>Teaching</p>
                  <div className='flex flex-row gap-2 items-center'>
                    {user.teach.slice(0, 2).map((skill) => (
                      <Badge
                        key={skill}
                        variant='outline'
                        className='rounded-full px-4 py-1 text-xs md:text-base border-secondary-foreground'
                      >
                        {skill}
                      </Badge>
                    ))}

                    {user.teach.length > 2 && (
                      <p className='text-xs md:text-base font-semibold text-zinc-500'>+{user.teach.length - 2}</p>
                    )}
                  </div>
                </div>

                <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 items-start md:items-center'>
                  <p className='font-bold text-sm md:text-lg'>Learning</p>
                  <div className='flex flex-row gap-2 items-center'>
                    {user.learn.slice(0, 2).map((skill) => (
                      <Badge
                        key={skill}
                        variant='outline'
                        className='rounded-full px-4 py-1 text-xs md:text-base border-secondary-foreground'
                      >
                        {skill}
                      </Badge>
                    ))}

                    {user.learn.length > 2 && (
                      <p className='text-xs md:text-base font-semibold text-zinc-500'>+{user.learn.length - 2}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </div>

          <div className='flex flex-row gap-2 items-end'>
            <Button
              variant='outline'
              className='rounded-md px-6 md:px-10 text-sm md:text-base border-primary text-primary'
            >
              Message
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant='ghost' size='icon' className='rounded-full'>
                  <MoreHorizontal className='h-5 w-5' />
                  <span className='sr-only'>More options</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-fit p-1' side='bottom' align='end' alignOffset={0} sideOffset={5}>
                <Button variant='ghost' className='flex w-fit rounded-md text-sm md:text-base'>
                  Remove connection
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DetailCard;
