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
import { Link } from 'react-router-dom';
import { getUserByUID } from '@/services/user.service';
import { toast } from 'sonner';
import InputPassword from '@/components/common/input-password';
import { LoadingButton } from '@/components/common/loading-button';
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
      onSuccess: async (result) => {
        form.reset();
        const user = await getUserByUID(result.user.uid);
        dispatch(signIn({ user }));
        toast.success('Login successfully');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  const handleGoogleLogin = async () => {
    loginWithGoogle(undefined, {
      onSuccess: (result) => {
        form.reset();
        dispatch(
          signIn({
            user: result.user,
          }),
        );
        toast.success('Login successfully');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <div className='flex h-[calc(100vh-96px)] flex-col md:flex-row gap-8 md:gap-16 items-center justify-center m-6'>
      <div className='md:hidden w-full h-[200px] bg-[#C3311F] rounded-lg overflow-hidden mb-4'>
        <img src={Thumbnail} alt='login' className='w-full h-full object-contain rounded-lg' />
      </div>

      <div className='flex flex-col w-full max-w-md justify-center p-4 md:p-8'>
        <div className='mb-8'>
          <h1 className='text-2xl md:text-3xl font-bold'>Sign In</h1>
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

            <div className='space-y-4'>
              <LoadingButton type='submit' className='w-full' loading={isLoginPending}>
                Login
              </LoadingButton>

              <LoadingButton
                type='button'
                variant='outline'
                className='w-full'
                onClick={handleGoogleLogin}
                loading={isGoogleLoginPending}
              >
                <FaGoogle className='mr-2' />
                Sign in with Google
              </LoadingButton>
            </div>
          </form>
        </Form>
        <div className='mt-4'>
          <p className='text-muted-foreground'>
            Don't have an account?{' '}
            <Link to='/register' className='text-primary'>
              Register
            </Link>
          </p>
        </div>
      </div>

      <div className='hidden md:flex items-center justify-end flex-col h-full bg-[#C3311F] rounded-lg overflow-hidden'>
        <img src={Thumbnail} alt='login' className='w-full h-[57%] object-contain rounded-lg' />
      </div>
    </div>
  );
};

export default Login;
