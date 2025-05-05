import ControlledInput from '@/components/common/controlled-input';
import ControlledMultiSelector from '@/components/common/controlled-multi-selector';
import ControlledTextarea from '@/components/common/controlled-textarea';
import { LoadingButton } from '@/components/common/loading-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { config } from '@/config/app';
import useEditProfile from '@/hooks/useEditProfile';

import { ChevronLeft } from 'lucide-react';

import SideBar from './components/side-bar';

const EditProfile = () => {
  const {
    form,
    currentUser,
    avatar,
    learn,
    teach,
    learnAvailable,
    teachAvailable,
    handleLearnSkillsChange,
    handleTeachSkillsChange,
    onSubmit,
    handleBackButtonClick,
    isPending,
  } = useEditProfile();

  const sidebarNavItems = [
    {
      title: 'Profile',
      href: config.routes.editProfile,
    },
    {
      title: 'Account',
      href: '/examples/forms/account',
    },
  ];

  return (
    <div className='flex flex-col space-y-8 mt-10 mb-20 xl:flex-row xl:space-x-12 lxl:space-y-0'>
      <aside className='lg:w-1/5'>
        <Button variant={'ghost'} className='mb-4 xl:mb-6' onClick={handleBackButtonClick}>
          <ChevronLeft /> Back
        </Button>
        <SideBar items={sidebarNavItems} />
      </aside>
      <div className='flex-1 lg:max-w-2xl'>
        <div className='m-auto'>
          <div className='flex flex-col gap-6 mb-6 xl:flex-row md:mb-8 items-center md:justify-between xl:mb-10'>
            <Avatar className='h-40 w-40 xl:h-40 xl:w-40'>
              <AvatarImage src={avatar || ''} alt='shadcn' />
              <AvatarFallback className='bg-primary text-primary-foreground font-bold text-6xl'>
                {typeof currentUser?.fullName === 'string' ? currentUser.fullName.charAt(0) : ''}
              </AvatarFallback>
            </Avatar>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 md:space-y-8 xl:space-y-10'>
              <ControlledInput
                form={form}
                name='name'
                label='Name'
                placeholder='Your name'
                description='This is your public display name.'
                required={true}
              />
              <ControlledTextarea
                form={form}
                name='bio'
                label='Bio'
                placeholder='Descripe yourself'
                description='This is your bio.'
              />
              <ControlledTextarea
                form={form}
                name='photoUrl'
                label='Avatar'
                placeholder='Your avatar url'
                description='This is your avatar.'
              />
              <ControlledMultiSelector
                current={learn}
                data={learnAvailable}
                form={form}
                handleChange={handleLearnSkillsChange}
                label='Learning skills'
                name='learn'
                placeholder='Select skills you want to learn...'
                required={true}
              />
              <ControlledMultiSelector
                current={teach}
                data={teachAvailable}
                form={form}
                handleChange={handleTeachSkillsChange}
                label='Teaching skills'
                name='teach'
                placeholder='Select skills you want to teach...'
                required={true}
              />
              <LoadingButton
                loading={isPending}
                type='submit'
                className='float-end px-5 py-3 md:px-8 md:py-5 xl:px-10 xl:py-6'
              >
                Submit
              </LoadingButton>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
