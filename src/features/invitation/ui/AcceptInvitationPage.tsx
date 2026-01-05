import { Paper, Button, Alert, Divider } from '@mantine/core';
import { useSearchParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Mail, AlertCircle, XCircle, CheckCircle, UserPlus, LogIn } from 'lucide-react';
import { useAcceptInvitationByTokenMutation, useRejectInvitationByTokenMutation } from '../../../shared/api/queries/invitation';
import { useShowBackendError } from '../../../shared/hooks/useShowBackendError';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import { useAuth } from '../../../shared/lib/auth/AuthContext';
import { InvitationSignupForm } from './InvitationSignupForm';
import { TwoFactorSetupFlow } from '../../../shared/components/TwoFactorSetupFlow';
import type { TwoFactorSessionData } from '../../auth/two-factor/ui/TwoFactorVerifyPage';
import type { AuthResponse } from '../../../generated-api';

type ViewState = 'options' | 'signup' | 'two-factor-setup';

export function AcceptInvitationPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const showBackendError = useShowBackendError();
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [isProcessed, setIsProcessed] = useState(false);
  const [viewState, setViewState] = useState<ViewState>('options');
  const [tempToken, setTempToken] = useState<string | null>(null);

  const token = searchParams.get('token') || '';
  
  const acceptMutation = useAcceptInvitationByTokenMutation();
  const rejectMutation = useRejectInvitationByTokenMutation();

  const handleAccept = async () => {
    if (!token) {
      notifications.show({
        title: t('common.error'),
        message: t('invitation.accept.invalid_invitation'),
        color: 'red',
      });
      return;
    }

    try {
      const response = await acceptMutation.mutateAsync(token);
      notifications.show({
        title: t('common.success'),
        message: t('invitation.accept.success_message'),
        color: 'green',
        icon: <CheckCircle size={18} />,
      });
      setIsProcessed(true);
      setTimeout(() => {
        const subdomain = response.organization.subdomain;
        const url = `http://${subdomain}.${import.meta.env.VITE_APP_DOMAIN}/dashboard`;
        window.open(url, '_self');
      }, 2000);
    } catch (error) {
      showBackendError.showError(error);
    }
  };

  const handleReject = async () => {
    if (!token) {
      notifications.show({
        title: t('common.error'),
        message: t('invitation.accept.invalid_invitation'),
        color: 'red',
      });
      return;
    }

    try {
      await rejectMutation.mutateAsync(token);
      notifications.show({
        title: t('common.success'),
        message: t('invitation.accept.reject_success_message'),
        color: 'blue',
        icon: <XCircle size={18} />,
      });
      setIsProcessed(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      showBackendError.showError(error);
    }
  };

  const handleLoginRedirect = () => {
    const returnUrl = `/invitations/accept?token=${token}`;
    navigate(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
  };

  const handleSignupSuccess = (authResponse: AuthResponse) => {
    // Check if 2FA setup is required (org requires 2FA but user hasn't set it up)
    if (authResponse.twoFactorSetupRequired && authResponse.tempToken) {
      setTempToken(authResponse.tempToken);
      setViewState('two-factor-setup');
      return;
    }

    // Check if 2FA verification is required (user already has 2FA enabled)
    if (authResponse.twoFactorRequired && authResponse.tempToken) {
      const twoFactorState: TwoFactorSessionData = {
        tempToken: authResponse.tempToken,
        methods: authResponse.twoFactorMethods || ['totp'],
        returnUrl: `/invitations/accept?token=${token}`,
      };
      navigate('/2fa', { state: twoFactorState });
      return;
    }

    // No 2FA required - complete the signup
    completeSignupRedirect(authResponse);
  };

  const completeSignupRedirect = (authResponse: AuthResponse) => {
    setIsAuthenticated(true);
    notifications.show({
      title: t('common.success'),
      message: t('invitation.accept.success_message'),
      color: 'green',
      icon: <CheckCircle size={18} />,
    });
    setIsProcessed(true);
    
    const firstOrg = authResponse.user?.organizations?.[0];
    if (firstOrg) {
      const url = `http://${firstOrg.organization.subdomain}.${import.meta.env.VITE_APP_DOMAIN}/dashboard`;
      window.open(url, '_self');
    } else {
      navigate('/dashboard');
    }
  };

  const handleTwoFactorSetupComplete = () => {
    notifications.show({
      title: t('common.success'),
      message: t('auth.two_factor_setup.success_message'),
      color: 'green',
    });
    // Redirect to login so user can log in with their new 2FA
    navigate(`/login?returnUrl=${encodeURIComponent(`/invitations/accept?token=${token}`)}`);
  };

  const handleTwoFactorSetupBack = () => {
    setViewState('signup');
    setTempToken(null);
  };

  const handleTwoFactorSetupError = () => {
    setViewState('signup');
    setTempToken(null);
  };

  // No token provided - show error
  if (!token) {
    return (
      <div className="max-w-md mx-auto pt-20 px-4">
        <Paper shadow="md" p="xl" radius="md" withBorder>
          <div className="flex flex-col gap-6 items-center">
            <AlertCircle size={48} color="var(--mantine-color-red-6)" />
            <h2 className="text-2xl font-semibold">{t('invitation.accept.error_title')}</h2>
            <p className="text-gray-500 text-center">
              {t('invitation.accept.error_message')}
            </p>
            <Button onClick={() => navigate('/')} variant="light">
              {t('invitation.accept.go_to_home')}
            </Button>
          </div>
        </Paper>
      </div>
    );
  }

  // Invitation processed - show success and redirect
  if (isProcessed) {
    return (
      <div className="max-w-md mx-auto pt-20 px-4">
        <Paper shadow="md" p="xl" radius="md" withBorder>
          <div className="flex flex-col gap-6 items-center">
            <CheckCircle size={48} color="var(--mantine-color-green-6)" />
            <h2 className="text-2xl font-semibold">{t('invitation.accept.processed_title')}</h2>
            <p className="text-gray-500 text-center">
              {t('invitation.accept.redirecting_message')}
            </p>
          </div>
        </Paper>
      </div>
    );
  }

  // Authenticated user - show accept/reject UI
  if (isAuthenticated) {
    return (
      <div className="max-w-md mx-auto pt-20 px-4">
        <Paper shadow="md" p="xl" radius="md" withBorder>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 items-center">
              <Mail size={48} color="var(--mantine-color-blue-6)" />
              <h2 className="text-2xl font-semibold">{t('invitation.accept.title')}</h2>
              <p className="text-gray-500 text-center">
                {t('invitation.accept.subtitle')}
              </p>
            </div>

            <Alert color="blue" icon={<AlertCircle size={16} />}>
              <p className="text-sm">
                {t('invitation.accept.logged_in_note')}
              </p>
            </Alert>

            <div className="flex justify-center gap-3 mt-4">
              <Button
                variant="subtle"
                onClick={handleReject}
                disabled={acceptMutation.isPending || rejectMutation.isPending}
                loading={rejectMutation.isPending}
                leftSection={<XCircle size={18} />}
              >
                {t('invitation.accept.reject_button')}
              </Button>
              <Button
                onClick={handleAccept}
                disabled={acceptMutation.isPending || rejectMutation.isPending}
                loading={acceptMutation.isPending}
                variant="gradient"
                gradient={{ from: 'blue', to: 'cyan', deg: 45 }}
                leftSection={<CheckCircle size={18} />}
              >
                {t('invitation.accept.accept_button')}
              </Button>
            </div>
          </div>
        </Paper>
      </div>
    );
  }

  // Unauthenticated user - show signup form
  if (viewState === 'signup') {
    return (
      <div className="max-w-md mx-auto pt-20 px-4">
        <Paper shadow="md" p="xl" radius="md" withBorder>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 items-center">
              <UserPlus size={48} color="var(--mantine-color-blue-6)" />
              <h2 className="text-2xl font-semibold">{t('invitation.signup.title')}</h2>
              <p className="text-gray-500 text-center">
                {t('invitation.signup.subtitle')}
              </p>
            </div>

            <InvitationSignupForm 
              token={token} 
              onBack={() => setViewState('options')}
              onSuccess={handleSignupSuccess}
            />
          </div>
        </Paper>
      </div>
    );
  }

  // 2FA Setup Flow
  if (viewState === 'two-factor-setup' && tempToken) {
    return (
      <div className="max-w-md mx-auto pt-20 px-4">
        <Paper shadow="md" p="xl" radius="md" withBorder>
          <TwoFactorSetupFlow
            tempToken={tempToken}
            onComplete={handleTwoFactorSetupComplete}
            onBack={handleTwoFactorSetupBack}
            onError={handleTwoFactorSetupError}
          />
        </Paper>
      </div>
    );
  }

  // Unauthenticated user - show options (signup/login)
  return (
    <div className="max-w-md mx-auto pt-20 px-4">
      <Paper shadow="md" p="xl" radius="md" withBorder>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 items-center">
            <Mail size={48} color="var(--mantine-color-blue-6)" />
            <h2 className="text-2xl font-semibold">{t('invitation.accept.title')}</h2>
            <p className="text-gray-500 text-center">
              {t('invitation.accept.subtitle')}
            </p>
          </div>

          <Alert color="blue" icon={<AlertCircle size={16} />}>
            <p className="text-sm">
              {t('invitation.accept.auth_required_note')}
            </p>
          </Alert>

          <div className="flex flex-col gap-3">
            <Button
              onClick={() => setViewState('signup')}
              size="md"
              leftSection={<UserPlus size={18} />}
            >
              {t('invitation.accept.signup_button')}
            </Button>

            <Divider label={t('invitation.accept.or_divider')} labelPosition="center" />

            <Button
              onClick={handleLoginRedirect}
              variant="light"
              size="md"
              leftSection={<LogIn size={18} />}
            >
              {t('invitation.accept.login_button')}
            </Button>
          </div>
        </div>
      </Paper>
    </div>
  );
}
