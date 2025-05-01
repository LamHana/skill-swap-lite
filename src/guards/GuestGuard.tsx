import { LoadingSpinner } from '@/components/common/loading-spinner';
import { config } from '@/config/app';
import { useAuth } from '@/hooks';

import { FC, PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
// GuestGuard is a component that will be used to protect routes
// that should only be accessed by unauthenticated users.
const GuestGuard: FC<PropsWithChildren> = ({ children }) => {
  const { isInitialized, isAuthenticated } = useAuth();

  if (!isInitialized) return <LoadingSpinner size='lg' />;

  if (isAuthenticated) return <Navigate to={config.routes.home} replace />;

  return <>{children}</>;
};

export default GuestGuard;
