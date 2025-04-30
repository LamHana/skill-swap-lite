import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import PreviewCard, { PreviewCardProps } from '@/components/common/preview-card';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser } from '@/services/user.service';
import { arrayRemove, arrayUnion } from 'firebase/firestore';
import { useAuth } from '@/hooks';
import { asString, asStringArray } from '@/utils/userHelpers';
import useInvitations from '@/hooks/useInvitations';
import { User } from '@/types/user.type';

const Invitations = () => {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();
  if (!currentUser) return;

  const { data: users, isLoading, isError } = useInvitations();

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
    },
    onError: (error) => {
      console.error('Error:', error);
    },
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
    },
    onError: (error) => {
      console.error('Error:', error);
    },
  });

  return (
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
                  percent={100}
                  teach={asStringArray(user.teach)}
                  learn={asStringArray(user.learn)}
                  button={
                    <div className='flex flex-row w-full gap-4 items-center'>
                      <Button
                        variant='ghost'
                        className='text-gray-700 font-medium flex-auto'
                        onClick={() => denialMutation.mutate(user)}
                        disabled={denialMutation.status === 'pending'}
                      >
                        Deny
                      </Button>
                      <Button
                        variant='default'
                        className='bg-primary text-white rounded-md px-4 py-2 flex-auto'
                        onClick={() => acceptMutation.mutate(user)}
                        disabled={acceptMutation.status === 'pending'}
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
  );
};

export default Invitations;
