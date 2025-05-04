import { LoadingSpinner } from '@/components/common/loading-spinner';
import PreviewCard from '@/components/common/preview-card';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import useInvitations from '@/hooks/useInvitations';
import useSkillMapping from '@/hooks/useSkillMapping';
import { GET_ALL_USERS, updateUser } from '@/services/user.service';
import { User } from '@/types/user.type';
import { matchingIndicator } from '@/utils/matchingIndicator';
import { asString, asStringArray } from '@/utils/userHelpers';

import { arrayRemove, arrayUnion } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { QueryObserverResult, RefetchOptions, useMutation, useQueryClient } from '@tanstack/react-query';

interface InvitationProps {
  currentUser: User;
  refetchCurrentUser?: (options?: RefetchOptions) => Promise<QueryObserverResult<User | null, Error>>;
}

const Invitations = ({ currentUser, refetchCurrentUser }: InvitationProps) => {
  const queryClient = useQueryClient();
  const { data: users, isLoading } = useInvitations();
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [userWithSkills, setUserWithSkills] = useState<User | null>(null);
  const [isPercentagesLoaded, setIsPercentagesLoaded] = useState(false);

  useEffect(() => {
    const fetchUserWithSkills = async () => {
      if (!currentUser) return;
      const teachSkills = await useSkillMapping(asStringArray(currentUser.teach));
      const learnSkills = await useSkillMapping(asStringArray(currentUser.learn));
      setUserWithSkills({ ...currentUser, teach: teachSkills, learn: learnSkills });
      setIsPercentagesLoaded(true);
    };

    fetchUserWithSkills();
  }, [currentUser]);

  const denialMutation = useMutation({
    mutationFn: (user: User) => {
      return Promise.all([
        updateUser(user.id, { sentConnections: arrayRemove(currentUser.id) }),
        updateUser(currentUser.id, { requestConnections: arrayRemove(user.id) }),
      ]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations', currentUser.id] });
      queryClient.invalidateQueries({ queryKey: ['connections', currentUser.id] });
      queryClient.invalidateQueries({
        queryKey: [GET_ALL_USERS, 'related'],
        type: 'all',
      });
      toast.success('Invitation denied successfully!');
    },
    onError: (error) => {
      console.error('Error:', error);
    },
    onSettled: () => setPendingUserId(null),
  });

  const acceptMutation = useMutation({
    mutationFn: (user: User) => {
      return Promise.all([
        updateUser(currentUser.id, { requestConnections: arrayRemove(user.id) }),
        updateUser(user.id, { sentConnections: arrayRemove(currentUser.id) }),
        updateUser(currentUser.id, { connections: arrayUnion(user.id) }),
        updateUser(user.id, { connections: arrayUnion(currentUser.id) }),
      ]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations', currentUser.id] });
      queryClient.invalidateQueries({ queryKey: ['connections', currentUser.id] });
      queryClient.invalidateQueries({
        queryKey: [GET_ALL_USERS, 'related'],
        type: 'all',
      });
      toast.success('Invitation accepted successfully!');
    },
    onError: (error) => {
      console.error('Error:', error);
      toast.error('Error accepting invitation!');
    },
    onSettled: () => setPendingUserId(null),
  });

  const handleDeny = async (e: React.MouseEvent<HTMLButtonElement>, user: User) => {
    e.stopPropagation();
    setPendingUserId(user.id);
    await denialMutation.mutateAsync(user);
  };

  const handleAccept = async (e: React.MouseEvent<HTMLButtonElement>, user: User) => {
    e.stopPropagation();
    setPendingUserId(user.id);
    await acceptMutation.mutateAsync(user);
  };

  return isLoading || !isPercentagesLoaded ? (
    <div className='w-full flex items-center justify-center py-20'>
      <LoadingSpinner size='md' />
    </div>
  ) : users && users.length > 0 ? (
    <div className='flex flex-col items-start mt-10 w-full'>
      <h2 className='text-xl font-bold mb-4'>
        Invitations
        <span className='font-medium'>{users ? ` (${users?.length})` : ` (${0})`}</span>
      </h2>

      <Carousel
        opts={{
          align: 'center',
        }}
        className='w-full mx-auto'
      >
        <CarouselContent>
          {users?.map((user, index) => (
            <CarouselItem key={index} className='pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/3'>
              <div className='p-1'>
                <PreviewCard
                  id={user.id}
                  name={asString(user.fullName)}
                  percent={userWithSkills ? matchingIndicator(userWithSkills, user).percent : 0}
                  teach={asStringArray(user.teach)}
                  learn={asStringArray(user.learn)}
                  currentUser={currentUser}
                  refetchCurrentUser={refetchCurrentUser}
                  button={
                    <div className='flex flex-row w-full gap-4 items-center'>
                      <Button
                        variant='ghost'
                        className='text-gray-700 font-medium flex-auto'
                        onClick={(e) => handleDeny(e, user)}
                        disabled={pendingUserId === user.id && denialMutation.status === 'pending'}
                      >
                        Deny
                      </Button>
                      <Button
                        variant='default'
                        className='bg-primary text-white rounded-md px-4 py-2 flex-auto'
                        onClick={(e) => handleAccept(e, user)}
                        disabled={pendingUserId === user.id && acceptMutation.status === 'pending'}
                      >
                        Accept
                      </Button>
                    </div>
                  }
                  className='!mx-0'
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ) : null;
};

export default Invitations;
