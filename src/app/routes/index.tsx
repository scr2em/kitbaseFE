import { createBrowserRouter, Navigate, type RouteObject } from 'react-router';
import { LoginPage } from '../../features/auth/login';
import { SignupPage } from '../../features/auth/signup';
import { ForgotPasswordPage, ResetPasswordPage } from '../../features/auth/reset-password';
import { DashboardPage } from '../../features/dashboard';
import { CreateOrganizationPage } from '../../features/organization/create-organization';
import { OrganizationPage } from '../../features/organization/view-organization';
import { TeamPage } from '../../features/team';
import { 
  ProjectsPage, 
  ProjectDetailPage, 
  BundlesPage, 
  ProjectBuildsPage, 
  AccessPage,
  ApiKeysPage,
  ChangelogPage,
  CreateChangelogPage,
  EditChangelogPage,
  ProjectSettingsPage,
} from '../../features/projects';
import { AcceptInvitationPage } from '../../features/invitation';
import { EnvironmentsPage } from '../../features/environments';
import { EventsPage, EventDetailPage } from '../../features/events';
import { WebhooksPage, CreateWebhookPage, WebhookDetailPage } from '../../features/webhooks';
import { ProfileSettingsPage, SettingsLayout } from '../../features/settings/profile';
import { BillingPage } from '../../features/billing';
import { LandingPage } from '../../features/landing';
import { ProtectedRoute, PublicRoute } from '../../shared/lib/router';
import { AppLayout, AuthLayout, OrganizationLayout } from '../../shared/layouts';
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
          { path: '/projects', element: <ProjectsPage /> },
          {
            path: '/projects/:projectKey',
            element: <ProjectDetailPage />,
            children: [
              { index: true, element: <Navigate to="bundles" replace /> },
              { path: 'bundles', element: <BundlesPage /> },
              { path: 'builds', element: <ProjectBuildsPage /> },
              { path: 'access', element: <AccessPage /> },
              { path: 'changelog', element: <ChangelogPage /> },
              { path: 'changelog/create', element: <CreateChangelogPage /> },
              { path: 'changelog/:changelogId/edit', element: <EditChangelogPage /> },
              { path: 'api-keys', element: <ApiKeysPage /> },
              { path: 'environments', element: <EnvironmentsPage /> },
              { path: 'events', element: <EventsPage /> },
              { path: 'events/:eventId', element: <EventDetailPage /> },
              { path: 'settings', element: <ProjectSettingsPage /> },
            ],
          },
          { path: '/analytics', element: <div>Analytics Page (Coming Soon)</div> },
          {
            path: '/organization',
            element: <OrganizationLayout />,
            children: [
              { index: true, element: <Navigate to="info" replace /> },
              { path: 'info', element: <OrganizationPage /> },
              { path: 'team', element: <TeamPage /> },
              { path: 'webhooks', element: <WebhooksPage /> },
              { path: 'webhooks/create', element: <CreateWebhookPage /> },
              { path: 'webhooks/:webhookId', element: <WebhookDetailPage /> },
            ],
          },
          {
            path: '/settings',
            element: <SettingsLayout />,
            children: [
              { index: true, element: <Navigate to="me" replace /> },
              { path: 'me', element: <ProfileSettingsPage /> },
              { path: 'billing', element: <BillingPage /> },
            ],
          },
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
