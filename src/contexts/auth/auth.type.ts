import { AuthAction } from '@/utils/enum';
import { User as FirebaseUser } from 'firebase/auth';
import { Dispatch } from 'react';

export interface AuthState {
  isAuthenticated?: boolean;
  isInitialized?: boolean;
  user?: FirebaseUser | null;
}

export interface PayloadAction<T> {
  type: AuthAction;
  payload: T;
}

export interface AuthContextType extends AuthState {
  dispatch: Dispatch<PayloadAction<AuthState>>;
}

export interface ReducerHandler {
  INITIALIZE(state: AuthState, action: PayloadAction<AuthState>): AuthState;
  SIGN_IN(state: AuthState, action: PayloadAction<AuthState>): AuthState;
  SIGN_OUT(state: AuthState): AuthState;
}
