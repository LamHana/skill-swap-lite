import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { config } from '@/config/app';
import { useAuth } from '@/hooks';
import { getSkills } from '@/services/skill.service';
import { getAllUsers, getUserByUID, updateUser } from '@/services/user.service';
import { Skill } from '@/types/skill.type';
import { mapConnectionInformation, mapSkillInformation } from '@/utils/mapUserInformation';

import { arrayRemove, arrayUnion } from 'firebase/firestore';
import { BookOpenIcon, GraduationCapIcon, UserIcon, UsersIcon } from 'lucide-react';
import { useState } from 'react';
import { MdOutlineOpenInNew } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

import WithdrawAlertDialog from './alert-dialog';
import { LoadingButton } from './loading-button';

import { useMutation, useQuery } from '@tanstack/react-query';
interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  setListPendingUsers?: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  listPendingUsers?: Record<string, boolean>;
}

const ProfileModal = ({ open, onOpenChange, userId, setListPendingUsers, listPendingUsers }: ProfileModalProps) => {
  if (!userId) return;

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  if (!currentUser) return;

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
  });

  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserByUID(userId),
  });

  const { data: skills } = useQuery({
    queryKey: ['skills', userId],
    queryFn: () => getSkills(),
  });

  const { data: userInfoProcessed } = useQuery({
    queryKey: ['processed-user', userId],
    queryFn: () => {
      if (!user || !skills || !users) return null;

      const { learnSkills, teachSkills } = mapSkillInformation(user, skills);
      const { connectedUsers } = mapConnectionInformation(user, users);

      return {
        learnSkills,
        teachSkills,
        connectedUsers,
      };
    },
    enabled: !!user && !!skills && !!users,
  });

  const learn = userInfoProcessed?.learnSkills ?? [];
  const teach = userInfoProcessed?.teachSkills ?? [];
  const connections = userInfoProcessed?.connectedUsers ?? [];

  const { mutate: connectMutate, status: connectStatus } = useMutation({
    mutationFn: () => {
      return Promise.all([
        updateUser(userId, { requestConnections: arrayUnion(currentUser.id) }),
        updateUser(currentUser.id, { sentConnections: arrayUnion(userId) }),
      ]);
    },
  });

  const { mutate: withdrawMutate, status: withdrawStatus } = useMutation({
    mutationFn: () => {
      return Promise.all([
        updateUser(userId, { requestConnections: arrayRemove(currentUser.id) }),
        updateUser(currentUser.id, { sentConnections: arrayRemove(userId) }),
      ]);
    },
    onSuccess: () => {
      if (setListPendingUsers) {
        setListPendingUsers({ ...listPendingUsers, [userId]: false });
      }
      setIsOpenModal(false);
    },
  });

  const handleConnect = () => {
    if (!listPendingUsers || !setListPendingUsers) return;
    if (!listPendingUsers[userId]) {
      setListPendingUsers({ ...listPendingUsers, [userId]: true });
      connectMutate();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader className='flex flex-row justify-between'>
          <DialogTitle>Profile Preview</DialogTitle>
        </DialogHeader>

        <div className='flex flex-col gap-4 py-2'>
          {/* Profile Header */}
          <div className='flex flex-col sm:flex-row items-center gap-4'>
            <Avatar className='w-20 h-20'>
              <AvatarImage src={user?.photoURL.toString() || ''} alt='Profile' />
              <AvatarFallback className='bg-primary text-primary-foreground font-bold text-3xl'>
                {user?.fullName.toString().trim().charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className='flex flex-col items-center sm:items-start'>
              <div className='flex items-center justify-between gap-2 w-full'>
                <h2 className='text-xl font-bold'>{user?.fullName.toString().trim()}</h2>
                <Button asChild variant={'ghost'} size='default' className='p-0'>
                  <MdOutlineOpenInNew size={20} onClick={() => navigate(config.routes.user.replace(':id', userId))} />
                </Button>
              </div>

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
                          <AvatarImage src={connection.photoURL.toString()} alt={connection.fullName.toString()} />
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
            {listPendingUsers && listPendingUsers[userId] ? (
              <LoadingButton
                type='submit'
                loading={listPendingUsers[userId] && connectStatus === 'pending'}
                onClick={() => setIsOpenModal(true)}
              >
                Pending
              </LoadingButton>
            ) : (
              <LoadingButton type='submit' onClick={handleConnect}>
                Connect
              </LoadingButton>
            )}
          </DialogFooter>
        </div>
      </DialogContent>

      <WithdrawAlertDialog
        open={isOpenModal}
        onCancle={() => setIsOpenModal(false)}
        onConfirm={withdrawMutate}
        confirmStatus={withdrawStatus}
      />
    </Dialog>
  );
};

export default ProfileModal;
