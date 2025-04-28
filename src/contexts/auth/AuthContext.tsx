import { createContext, FC, PropsWithChildren, useEffect, useReducer } from 'react';
import { AuthContextType, AuthState } from './auth.type';
import { onAuthStateChanged } from 'firebase/auth';
import { config } from '@/config/app';
import { initialize, reducer } from './auth.reducer';
import { getUserByUID } from '@/services/user.service';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
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
          }),
        );
        return;
      }

      const userData = await getUserByUID(user.uid);

      dispatch(
        initialize({
          isAuthenticated: true,
          isInitialized: true,
          user: userData,
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
