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
        lazy: async () => ({
          Component: (await import('./layout/AuthLayout')).default,
        }),
        children: [
          {
            path: config.routes.login,
            lazy: async () => ({
              Component: (await import('./pages/Login')).default,
            }),
          },
          {
            path: config.routes.register,
            lazy: async () => ({
              Component: (await import('./pages/Register')).default,
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
            path: config.routes.myNetwork,
            lazy: async () => ({
              Component: (await import('./pages/MyNetwork')).default,
            }),
          },
        ],
      },
      {
        path: config.routes.editProfile,
        lazy: async () => ({
          Component: (await import('./layout/MainLayout')).default,
        }),
        children: [
          {
            index: true,
            lazy: async () => ({
              Component: (await import('./pages/EditProfile')).default,
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
