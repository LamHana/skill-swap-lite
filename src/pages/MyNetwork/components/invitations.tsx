import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import React from 'react';
import PreviewCard, { PreviewCardProps } from '@/components/common/preview-card';
import { Button } from '@/components/ui/button';

type InvitationsProps = {
  users: Omit<PreviewCardProps, 'button'>[];
};

const Invitations = ({ users }: InvitationsProps) => {
  return (
    <div className='flex flex-col items-start mt-10'>
      <h2 className='text-2xl font-bold mb-4'>
        Invitations
        <span className='font-medium'>{` (${users.length})`}</span>
      </h2>

      <Carousel
        opts={{
          align: 'center',
        }}
        className='w-full max-w-[1216px] mx-auto'
      >
        <CarouselContent className=''>
          {users.map((user, index) => (
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
                      <Button variant='ghost' className='text-gray-700 font-medium flex-auto'>
                        Deny
                      </Button>
                      <Button variant='default' className='bg-primary text-white rounded-md px-4 py-2 flex-auto'>
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
