import { createBrowserRouter, Navigate, type RouteObject } from 'react-router';
import { LoginPage } from '../../features/auth/login';
import { SignupPage } from '../../features/auth/signup';
import { ForgotPasswordPage, ResetPasswordPage } from '../../features/auth/reset-password';
import { DashboardPage } from '../../features/dashboard';
import { CreateOrganizationPage } from '../../features/organization/create-organization';
import { OrganizationPage } from '../../features/organization/view-organization';
import { TeamPage } from '../../features/team';
import { 
  AppsPage, 
  AppDetailPage, 
  BundlesPage, 
  AppBuildsPage, 
  AccessPage,
  ApiKeysPage 
} from '../../features/apps';
import { AcceptInvitationPage } from '../../features/invitation';
import { ChannelsPage } from '../../features/channels';
import { LandingPage } from '../../features/landing';
import { ProtectedRoute, PublicRoute } from '../../shared/lib/router';
import { AppLayout, AuthLayout } from '../../shared/layouts';
import { AppProviders } from '../providers/AppProviders';

function RootLayout() {
  return <AppProviders />;
}

const routes: RouteObject[] = [
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: (
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        ),
      },
      {
        element: (
          <PublicRoute>
            <AuthLayout />
          </PublicRoute>
        ),
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/signup', element: <SignupPage /> },
          { path: '/forgot-password', element: <ForgotPasswordPage /> },
          { path: '/reset-password', element: <ResetPasswordPage /> },
        ],
      },
      {
        path: '/invitations/accept',
        element: <AcceptInvitationPage />,
      },
      {
        path: '/create-organization',
        element: (
          <ProtectedRoute requireOrganization={false}>
            <CreateOrganizationPage />
          </ProtectedRoute>
        ),
      },
      {
        element: (
          <ProtectedRoute requireOrganization={true}>
            <AppLayout />
          </ProtectedRoute>
        ),
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/apps', element: <AppsPage /> },
          {
            path: '/apps/:bundleId',
            element: <AppDetailPage />,
            children: [
              { index: true, element: <Navigate to="bundles" replace /> },
              { path: 'bundles', element: <BundlesPage /> },
              { path: 'builds', element: <AppBuildsPage /> },
              { path: 'access', element: <AccessPage /> },
              { path: 'api-keys', element: <ApiKeysPage /> },
            ],
          },
          { path: '/team', element: <TeamPage /> },
          { path: '/channels', element: <ChannelsPage /> },
          { path: '/analytics', element: <div>Analytics Page (Coming Soon)</div> },
          { path: '/organization', element: <OrganizationPage /> },
          { path: '/settings', element: <div>Settings Page (Coming Soon)</div> },
          { path: '/profile', element: <div>Profile Page (Coming Soon)</div> },
        ],
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);

