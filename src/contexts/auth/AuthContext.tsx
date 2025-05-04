import { LoadingSpinner } from '@/components/common/loading-spinner';
import { config } from '@/config/app';
import { setDocument } from '@/services/firebase.service';
import { getUserByUID } from '@/services/user.service';

import { onAuthStateChanged } from 'firebase/auth';
import { createContext, FC, PropsWithChildren, useEffect, useReducer } from 'react';

import { initialize, reducer } from './auth.reducer';
import { AuthContextType, AuthState } from './auth.type';

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  userFirebase: null,
};

const AuthContext = createContext<AuthContextType>({
  ...initialState,
  dispatch: () => null,
});

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(config.firebase.auth, async (user) => {
      if (!user) {
        dispatch(
          initialize({
            isAuthenticated: false,
            isInitialized: true,
            user: null,
            userFirebase: null,
          }),
        );
        return;
      }

      let userData = await getUserByUID(user.uid);
      if (!userData) {
        userData = {
          id: user.uid,
          email: user.email || '',
          fullName: user.displayName || '',
          photoURL: user.photoURL || '',
          bio: '',
          learn: [],
          teach: [],
          connections: [],
          requestConnections: [],
          sentConnections: [],
        };
        await setDocument('users', user.uid, userData);
      }

      dispatch(
        initialize({
          isAuthenticated: true,
          isInitialized: true,
          user: userData,
          userFirebase: user,
        }),
      );
    });

    return () => unsubscribe();
  }, []);

  if (!state.isInitialized) {
    return (
      <div className='flex h-screen w-screen items-center justify-center'>
        <LoadingSpinner size='lg' />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {state.isInitialized ? children : <LoadingSpinner size='lg' />}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
