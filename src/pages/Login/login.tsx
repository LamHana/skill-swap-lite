import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signInWithEmail, signInWithGoogle } from '@/services/auth.service';
import { useAuth } from '@/hooks';
import { useMutation } from '@tanstack/react-query';
import { FaGoogle } from 'react-icons/fa';
import loginSchema from './login.schema';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { signIn } from '@/contexts/auth/auth.reducer';
import Thumbnail from '@/assets/images/thumbnail.png';

export type LoginFormType = z.infer<typeof loginSchema>;

const loginFormDefaultValues: LoginFormType = {
  email: '',
  password: '',
};

const Login = () => {
  const { dispatch } = useAuth();
  const form = useForm<LoginFormType>({
    mode: 'onBlur',
    resolver: zodResolver(loginSchema),
    defaultValues: loginFormDefaultValues,
  });

  const { mutate: loginMutate, isPending: isLoginPending } = useMutation({
    mutationFn: (body: LoginFormType) => signInWithEmail(body),
  });

  const { mutate: loginWithGoogle, isPending: isGoogleLoginPending } = useMutation({
    mutationFn: () => signInWithGoogle(),
  });

  const onSubmit = async (values: LoginFormType) => {
    loginMutate(values, {
      onSuccess: (result) => {
        form.reset();
        console.log('success', result);
        dispatch(signIn({ user: result.user }));
      },
      onError: (error) => {
        console.log('error', error);
      },
    });
  };

  const handleGoogleLogin = async () => {
    loginWithGoogle(undefined, {
      onSuccess: (result) => {
        form.reset();
        console.log('success', result);
      },
      onError: (error) => {
        console.log('error', error);
      },
    });
  };

  return (
    <div className='flex h-[calc(100vh-96px)] gap-16 items-center justify-center m-6 '>
      <div className='flex flex-col max-w-md justify-center p-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold'>Sign In</h1>
          <p className='text-muted-foreground'>Teach What You Know, Learn What You Love</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type='email' placeholder='Enter your email' />
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

            <div className='space-y-4'>
              <Button type='submit' className='w-full'>
                {isLoginPending ? 'Logging in...' : 'Login'}
              </Button>

              <Button type='button' variant='outline' className='w-full' onClick={handleGoogleLogin}>
                {isGoogleLoginPending ? (
                  'Signing in with Google...'
                ) : (
                  <>
                    <FaGoogle className='mr-2' />
                    Sign in with Google
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <div className='flex  items-center justify-end flex-col h-full bg-[#C3311F] rounded-lg overflow-hidden'>
        <img src={Thumbnail} alt='login' className='w-full h-[57%] object-contain rounded-lg ' />
      </div>
    </div>
  );
};

export default Login;
