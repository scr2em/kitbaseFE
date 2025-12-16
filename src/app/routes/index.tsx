import { Routes, Route, Navigate } from 'react-router';
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
import { AppLayout } from '../../shared/layouts';

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        index
        element={
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <PublicRoute>
            <ResetPasswordPage />
          </PublicRoute>
        }
      />
      <Route
        path="/invitations/accept"
        element={<AcceptInvitationPage />}
      />
      <Route
        path="/create-organization"
        element={
          <ProtectedRoute requireOrganization={false}>
            <CreateOrganizationPage />
          </ProtectedRoute>
        }
      />
      
      {/* Protected routes with AppShell layout */}
      <Route
        element={
          <ProtectedRoute requireOrganization={true}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/apps" element={<AppsPage />} />
        <Route path="/apps/:bundleId" element={<AppDetailPage />}>
          <Route index element={<Navigate to="bundles" replace />} />
          <Route path="bundles" element={<BundlesPage />} />
          <Route path="builds" element={<AppBuildsPage />} />
          <Route path="access" element={<AccessPage />} />
          <Route path="api-keys" element={<ApiKeysPage />} />
        </Route>
        <Route path="/team" element={<TeamPage />} />
        <Route path="/channels" element={<ChannelsPage />} />
        <Route path="/analytics" element={<div>Analytics Page (Coming Soon)</div>} />
        <Route path="/organization" element={<OrganizationPage />} />
        <Route path="/settings" element={<div>Settings Page (Coming Soon)</div>} />
        <Route path="/profile" element={<div>Profile Page (Coming Soon)</div>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

