import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { User } from '@/types/user.type';
import { MoreHorizontal } from 'lucide-react';
import React from 'react';

const DetailCard = ({ user }: { user: User }) => {
  let matchPercentage: number | null = null;

  return (
    <Card className='w-full max-w-4xl border rounded-xl p-4 relative'>
      <div className='absolute top-0 right-0 bg-primary text-white font-bold py-2 px-4 rounded-tr-lg rounded-bl-lg'>
        {matchPercentage}%
      </div>

      <div className='flex gap-4'>
        <Avatar className='h-[80px] w-[80px] rounded-md border'>
          <AvatarImage src={user.photoURL || '/placeholder.svg'} alt={user.name} />
          <AvatarFallback className='rounded-md text-xs'>
            {user.photoURL
              ? '100 x 100'
              : user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
          </AvatarFallback>
        </Avatar>

        <div className='flex-1'>
          <CardHeader className='p-0 pb-2'>
            <h2 className='text-xl font-bold'>{user.name}</h2>
          </CardHeader>

          <CardContent className='p-0 space-y-4'>
            <p className='text-sm'>{user.bio}</p>

            <div className='flex flex-wrap gap-6'>
              <div className='space-y-2'>
                <p className='font-bold'>Teaching</p>
                <div className='flex gap-2'>
                  {user.teach.map((skill) => (
                    <Badge key={skill} variant='outline' className='rounded-full px-4 py-1'>
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className='space-y-2'>
                <p className='font-bold'>Learning</p>
                <div className='flex gap-2'>
                  {user.learn.map((skill) => (
                    <Badge key={skill} variant='outline' className='rounded-full px-4 py-1'>
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </div>

        <div className='flex flex-col gap-2 items-end'>
          <Button variant='outline' className='rounded-md px-6'>
            Message
          </Button>
          <Button variant='ghost' size='icon' className='rounded-full'>
            <MoreHorizontal className='h-5 w-5' />
            <span className='sr-only'>More options</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default DetailCard;
