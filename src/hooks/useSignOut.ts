import { signOut } from '@/contexts/auth/auth.reducer';
import { signOutSystem } from '@/services/auth.service';

import { useCallback } from 'react';

import { useAuth } from '.';

const useSignOut = () => {
  const { dispatch } = useAuth();

  const onSignOut = useCallback(() => {
    signOutSystem();
    dispatch(signOut());
  }, [dispatch]);

  return { onSignOut };
};

export default useSignOut;
