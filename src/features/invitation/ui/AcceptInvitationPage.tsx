import { Paper, Button, Alert } from '@mantine/core';
import { useSearchParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Mail, AlertCircle, XCircle, CheckCircle } from 'lucide-react';
import { useAcceptInvitationMutation, useCancelInvitationMutation } from '../../../shared/api/queries/invitation';
import { useShowBackendError } from '../../../shared/hooks/useShowBackendError';
import { notifications } from '@mantine/notifications';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../shared/lib/auth/AuthContext';

export function AcceptInvitationPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const showBackendError = useShowBackendError();
  const { isAuthenticated } = useAuth();
  const [isProcessed, setIsProcessed] = useState(false);

  // Note: The API now uses invitationId instead of token
  // This may need to be updated based on how invitations are sent
  const invitationId = searchParams.get('id') || searchParams.get('token') || '';
  
  const acceptMutation = useAcceptInvitationMutation();
  const cancelMutation = useCancelInvitationMutation();

  // Redirect to signup if not authenticated
  useEffect(() => {
    if (invitationId && !isAuthenticated) {
      navigate(`/signup?invitationId=${invitationId}`, { replace: true });
    }
  }, [invitationId, isAuthenticated, navigate]);

  const handleAccept = async () => {
    if (!invitationId) {
      notifications.show({
        title: t('common.error'),
        message: t('invitation.accept.invalid_invitation'),
        color: 'red',
      });
      return;
    }

    try {
      await acceptMutation.mutateAsync(invitationId);
      notifications.show({
        title: t('common.success'),
        message: t('invitation.accept.success_message'),
        color: 'green',
        icon: <CheckCircle size={18} />,
      });
      setIsProcessed(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      showBackendError.showError(error);
    }
  };

  const handleReject = async () => {
    if (!invitationId) {
      notifications.show({
        title: t('common.error'),
        message: t('invitation.accept.invalid_invitation'),
        color: 'red',
      });
      return;
    }

    try {
      await cancelMutation.mutateAsync(invitationId);
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

  if (!invitationId) {
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

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

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
              disabled={acceptMutation.isPending || cancelMutation.isPending}
              loading={cancelMutation.isPending}
              leftSection={<XCircle size={18} />}
            >
              {t('invitation.accept.reject_button')}
            </Button>
            <Button
              onClick={handleAccept}
              disabled={acceptMutation.isPending || cancelMutation.isPending}
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
