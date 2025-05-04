import { AuthContext } from '@/contexts/auth/AuthContext';

import { useContext } from 'react';

export default function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('Auth context must be used within an AuthProvider');
  }

  return context;
}
