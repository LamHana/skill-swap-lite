import { signOut } from '@/contexts/auth/auth.reducer';
import { signOutSystem } from '@/services/auth.service';

import { useCallback } from 'react';

import { useAuth } from '.';

import { useQueryClient } from '@tanstack/react-query';

const useSignOut = () => {
  const { dispatch } = useAuth();
  const queryClient = useQueryClient();

  const onSignOut = useCallback(() => {
    signOutSystem();
    queryClient.clear();
    dispatch(signOut());
  }, [dispatch, queryClient]);

  return { onSignOut };
};

export default useSignOut;
