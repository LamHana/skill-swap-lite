import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks';
import { useForm } from 'react-hook-form';
import { ProfileFormData, profileSchema } from './profile.schema';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { ChevronLeft } from 'lucide-react';
import ControlledInput from '@/components/common/controlled-input';
import ControlledTextarea from '@/components/common/controlled-textarea';
import ControlledMultiSelector from '@/components/common/controlled-multi-selector';
import { useEffect, useRef, useState } from 'react';
import { Skill } from '@/types/skill.type';
import { Option } from '@/components/common/multi-select';
import { allskills, fakeUser } from './data';

const EditProfile = () => {
  const { user } = useAuth();
  const learningSkills = fakeUser.learn.map((id: string) => allskills.filter((skill: Skill) => skill.id === id)).flat();
  const teachingSkills = fakeUser.teach.map((id: string) => allskills.filter((skill: Skill) => skill.id === id)).flat();

  const formatedOptions = (options: Skill[]) => {
    return options.map((skill) => ({
      label: skill.name,
      value: skill.id.toString(),
    }));
  };

  const subtractedArray = (main: Option[], sub: Option[]) => {
    let p1 = 0;
    let p2 = 0;
    let newArr = main;

    while (p2 < sub.length) {
      if (main[p1].value !== sub[p2].value) {
        p1++;
      }
      newArr = newArr.filter((option: Option) => !(option.value === sub[p2].value));
      p2++, (p1 = 0);
    }

    return newArr;
  };

  const options: Option[] = formatedOptions(allskills);

  const [avatar, setAvatar] = useState<string | null | undefined>(user?.photoURL);
  const [learn, setLearn] = useState<Option[]>(formatedOptions(learningSkills));
  const [teach, setTeach] = useState<Option[]>(formatedOptions(teachingSkills));
  const [learnAvailable, setLearnAvailable] = useState<Option[]>(subtractedArray(options, teach));
  const [teachAvailable, setTeachAvailable] = useState<Option[]>(subtractedArray(options, learn));

  useEffect(() => {
    setLearnAvailable(subtractedArray(options, teach));
    setTeachAvailable(subtractedArray(options, learn));
  }, [learn, teach]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectPicture = () => {
    // Trigger the hidden file input when Select Picture is clicked
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create a URL for the selected image
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
    }
  };

  const handleDeletePicture = () => {
    // Reset to default avatar
    setAvatar('/placeholder.svg?height=200&width=200');
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLearnSkillsChange = (options: Option[]) => {
    form.setValue(
      'learn',
      options.map((o) => o.value),
    );
    setLearn(options);
  };

  const handleTeachSkillsChange = (options: Option[]) => {
    form.setValue(
      'teach',
      options.map((o) => o.value),
    );
    setTeach(options);
  };

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.displayName ?? '',
      bio: '',
      learn: learn.map((option: Option) => option.value),
      teach: teach.map((option: Option) => option.value),
    },
  });

  function onSubmit(values: z.infer<typeof profileSchema>) {
    console.log(values);
  }

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
