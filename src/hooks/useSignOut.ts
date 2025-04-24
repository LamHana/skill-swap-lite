import { useCallback } from 'react';

import { useAuth } from '.';
import { signOutSystem } from '@/services/auth.service';
import { signOut } from '@/contexts/auth/auth.reducer';

const useSignOut = () => {
  const { dispatch } = useAuth();

  const onSignOut = useCallback(() => {
    signOutSystem();
    dispatch(signOut());
  }, [dispatch]);

  return { onSignOut };
};

export default useSignOut;
