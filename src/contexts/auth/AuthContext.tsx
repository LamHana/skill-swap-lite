import { createContext, FC, PropsWithChildren, useEffect, useReducer } from 'react';
import { AuthContextType, AuthState } from './auth.type';
import { onAuthStateChanged } from 'firebase/auth';
import { config } from '@/config/app';
import { initialize, reducer } from './auth.reducer';
import { getUserByUID } from '@/services/user.service';

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
      console.log('user', user);
      if (!user)
        return dispatch(
          initialize({
            isAuthenticated: false,
            user: null,
          }),
        );

      const userData = await getUserByUID(user.uid);

      console.log('userData', userData);

      dispatch(
        initialize({
          isAuthenticated: !!user,
          user: userData,
        }),
      );
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {state.isInitialized ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
