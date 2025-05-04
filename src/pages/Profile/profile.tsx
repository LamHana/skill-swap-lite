import WithdrawAlertDialog from '@/components/common/alert-dialog';
import { LoadingButton } from '@/components/common/loading-button';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks';
import useGetSingleProfile from '@/hooks/useGetSingleProfile';
import { getUserByUID, updateUser } from '@/services/user.service';
import { Skill } from '@/types/skill.type';

import { arrayRemove, arrayUnion } from 'firebase/firestore';
import { BookOpenIcon, GraduationCapIcon, UserIcon, UsersIcon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useMutation, useQuery } from '@tanstack/react-query';

const Profile = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();

  const [isOpenWithdrawModal, setIsOpenWithdrawModal] = useState<boolean>(false);
  const [isOpenDisconnectedModal, setIsOpenDisconnectedModal] = useState<boolean>(false);

  const { id, currentUser, learn, teach, handleEditProfile, userConnections } = useGetSingleProfile();
  let actionButtonsGroup;

  const { data: user, refetch: refetchUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => getUserByUID(authUser?.id ?? ''),
    enabled: !!authUser,
  });

  const { mutateAsync: connectMutate, status: connectStatus } = useMutation({
    mutationFn: () => {
      return Promise.all([
        updateUser(id, { requestConnections: arrayUnion(user?.id ?? '') }),
        updateUser(user?.id ?? '', { sentConnections: arrayUnion(id) }),
      ]);
    },
    onSuccess: async () => {
      await refetchUser();
    },
  });

  const { mutateAsync: withdrawMutate, status: withdrawStatus } = useMutation({
    mutationFn: () => {
      return Promise.all([
        updateUser(id, { requestConnections: arrayRemove(user?.id ?? '') }),
        updateUser(user?.id ?? '', { sentConnections: arrayRemove(id) }),
      ]);
    },
    onSuccess: async () => {
      await refetchUser();
      setIsOpenWithdrawModal(false);
    },
  });

  const denialMutation = useMutation({
    mutationFn: () => {
      return Promise.all([
        updateUser(id, { sentConnections: arrayRemove(user?.id ?? '') }),
        updateUser(user?.id ?? '', { requestConnections: arrayRemove(id) }),
      ]);
    },
    onSuccess: async () => {
      toast.success('Invitation denied successfully!');
      await refetchUser();
    },
    onError: (error) => {
      console.error('Error:', error);
    },
  });

  const acceptMutation = useMutation({
    mutationFn: () => {
      return Promise.all([
        updateUser(user?.id ?? '', { requestConnections: arrayRemove(id) }),
        updateUser(id, { sentConnections: arrayRemove(user?.id ?? '') }),
        updateUser(user?.id ?? '', { connections: arrayUnion(id) }),
        updateUser(id, { connections: arrayUnion(user?.id ?? '') }),
      ]);
    },
    onSuccess: async () => {
      toast.success('Invitation accepted successfully!');
      await refetchUser();
    },
    onError: (error) => {
      console.error('Error:', error);
      toast.error('Error accepting invitation!');
    },
  });

  const { mutateAsync: disconnectedMutate, status: disconnectedStatus } = useMutation({
    mutationFn: () => {
      return Promise.all([
        updateUser(id, { connections: arrayRemove(user?.id ?? '') }),
        updateUser(user?.id ?? '', { connections: arrayRemove(id) }),
      ]);
    },
    onSuccess: async () => {
      setIsOpenDisconnectedModal(false);
      await refetchUser();
    },
    onError: (error) => {
      console.error('Disconnect failed:', error);
    },
  });

  const handleConnect = async () => {
    await connectMutate();
  };

  const handleWithdraw = async () => {
    await withdrawMutate();
  };

  const handleDeny = async () => {
    await denialMutation.mutateAsync();
  };

  const handleAccept = async () => {
    await acceptMutation.mutateAsync();
  };

  const handleDisconnected = async () => {
    await disconnectedMutate();
  };

  const isSentConnectionUser = Array.isArray(user?.sentConnections) && id && user.sentConnections.includes(id);
  const isRequestConnectionUser = Array.isArray(user?.requestConnections) && id && user.requestConnections.includes(id);
  const isConnectionsUser = Array.isArray(user?.connections) && id && user.connections.includes(id);

  if (id) {
    if (isConnectionsUser) {
      actionButtonsGroup = (
        <div className='flex gap-4 xl:gap-6'>
          <Button className='grow' onClick={() => navigate('/chat', { state: { contactId: id } })}>
            Message
          </Button>
          <Button variant={'outline'} className='grow' onClick={() => setIsOpenDisconnectedModal(true)}>
            Disconnect
          </Button>
        </div>
      );
    } else if (isSentConnectionUser || connectStatus === 'pending') {
      actionButtonsGroup = <Button onClick={() => setIsOpenWithdrawModal(true)}>Pending</Button>;
    } else if (isRequestConnectionUser) {
      actionButtonsGroup = (
        <div>
          <LoadingButton
            variant='ghost'
            className='text-gray-700 font-medium flex-auto'
            onClick={handleDeny}
            loading={denialMutation.isPending}
          >
            Deny
          </LoadingButton>
          <LoadingButton
            variant='default'
            className='bg-primary text-white rounded-md px-4 py-2 flex-auto'
            onClick={handleAccept}
            loading={acceptMutation.isPending}
          >
            Accept
          </LoadingButton>
        </div>
      );
    } else {
      actionButtonsGroup = <Button onClick={handleConnect}>Connect</Button>;
    }
  } else {
    actionButtonsGroup = <Button onClick={handleEditProfile}>Edit profile</Button>;
  }

  return (
    <div className='container mx-auto mt-12 mb-20'>
      <div className='flex flex-col md:flex-row gap-6 items-start'>
        {/* Profile Header */}
        <div className='w-full md:w-1/3 flex flex-col items-center'>
          <div className='relative mb-4 w-40 h-40'>
            <Avatar className='w-40 h-40'>
              <AvatarImage src={currentUser?.photoURL.toString().trim() || ''} alt='shadcn' />
              <AvatarFallback className='bg-primary text-primary-foreground font-bold text-6xl'>
                {currentUser?.fullName.toString().trim().charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
          <h1 className='text-2xl font-bold text-center'>{currentUser?.fullName.toString().trim()}</h1>

          <div className='w-full mt-6'>
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm md:text-base font-medium flex items-center gap-2'>
                  <UsersIcon className='h-4 w-4' />
                  Connections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className='space-y-2'>
                  {userConnections &&
                    userConnections.length !== 0 &&
                    userConnections.map((connection, index) => (
                      <li key={index} className='flex items-center gap-2'>
                        <Avatar className='h-6 w-6'>
                          <AvatarImage src={connection.photoURL.toString().trim() || ''} alt='shadcn' />
                          <AvatarFallback className='text-xs'>
                            {connection.fullName
                              .toString()
                              .split(' ')
                              .map((name) => name[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className='text-sm'>{connection.fullName.toString()}</span>
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Profile Content */}
        <div className='w-full md:w-2/3 space-y-6'>
          {/* Bio Section */}
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='flex items-center gap-2 md:text-lg'>
                <UserIcon className='h-5 w-5' />
                About
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground'>{currentUser?.bio.toString().trim()}</p>
            </CardContent>
          </Card>

          {/* Skills Section */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Learning */}
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm md:text-base font-medium flex items-center gap-2'>
                  <BookOpenIcon className='h-4 w-4' />
                  Learning
                </CardTitle>
                <CardDescription>Skills I want to learn</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex flex-wrap gap-2'>
                  {learn.map((item: Skill) => (
                    <Badge key={item.id} variant='secondary' className='md:text-sm'>
                      {item.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Teaching */}
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm md:text-base font-medium flex items-center gap-2'>
                  <GraduationCapIcon className='h-4 w-4' />
                  Teaching
                </CardTitle>
                <CardDescription>Skills I can teach</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex flex-wrap gap-2'>
                  {teach.map((item: Skill) => (
                    <Badge key={item.id} variant='outline' className='md:text-sm'>
                      {item.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Edit Profile Button */}
          <div className='flex justify-end'>{actionButtonsGroup}</div>
        </div>
      </div>
      <WithdrawAlertDialog
        open={isOpenWithdrawModal}
        onCancle={() => setIsOpenWithdrawModal(false)}
        onConfirm={handleWithdraw}
        confirmStatus={withdrawStatus}
      />
      <AlertDialog open={isOpenDisconnectedModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove connection</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove them as a connection? Don't worry, they won't be notified.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsOpenDisconnectedModal(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={disconnectedStatus === 'pending'} onClick={handleDisconnected}>
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Profile;
