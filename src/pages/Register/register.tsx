import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormData } from './register.schema';
import { Input } from '@/components/ui/input';
import MultipleSelector, { Option } from '@/components/common/multi-select';
import { LoadingButton } from '@/components/common/loading-button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Thumbnail from '@/assets/images/thumbnail.png';
import { signUpWithEmail } from '@/services/auth.service';
import { useMutation, useQuery } from '@tanstack/react-query';
import { GET_SKILLS_QUERY_KEY, getSkills } from '@/services/skill.service';
import { useEffect, useState } from 'react';

const registerFormDefaultValues: RegisterFormData = {
  fullname: '',
  email: '',
  password: '',
  learnSkills: [],
  teachSkills: [],
};

const Register = () => {
  const [skillOptions, setSkillOptions] = useState<Option[]>([]);

  const form = useForm<RegisterFormData>({
    mode: 'onBlur',
    resolver: zodResolver(registerSchema),
    defaultValues: registerFormDefaultValues,
  });

  const { data: skills } = useQuery({
    queryKey: [GET_SKILLS_QUERY_KEY],
    queryFn: () => getSkills(),
  });

  const { mutate: registerMutate, isPending: isRegisterPending } = useMutation({
    mutationFn: (body: RegisterFormData) => signUpWithEmail(body),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      registerMutate(data, {
        onSuccess: () => {
          form.reset();
          console.log('success');
        },
        onError: (error) => {
          console.error(error);
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (skills) {
      const options: Option[] = skills.map((skill) => ({
        label: skill.name,
        value: skill.id.toString(),
      }));
      setSkillOptions(options);
    }
  }, [skills]);

  const handleLearnSkillsChange = (options: Option[]) => {
    form.setValue(
      'learnSkills',
      options.map((o) => o.value),
    );
  };

  const handleTeachSkillsChange = (options: Option[]) => {
    form.setValue(
      'teachSkills',
      options.map((o) => o.value),
    );
  };

  return (
    <div className='flex h-[calc(100vh-96px)] gap-16 items-center justify-center m-6'>
      <div className='flex flex-col w-md justify-center p-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold'>Register</h1>
          <p className='text-muted-foreground'>Teach What You Know, Learn What You Love</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='fullname'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fullname</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter your fullname' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type='email' placeholder='Nhập email' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type='password' placeholder='Enter your password' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='learnSkills'
              render={({ field }) => {
                const currentValue = field.value.map(
                  (v) => skillOptions.find((o) => o.value === v) || { label: v, value: v },
                );
                return (
                  <FormItem>
                    <FormLabel>Skills you want to learn</FormLabel>
                    <FormControl>
                      <MultipleSelector
                        value={currentValue}
                        onChange={handleLearnSkillsChange}
                        options={skillOptions}
                        placeholder='Select skills you want to learn...'
                        emptyIndicator={
                          <p className='text-center text-lg leading-10 text-gray-600 dark:text-gray-400'>
                            No results found
                          </p>
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name='teachSkills'
              render={({ field }) => {
                const currentValue = field.value.map(
                  (v) => skillOptions.find((o) => o.value === v) || { label: v, value: v },
                );
                return (
                  <FormItem>
                    <FormLabel>Skills you want to teach</FormLabel>
                    <FormControl>
                      <MultipleSelector
                        value={currentValue}
                        onChange={handleTeachSkillsChange}
                        options={skillOptions}
                        placeholder='Select skills you want to teach...'
                        emptyIndicator={
                          <p className='text-center text-lg leading-10 text-gray-600 dark:text-gray-400'>
                            No results found
                          </p>
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <LoadingButton type='submit' className='w-full' loading={isRegisterPending}>
              Register
            </LoadingButton>
          </form>
        </Form>
      </div>
      <div className='flex items-center justify-end flex-col h-full bg-[#C3311F] rounded-lg overflow-hidden'>
        <img src={Thumbnail} alt='register' className='w-full h-[57%] object-contain rounded-lg' />
      </div>
    </div>
  );
};

export default Register;
