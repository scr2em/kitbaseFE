import { Container, Paper, Title, Text, Stack, Button, Alert, Group } from '@mantine/core';
import { useSearchParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Mail, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useAcceptInvitationMutation, useCancelInvitationMutation } from '../../../shared/api/queries/invitation';
import { useShowBackendError } from '../../../shared/hooks/useShowBackendError';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';

export function AcceptInvitationPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const showBackendError = useShowBackendError();
  const [isProcessed, setIsProcessed] = useState(false);

  // Note: The API now uses invitationId instead of token
  // This may need to be updated based on how invitations are sent
  const invitationId = searchParams.get('id') || searchParams.get('token') || '';
  
  const acceptMutation = useAcceptInvitationMutation();
  const cancelMutation = useCancelInvitationMutation();

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
        navigate('/login');
      }, 2000);
    } catch (error) {
      showBackendError.showError(error);
    }
  };

  const handleCancel = async () => {
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
        navigate('/login');
      }, 2000);
    } catch (error) {
      showBackendError.showError(error);
    }
  };

  if (!invitationId) {
    return (
      <Container size="sm" pt={80}>
        <Paper shadow="md" p="xl" radius="md" withBorder>
          <Stack gap="lg" align="center">
            <AlertCircle size={48} color="var(--mantine-color-red-6)" />
            <Title order={2}>{t('invitation.accept.error_title')}</Title>
            <Text c="dimmed" ta="center">
              {t('invitation.accept.error_message')}
            </Text>
            <Button onClick={() => navigate('/login')} variant="light">
              {t('invitation.accept.go_to_login')}
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="sm" pt={80}>
      <Paper shadow="md" p="xl" radius="md" withBorder>
        <Stack gap="lg">
          <Stack gap="xs" align="center">
            <Mail size={48} color="var(--mantine-color-blue-6)" />
            <Title order={2}>{t('invitation.accept.title')}</Title>
            <Text c="dimmed" ta="center">
              {t('invitation.accept.subtitle')}
            </Text>
          </Stack>

          {isProcessed && (
            <Alert color="green" icon={<CheckCircle size={16} />}>
              {t('invitation.accept.redirecting_message')}
            </Alert>
          )}

          <Alert color="blue" icon={<AlertCircle size={16} />}>
            <Text size="sm">
              {t('invitation.accept.note_message')}
            </Text>
          </Alert>

          {!isProcessed && (
            <Group justify="center" mt="md">
              <Button
                variant="subtle"
                onClick={handleCancel}
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
            </Group>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}

