import { FC, PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

import { config } from '@/config/app';
import { useAuth } from '@/hooks';

// AuthGuard is component that will be used to protect routes
// that should only be accessed by authenticated users.
const AuthGuard: FC<PropsWithChildren> = ({ children }) => {
  const { isInitialized, isAuthenticated } = useAuth();

  if (!isInitialized) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to={config.routes.login} replace />;
  return <>{children}</>;
};

export default AuthGuard;
