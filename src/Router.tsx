import { createBrowserRouter, Outlet } from 'react-router-dom';

import { config } from './config/app';
import AuthGuard from './guards/AuthGuard';
import GuestGuard from './guards/GuestGuard';
import { VerifiedEmailGuard } from './guards';

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
            path: config.routes.landing,
            lazy: async () => ({
              Component: (await import('./pages/Landing')).default,
            }),
          },
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
      <VerifiedEmailGuard>
        <AuthGuard>
          <Outlet />
        </AuthGuard>
      </VerifiedEmailGuard>
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
          {
            path: config.routes.chat,
            lazy: async () => ({
              Component: (await import('./pages/Chat')).default,
            }),
          },
          {
            path: config.routes.profile,
            lazy: async () => ({
              Component: (await import('./pages/Profile')).default,
            }),
          },
          {
            path: config.routes.user,
            lazy: async () => ({
              Component: (await import('./pages/Profile')).default,
            }),
          },
          {
            path: config.routes.editProfile,
            lazy: async () => ({
              Component: (await import('./pages/EditProfile')).default,
            }),
          },
        ],
      },
    ],
  },
  {
    path: config.routes.notVerifyEmail,
    lazy: async () => ({
      Component: (await import('./pages/NotVerifyEmail')).default,
    }),
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
