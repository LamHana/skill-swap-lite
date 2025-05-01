import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import useGetUsers from '@/hooks/useGetUsers';
import { getSkills } from '@/services/skill.service';
import { getUserByUID, getUsers } from '@/services/user.service';
import { Skill } from '@/types/skill.type';
import { User } from '@/types/user.type';
import { mapConnectionInformation, mapSkillInformation } from '@/utils/mapUserInformation';

import { BookOpenIcon, GraduationCapIcon, UserIcon, UsersIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { map } from 'zod';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

import { LoadingButton } from './loading-button';

import { useQuery } from '@tanstack/react-query';

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

const ProfileModal = ({ open, onOpenChange, userId }: ProfileModalProps) => {
  if (!userId) return;
  const [learn, setLearn] = useState<Skill[]>([]);
  const [teach, setTeach] = useState<Skill[]>([]);
  const [connections, setConnections] = useState<User[]>([]);
  const { users } = useGetUsers();

  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserByUID(userId),
  });

  const { data: skills } = useQuery({
    queryKey: ['skills'],
    queryFn: () => getSkills(),
  });

  useEffect(() => {
    if (user) {
      const { learnSkills, teachSkills } = mapSkillInformation(user, skills || []);
      setLearn(learnSkills);
      setTeach(teachSkills);
      const { connectedUsers } = mapConnectionInformation(user, users);
      setConnections(connectedUsers);
    }
  }, [user, skills, users]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Profile Preview</DialogTitle>
        </DialogHeader>

        <div className='flex flex-col gap-4 py-2'>
          {/* Profile Header */}
          <div className='flex flex-col sm:flex-row items-center gap-4'>
            <Avatar className='w-20 h-20'>
              <AvatarImage src={user?.photoURL || ''} alt='Profile' />
              <AvatarFallback className='bg-primary text-primary-foreground font-bold text-3xl'>
                {user?.fullName.toString().trim().charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className='flex flex-col items-center sm:items-start'>
              <h2 className='text-xl font-bold'>{user?.fullName.toString().trim()}</h2>

              {/* Bio Section - Moved up for better modal layout */}
              <div className='mt-2 text-sm text-muted-foreground'>{user?.bio.toString().trim()}</div>
            </div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            {/* Connections Section */}
            <Card className='h-full gap-0'>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium flex items-center gap-2'>
                  <UsersIcon className='h-4 w-4' />
                  Connections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className='space-y-1.5'>
                  {Array.isArray(user?.connections) &&
                    connections.map((connection, index) => (
                      <li key={index} className='flex items-center gap-2'>
                        <Avatar className='h-5 w-5'>
                          <AvatarImage src={connection.photoURL} alt={connection.fullName.toString()} />
                          <AvatarFallback className='text-xs'>
                            {connection.fullName.toString().charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className='text-xs sm:text-sm'>{connection.fullName.toString()}</span>
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>

            {/* Skills Section - Combined in one card for better modal layout */}
            <Card className='h-full gap-0'>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium flex items-center gap-2'>
                  <UserIcon className='h-4 w-4' />
                  Skills
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                {/* Learning */}
                <div className='mb-2'>
                  <div className='flex items-center gap-1 mb-3'>
                    <BookOpenIcon className='h-3.5 w-3.5' />
                    <span className='text-xs font-medium'>Learning</span>
                  </div>
                  <div className='flex flex-wrap gap-1.5'>
                    {learn.map((item: Skill) => (
                      <Badge key={item.id} variant='secondary' className='text-xs'>
                        {item.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Teaching */}
                <div>
                  <div className='flex items-center gap-1 mb-3'>
                    <GraduationCapIcon className='h-3.5 w-3.5' />
                    <span className='text-xs font-medium'>Teaching</span>
                  </div>
                  <div className='flex flex-wrap gap-1.5'>
                    {teach.map((item: Skill) => (
                      <Badge key={item.id} variant='outline' className='text-xs'>
                        {item.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            <LoadingButton type='submit'>Connect</LoadingButton>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
