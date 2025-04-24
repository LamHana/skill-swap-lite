import { createBrowserRouter, Outlet } from 'react-router-dom';
import { config } from './config/app';
import AuthGuard from './guards/AuthGuard';
import GuestGuard from './guards/GuestGuard';

const router = createBrowserRouter([
  // Guest routes
  {
    element: (
      <GuestGuard>
        <Outlet />
      </GuestGuard>
    ),
    children: [
      {
        path: config.routes.login,
        lazy: async () => ({
          Component: (await import('./layout/AuthLayout')).default,
        }),
        children: [
          {
            index: true,
            path: config.routes.login,
            lazy: async () => ({
              Component: (await import('./pages/Login')).default,
            }),
          },
        ],
      },
    ],
  },

  // Auth routes
  {
    element: (
      <AuthGuard>
        <Outlet />
      </AuthGuard>
    ),
    children: [
      {
        path: config.routes.home,
        lazy: async () => ({
          Component: (await import('./layout/MainLayout')).default,
        }),
        children: [
          {
            index: true,
            lazy: async () => ({
              Component: (await import('./pages/Home')).default,
            }),
          },
          {
            path: config.routes.chat,
            lazy: async () => ({
              Component: (await import('./pages/Chat')).default,
            }),
          },
        ],
      },
    ],
  },

  // Not found route
  {
    path: config.routes.notFound,
    lazy: async () => ({
      Component: (await import('./pages/404')).default,
    }),
  },
]);

export default router;
