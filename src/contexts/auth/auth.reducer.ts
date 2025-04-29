import { AuthAction } from '@/utils/enum';
import { AuthState, PayloadAction, ReducerHandler } from './auth.type';

// Reducer
const reducerHandlers: ReducerHandler = {
  INITIALIZE: (state: AuthState, action: PayloadAction<AuthState>): AuthState => {
    const { isAuthenticated, user, userFirebase } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
      userFirebase,
    };
  },

  SIGN_IN: (state: AuthState, action: PayloadAction<AuthState>): AuthState => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },

  SIGN_OUT: (state: AuthState): AuthState => {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  },
};

export function reducer(state: AuthState, action: PayloadAction<AuthState>) {
  if (!reducerHandlers[action.type]) return state;
  return reducerHandlers[action.type](state, action);
}

// Actions
export function initialize(payload: AuthState): PayloadAction<AuthState> {
  return {
    type: AuthAction.INITIALIZE,
    payload,
  };
}

export function signIn(payload: AuthState): PayloadAction<AuthState> {
  return {
    type: AuthAction.SIGN_IN,
    payload,
  };
}

export function signOut(): PayloadAction<AuthState> {
  return {
    type: AuthAction.SIGN_OUT,
    payload: {},
  };
}
