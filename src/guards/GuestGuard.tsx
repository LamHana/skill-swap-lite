import { FC, PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

import { config } from '@/config/app';
import { useAuth } from '@/hooks';
// GuestGuard is a component that will be used to protect routes
// that should only be accessed by unauthenticated users.
const GuestGuard: FC<PropsWithChildren> = ({ children }) => {
  const { isInitialized, isAuthenticated } = useAuth();

  if (!isInitialized) return <div>Loading...</div>;

  if (isAuthenticated) return <Navigate to={config.routes.home} replace />;

  return <>{children}</>;
};

export default GuestGuard;
