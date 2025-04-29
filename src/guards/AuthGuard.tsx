import { FC, PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

import { config } from '@/config/app';
import { useAuth } from '@/hooks';
import { LoadingSpinner } from '@/components/common/loading-spinner';

// AuthGuard is component that will be used to protect routes
// that should only be accessed by authenticated users.
const AuthGuard: FC<PropsWithChildren> = ({ children }) => {
  const { isInitialized, isAuthenticated, user, userFirebase } = useAuth();

  if (!isInitialized || (userFirebase && !user)) return <LoadingSpinner size='lg' />;

  if (!isAuthenticated || !userFirebase) return <Navigate to={config.routes.landing} replace />;

  return <>{children}</>;
};

export default AuthGuard;
