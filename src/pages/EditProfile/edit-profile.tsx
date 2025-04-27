import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { ChevronLeft } from 'lucide-react';
import ControlledInput from '@/components/common/controlled-input';
import ControlledTextarea from '@/components/common/controlled-textarea';
import ControlledMultiSelector from '@/components/common/controlled-multi-selector';
import useEditProfile from '@/hooks/useEditProfile';

const EditProfile = () => {
  const {
    form,
    avatar,
    learn,
    teach,
    learnAvailable,
    teachAvailable,
    handleDeletePicture,
    handleFileChange,
    handleLearnSkillsChange,
    handleSelectPicture,
    handleTeachSkillsChange,
    onSubmit,
    fileInputRef,
  } = useEditProfile();

  console.log({ teachAvailable });

  return (
    <div className='mt-5 mb-10 md:mt-8 md:mb-16 md:px-20 xl:mt-10 xl:mb-20 m-auto xl:px-40 w-full'>
      <Button variant={'ghost'} className='mb-6 md:mb-8 xl:mb-10'>
        <ChevronLeft /> Back
      </Button>
      <div className='flex flex-col gap-6 mb-6 md:flex-row md:mb-8 items-center md:justify-between xl:mb-10'>
        <Avatar className='h-40 w-40 xl:h-52 xl:w-52'>
          <AvatarImage src={avatar || ''} alt='shadcn' />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className='h-min flex gap-3 xl:gap-6 content-center'>
          <Button className='px-5 py-3 md:px-8 md:py-5 xl:px-10 xl:py-6' onClick={handleSelectPicture}>
            Select Picture
          </Button>
          <Button
            variant={'outline'}
            className='px-5 py-3 md:px-8 md:py-5 xl:px-10 xl:py-6'
            onClick={handleDeletePicture}
          >
            Delete Picture
          </Button>
          <input
            type='file'
            ref={fileInputRef}
            onChange={handleFileChange}
            accept='image/*'
            className='hidden'
            aria-label='Upload profile picture'
          />
        </div>
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
            placeholder='Your name'
            description='This is your public display name.'
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
          <div className='float-end flex gap-3 xl:gap-6'>
            <Button variant={'outline'} className='px-5 py-3 md:px-8 md:py-5 xl:px-10 xl:py-6'>
              Cancel
            </Button>
            <Button type='submit' className='px-5 py-3 md:px-8 md:py-5 xl:px-10 xl:py-6'>
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditProfile;
