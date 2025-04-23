import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks';
import { useForm } from 'react-hook-form';
import { formSchema } from './form.schema';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { ChevronLeft } from 'lucide-react';
import ControlledInput from '@/components/common/controlled-input';
import ControlledTextarea from '@/components/common/controlled-textarea';
import ControlledMultiSelector from '@/components/common/controlled-multi-selector';

const EditProfile = () => {
  const { user } = useAuth();

  const skills = [
    {
      name: 'JavaScript',
    },
    {
      name: 'ReactJS',
    },
    {
      name: 'NodeJS',
    },
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      bio: '',
      learn: [skills[0].name],
      teach: [skills[0].name],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className='mt-10 mb-20 m-auto px-40 w-full'>
      <Button variant={'ghost'} className='mb-10'>
        <ChevronLeft /> Back
      </Button>
      <div className='flex items-center justify-between mb-10'>
        <Avatar className='h-52 w-52'>
          <AvatarImage src={user?.photoURL || ''} alt='shadcn' />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className='h-min flex gap-6 content-center'>
          <Button className='px-10 py-6'>Change Picture</Button>
          <Button variant={'outline'} className='px-10 py-6'>
            Delete Picture
          </Button>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <ControlledInput
            form={form}
            name='name'
            label='Name'
            placeholder='Your name'
            description='This is your public display name.'
          />
          <ControlledTextarea
            form={form}
            name='bio'
            label='Bio'
            placeholder='Your name'
            description='This is your public display name.'
          />
          <ControlledMultiSelector
            form={form}
            name='learn'
            label='Learning Skills'
            placeholder='Select skills you want to learn.'
            data={skills}
          />
          <ControlledMultiSelector
            form={form}
            name='teach'
            label='Teaching Skills'
            placeholder='Select skills you want to teach.'
            data={skills}
          />
          <div className='float-end flex gap-6'>
            <Button variant={'outline'} className='px-10 py-5'>
              Cancel
            </Button>
            <Button type='submit' className='px-10 py-5'>
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditProfile;
