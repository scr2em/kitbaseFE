import { Modal, Stack, Button, Group } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { inviteUserSchema,type  InviteUserFormData } from '../model/schema';
import { ControlledTextInput } from '../../../shared/controlled-form-fields/ControlledTextInput';

import { useCreateInvitationMutation } from '../../../shared/api/queries/invitation';
import { useShowBackendError, useCurrentOrganization } from '../../../shared/hooks';
import { usePermissions } from '../../../shared/hooks/usePermission';
import { notifications } from '@mantine/notifications';
import { ControlledRolesSelect } from '../../../shared/controlled-form-fields/ControlledSelect';

interface InviteUserModalProps {
  opened: boolean;
  onClose: () => void;
}

export function InviteUserModal({ opened, onClose }: InviteUserModalProps) {
  const { t } = useTranslation();
  const { currentOrganization } = useCurrentOrganization();
  const organizationId = currentOrganization?.organization?.id || '';
  const createInvitationMutation = useCreateInvitationMutation(organizationId);
  const showBackendError = useShowBackendError();
  const { canCreateInvitation } = usePermissions();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InviteUserFormData>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      email: '',
      role: '',
    },
  });

  // Defense-in-depth: Don't render modal content if user doesn't have permission
  if (!canCreateInvitation) {
    return null;
  }

  const onSubmit = async (data: InviteUserFormData) => {
    try {
      await createInvitationMutation.mutateAsync(data);
      notifications.show({
        title: t('common.success'),
        message: t('invitation.success_message'),
        color: 'green',
      });
      reset();
      onClose();
    } catch (error) {
      showBackendError.showError(error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={t('invitation.modal_title')}
      size="md"
      centered
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="md">
          <ControlledTextInput
            name="email"
            control={control}
            label={t('invitation.email_label')}
            placeholder={t('invitation.email_placeholder')}
            type="email"
            error={errors.email && t(errors.email.message as string)}
            required
          />

         <ControlledRolesSelect
            name="role"
            control={control}
            label={t('invitation.role_label')}
            placeholder={t('invitation.role_placeholder')}
            error={errors.role && t(errors.role.message as string)}
            required
          />

          <Group justify="flex-end" mt="md">
            <Button
              variant="subtle"
              onClick={handleClose}
              disabled={createInvitationMutation.isPending}
            >
              {t('invitation.cancel_button')}
            </Button>
            <Button
              type="submit"
              loading={createInvitationMutation.isPending}
              variant="gradient"
              gradient={{ from: 'blue', to: 'cyan', deg: 45 }}
            >
              {t('invitation.submit_button')}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}

