import { LoadingButton } from '@/components/common/loading-button';
import { buttonVariants } from '@/components/ui/button';
import { config } from '@/config/app';
import { patchUser } from '@/contexts/auth/auth.reducer';
import { useAuth } from '@/hooks';
import useSignOut from '@/hooks/useSignOut';
import { getUserByUID } from '@/services/user.service';
import handleFirebaseError from '@/utils/handlerFirebaseError';

import { sendEmailVerification } from 'firebase/auth';
import { Mail } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { toast } from 'sonner';

const NotVerifyEmail = () => {
  const { userFirebase, dispatch } = useAuth();
  const { onSignOut } = useSignOut();
  const [loading, setLoading] = useState<boolean>(false);
  const [_, setForceUpdate] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (userFirebase) {
      interval = setInterval(async () => {
        await userFirebase.reload();
        const user = await getUserByUID(userFirebase.uid);
        if (!user) return;
        dispatch(patchUser({ user }));
        setForceUpdate((f) => f + 1);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [userFirebase, dispatch]);

  const handleSendEmailVerification = useCallback(async () => {
    try {
      if (!userFirebase) return;
      setLoading(true);

      await sendEmailVerification(userFirebase);
      toast.success('Email sent successfully.');
    } catch (error) {
      handleFirebaseError(error);
    } finally {
      setLoading(false);
    }
  }, [userFirebase]);

  if (userFirebase && userFirebase.emailVerified) return <Navigate to={config.routes.home} replace />;

  if (!userFirebase) return <Navigate to={config.routes.register} />;

  return (
    <div className='flex h-[calc(100vh-96px)] flex-col items-center justify-center gap-8 p-6'>
      <div className='flex flex-col items-center gap-4 text-center'>
        <div className='rounded-full bg-primary/10 p-4'>
          <Mail className='h-8 w-8 text-primary' />
        </div>
        <h1 className='text-2xl font-bold'>Please verify your email</h1>
        <p className='max-w-md text-muted-foreground'>
          We have sent a verification email to your email address. Please check your email and click the verification
          link to complete the registration process.
        </p>
      </div>
      <div className='flex flex-col gap-4'>
        <Link to='/' className={buttonVariants()}>
          Back to home
        </Link>
        <LoadingButton variant={'outline'} onClick={handleSendEmailVerification} loading={loading}>
          Resend verification email
        </LoadingButton>
        <button className={buttonVariants({ variant: 'outline' })} onClick={onSignOut}>
          Sign out
        </button>
      </div>
    </div>
  );
};

export default NotVerifyEmail;
