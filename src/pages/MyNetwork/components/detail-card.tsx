import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/hooks';
import useSkillMapping from '@/hooks/useSkillMapping';
import { GET_ALL_USERS, updateUser } from '@/services/user.service';
import { User } from '@/types/user.type';
import { asString, asStringArray } from '@/utils/userHelpers';

import { arrayRemove } from 'firebase/firestore';
import { BookOpenIcon, GraduationCapIcon, UserRoundX } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../index.css';

import { useMutation, useQueryClient } from '@tanstack/react-query';

const DetailCard = ({ user, percentage }: { user: User; percentage: number | null }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [userWithSkills, setUserWithSkills] = useState<User | null>(null);

  if (!currentUser) return;

  useEffect(() => {
    const fetchUserWithSkills = async () => {
      if (!currentUser) return;
      const teachSkills = await useSkillMapping(asStringArray(currentUser.teach));
      const learnSkills = await useSkillMapping(asStringArray(currentUser.learn));
      setUserWithSkills({ ...currentUser, teach: teachSkills, learn: learnSkills });
    };

    fetchUserWithSkills();
  }, [currentUser]);

  const { mutate: disconnectedMutate, status: disconnectedStatus } = useMutation({
    mutationFn: () => {
      return Promise.all([
        updateUser(user.id, { connections: arrayRemove(currentUser.id) }),
        updateUser(currentUser.id, { connections: arrayRemove(user.id) }),
      ]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections', currentUser.id] });
      queryClient.invalidateQueries({
        queryKey: [GET_ALL_USERS, 'related'],
        type: 'all',
      });
      setOpen(false);
    },
    onError: (error) => {
      console.error('Disconnect failed:', error);
    },
  });

  const handleDisconnected = () => {
    disconnectedMutate(undefined, {
      onSettled: () => {
        setOpen(false);
      },
    });
  };

  return (
    <>
      <Card className='w-full rounded-xl p-4 relative overflow-hidden'>
        <div className='absolute top-0 right-0 bg-primary text-white text-xs font-medium py-2 px-4 rounded-tr-xl rounded-bl-xl -translate-y-1 translate-x-1'>
          {percentage}%
        </div>

        <div className='flex flex-col md:flex-row gap-4'>
          <Avatar className='h-[80px] w-[80px] md:h-[80px] md:w-[80px] rounded-md border'>
            <AvatarImage src={asString(user.photoURL) || '/placeholder.svg'} alt={asString(user.fullName)} />
            <AvatarFallback className='rounded-md text-xs'>
              {user.photoURL
                ? '100 x 100'
                : asString(user.fullName)
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
            </AvatarFallback>
          </Avatar>

          <div className='flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-4'>
            <div className='flex-1'>
              <CardHeader className='p-0'>
                <h2 className='text-base md:text-lg font-medium'>{asString(user.fullName)}</h2>
              </CardHeader>

              <CardContent className='p-0 space-y-4'>
                <p className='text-xs md:text-sm line-clamp-3'>{asString(user.bio)}</p>

                <div className='flex flex-col md:flex-col gap-4 items-start md:items-start'>
                  <div className='flex flex-col md:flex-col space-y-2 md:space-y-0 md:space-x-2 items-start md:items-start'>
                    <div className='text-sm font-medium mb-1.5 flex items-start'>
                      <GraduationCapIcon className='h-3.5 w-3.5 mr-1.5 text-emerald-500' />
                      Teaching
                    </div>
                    <div className='flex flex-wrap gap-1.5'>
                      {asStringArray(user.teach).map((skill) => (
                        <Badge
                          key={skill}
                          variant='outline'
                          className={`px-4 py-1 text-xs md:text-xs ${userWithSkills?.learn.toString().includes(skill) ? 'bg-blue-100 dark:bg-blue-700 border-blue-500' : ''}`}
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className='flex flex-col md:flex-col space-y-2 md:space-y-0 md:space-x-2 items-start md:items-start'>
                    <div className='text-sm font-medium mb-1.5 flex items-start'>
                      <BookOpenIcon className='h-3.5 w-3.5 mr-1.5 text-blue-500' />
                      Learning
                    </div>
                    <div className='flex flex-wrap gap-1.5'>
                      {asStringArray(user.learn).map((skill) => (
                        <Badge
                          key={skill}
                          variant='outline'
                          className={`px-4 py-1 text-xs md:text-xs ${userWithSkills?.teach.toString().includes(skill) ? 'bg-emerald-100 dark:bg-emerald-700 border-emerald-500' : ''}`}
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>

            <div className='flex flex-row gap-2 items-end'>
              <Button
                variant='outline'
                className='rounded-md px-6 md:px-10 text-sm md:text-base border-primary text-primary'
                onClick={() => navigate('/chat', { state: { contactId: user.id } })}
              >
                Message
              </Button>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='rounded-full hover:cursor-pointer'
                      onClick={() => setOpen(true)}
                    >
                      <UserRoundX className='h-5 w-5' />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side='bottom' sideOffset={5} align='center' className='bg-secondary tooltip-no-arrow'>
                    <p className='text-secondary-foreground'>Disconnect</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </Card>
      <AlertDialog open={open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove connection</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {asString(user.fullName)} as a connection? Don't worry, they won't be
              notified.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={disconnectedStatus === 'pending'} onClick={handleDisconnected}>
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DetailCard;
