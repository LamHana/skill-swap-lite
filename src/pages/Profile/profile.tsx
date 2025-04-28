import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skill } from '@/types/skill.type';
import { Button } from '@/components/ui/button';
import useGetSingleProfile from '@/hooks/useGetSingleProfile';

const Profile = () => {
  const { id, currentUser, connections, learn, teach, handleEditProfile } = useGetSingleProfile();
  let actionButtonsGroup;

  // if (id) {
  //   if (currentUser?.connections.includes(id)) {
  //     actionButtonsGroup = (
  //       <div className='flex gap-4 xl:gap-6'>
  //         <Button className='grow'>Message</Button>
  //         <Button variant={'outline'} className='grow'>
  //           Disconnect
  //         </Button>
  //       </div>
  //     );
  //   } else {
  //     actionButtonsGroup = <Button>Connect</Button>;
  //   }
  // } else {
  //   actionButtonsGroup = <Button onClick={handleEditProfile}>Edit profile</Button>;
  // }

  return (
    <div className='mt-5 mb-10 md:mt-8 md:mb-16 md:px-20 xl:mt-16 xl:mb-20 m-auto xl:px-40 w-full'>
      <div className='flex flex-col mb-8 gap-4 md:flex-row md:mb-10 md:justify-between md:items-start xl:mb-12'>
        <Avatar className='h-32 w-32 md:h-36 md:w-36 xl:h-48 xl:w-48'>
          <AvatarImage src={currentUser?.photoURL || ''} alt='shadcn' />
          <AvatarFallback className='bg-primary text-primary-foreground font-bold text-6xl'>
            {currentUser?.fullName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className='flex flex-col gap-4 xl:gap-6 md:w-2/3'>
          <h1 className='text-3xl font-bold'>{currentUser?.fullName}</h1>
          {currentUser?.bio && <p>{currentUser.bio}</p>}
          <p className='font-bold text-primary'>
            {connections} {connections && connections > 1 ? 'connections' : 'connection'}
          </p>
          {actionButtonsGroup}
        </div>
      </div>
      <div className='flex mb-8 gap-4 md:gap-8 md:mb-10 xl:gap-12 xl:mb-12'>
        <p className='font-bold text-primary'>Teaching</p>
        <div className='flex gap-2 md:gap-4 xl:gap-6 flex-wrap'>
          {teach.map((skill: Skill) => (
            <span key={skill.id} className={'rounded-full px-3 py-1 border border-gray-300'}>
              {skill.name}
            </span>
          ))}
        </div>
      </div>
      <div className='flex gap-4 md:gap-8 xl:gap-12'>
        <p className='font-bold text-primary'>Learning</p>
        <div className='flex gap-2 md:gap-4 xl:gap-6 flex-wrap'>
          {learn.map((skill: Skill) => (
            <span key={skill.id} className={'rounded-full px-3 py-1 border border-gray-300'}>
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
