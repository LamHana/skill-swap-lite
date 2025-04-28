import { FC, PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { config } from '@/config/app';

const VerifiedEmailGuard: FC<PropsWithChildren> = ({ children }) => {
  const auth = getAuth();
  const userFirebase = auth.currentUser;
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
