import { FC, PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { config } from '@/config/app';
import { useAuth } from '@/hooks';

const VerifiedEmailGuard: FC<PropsWithChildren> = ({ children }) => {
  const { userFirebase } = useAuth();
  const location = useLocation();

  if (userFirebase && !userFirebase.emailVerified && location.pathname !== config.routes.notVerifyEmail) {
    return <Navigate to={config.routes.notVerifyEmail} replace />;
  }
  if (userFirebase && userFirebase.emailVerified && location.pathname === config.routes.notVerifyEmail) {
    return <Navigate to={config.routes.home} replace />;
  }
  return <>{children}</>;
};

export default VerifiedEmailGuard;
