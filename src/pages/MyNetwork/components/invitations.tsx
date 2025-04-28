import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import PreviewCard, { PreviewCardProps } from '@/components/common/preview-card';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { updateUser } from '@/services/user.service';
import { arrayRemove, arrayUnion } from 'firebase/firestore';
import { useAuth } from '@/hooks';

type InvitationsProps = {
  users: Omit<PreviewCardProps, 'button'>[];
};

const Invitations = ({ users }: InvitationsProps) => {
  const { user: currentUser } = useAuth();
  if (!currentUser) return;

  return (
    <div className='flex flex-col items-start mt-10 w-full'>
      <h2 className='text-xl font-bold mb-4'>
        Invitations
        <span className='font-medium'>{` (${users.length})`}</span>
      </h2>

      <Carousel
        opts={{
          align: 'center',
        }}
        className='w-full mx-auto'
      >
        <CarouselContent>
          {users.map((user, index) => {
            const { mutate: denialMutate, status: denialStatus } = useMutation({
              mutationFn: () => {
                return Promise.all([
                  updateUser(user.id, { sentConnections: arrayRemove(currentUser.uid) }),
                  updateUser(currentUser.uid, { requestConnections: arrayRemove(user.id) }),
                ]);
              },
            });

            const { mutate: acceptedMutate, status: acceptedStatus } = useMutation({
              mutationFn: () => {
                return Promise.all([
                  updateUser(currentUser.uid, { requestConnections: arrayRemove(user.id) }),
                  updateUser(user.id, { sentConnections: arrayRemove(currentUser.uid) }),
                  updateUser(currentUser.uid, { connections: arrayUnion(user.id) }),
                  updateUser(user.id, { connections: arrayUnion(currentUser.uid) }),
                ]);
              },
            });

            return (
              <CarouselItem key={index} className='pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/3'>
                <div className='p-1'>
                  <PreviewCard
                    id={user.id}
                    name={user.name}
                    percent={user.percent}
                    teach={user.teach}
                    learn={user.learn}
                    button={
                      <div className='flex flex-row w-full gap-4 items-center'>
                        <Button
                          variant='ghost'
                          className='text-gray-700 font-medium flex-auto'
                          onClick={() => denialMutate()}
                          disabled={denialStatus === 'pending'}
                        >
                          Deny
                        </Button>
                        <Button
                          variant='default'
                          className='bg-primary text-white rounded-md px-4 py-2 flex-auto'
                          onClick={() => acceptedMutate()}
                          disabled={acceptedStatus === 'pending'}
                        >
                          Accept
                        </Button>
                      </div>
                    }
                    className='!mx-0'
                  />
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default Invitations;
