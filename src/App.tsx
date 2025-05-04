import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';

import { AuthProvider } from './contexts/auth/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import router from './Router';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();

export default function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster position='top-right' richColors duration={1500} />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
