import Thumbnail from '@/assets/images/thumbnail.png';
import InputPassword from '@/components/common/input-password';
import { LoadingButton } from '@/components/common/loading-button';
import MultipleSelector, { Option } from '@/components/common/multi-select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { signIn } from '@/contexts/auth/auth.reducer';
import { useAuth } from '@/hooks';
import { useSkillValidation } from '@/hooks/useSkillValidation';
import { signUpWithEmail } from '@/services/auth.service';
import { GET_SKILLS_QUERY_KEY, getSkills } from '@/services/skill.service';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import { RegisterFormData, registerSchema } from './register.schema';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';

const registerFormDefaultValues: RegisterFormData = {
  fullname: '',
  email: '',
  password: '',
  learnSkills: [],
  teachSkills: [],
};

const Register = () => {
  const { dispatch } = useAuth();
  const [skillOptions, setSkillOptions] = useState<Option[]>([]);
  const { validateSkills, getFilteredOptions } = useSkillValidation();

  const form = useForm<RegisterFormData>({
    mode: 'onBlur',
    resolver: zodResolver(registerSchema),
    defaultValues: registerFormDefaultValues,
  });

  const { learnSkills, teachSkills } = form.watch();

  const { data: skills } = useQuery({
    queryKey: [GET_SKILLS_QUERY_KEY],
    queryFn: () => getSkills(),
  });

  const { mutate: registerMutate, isPending: isRegisterPending } = useMutation({
    mutationFn: (body: RegisterFormData) => signUpWithEmail(body),
  });

  const onSubmit = async (data: RegisterFormData) => {
    registerMutate(data, {
      onSuccess: (result) => {
        form.reset();
        toast.success('Register successfully');
        dispatch(signIn({ userFirebase: result.user }));
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
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

  const mapValuesToOptions = (values: string[]) =>
    values.map((v) => skillOptions.find((o) => o.value === v) || { label: v, value: v });

  const getAvailableOptions = (field: 'learnSkills' | 'teachSkills') => {
    const oppositeValues = field === 'learnSkills' ? teachSkills : learnSkills;
    return getFilteredOptions(skillOptions, mapValuesToOptions(oppositeValues));
  };

  const handleSkillsChange = (field: 'learnSkills' | 'teachSkills', options: Option[]) => {
    const currentOppositeSkills =
      field === 'learnSkills'
        ? mapValuesToOptions(form.getValues('teachSkills'))
        : mapValuesToOptions(form.getValues('learnSkills'));

    const validation = validateSkills(
      field === 'learnSkills' ? currentOppositeSkills : options,
      field === 'learnSkills' ? options : currentOppositeSkills,
    );

    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    }

    const filteredOptions = options.filter(
      (option) => !currentOppositeSkills.some((skill) => skill.value === option.value),
    );

    form.setValue(
      field,
      filteredOptions.map((o) => o.value),
    );
  };

  return (
    <div className='flex h-[calc(100vh-96px)] flex-col md:flex-row gap-8 md:gap-16 items-center justify-center m-6'>
      <div className='md:hidden w-full h-[200px] bg-[#C3311F] rounded-lg overflow-hidden mb-4'>
        <img src={Thumbnail} alt='register' className='w-full h-full object-contain rounded-lg' />
      </div>

      <div className='flex flex-col w-full max-w-md justify-center p-4 md:p-8'>
        <div className='mb-8'>
          <h1 className='text-2xl md:text-3xl font-bold'>Register</h1>
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
                    <Input {...field} placeholder='Fullname' />
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
                    <Input {...field} type='email' placeholder='Email' />
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
                    <InputPassword placeholder='••••••••' field={{ ...field }} />
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
                        onChange={(options) => handleSkillsChange('learnSkills', options)}
                        options={getAvailableOptions('learnSkills')}
                        placeholder='Skills you want to learn'
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
                        onChange={(options) => handleSkillsChange('teachSkills', options)}
                        options={getAvailableOptions('teachSkills')}
                        placeholder='Skills you want to teach'
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
        <div className='mt-4'>
          <p className='text-muted-foreground'>
            Already have an account?{' '}
            <Link to='/login' className='text-primary'>
              Login
            </Link>
          </p>
        </div>
      </div>

      <div className='hidden md:flex items-center justify-end flex-col h-full bg-[#C3311F] rounded-lg overflow-hidden'>
        <img src={Thumbnail} alt='register' className='w-full h-[57%] object-contain rounded-lg' />
      </div>
    </div>
  );
};

export default Register;
