import { Modal, Stack, Button, Group } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { ControlledTextInput, ControlledTextArea } from '../../../shared/controlled-form-fields';
import { useShowBackendError } from '../../../shared/hooks';
import { useUpdateChannelMutation } from '../../../shared/api/queries/channels';
import { updateChannelSchema, type UpdateChannelFormData } from '../model/schema';
import type { ChannelResponse } from '../../../generated-api';

interface UpdateChannelModalProps {
  opened: boolean;
  onClose: () => void;
  channel: ChannelResponse;
}

export function UpdateChannelModal({ opened, onClose, channel }: UpdateChannelModalProps) {
  const { t } = useTranslation();
  const updateMutation = useUpdateChannelMutation(channel.id);
  const { showError } = useShowBackendError();

  const { control, handleSubmit, reset } = useForm<UpdateChannelFormData>({
    resolver: zodResolver(updateChannelSchema),
    defaultValues: {
      name: channel.name,
      description: channel.description || '',
    },
  });

  const onSubmit = async (data: UpdateChannelFormData) => {
    try {
      await updateMutation.mutateAsync(data);
      notifications.show({
        title: t('common.success'),
        message: t('channels.update.success_message'),
        color: 'green',
      });
      onClose();
    } catch (error) {
      showError(error);
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
      title={t('channels.update.modal_title')}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="md">
          <ControlledTextInput
            control={control}
            name="name"
            label={t('channels.update.name_label')}
            placeholder={t('channels.update.name_placeholder')}
            required
          />
          
          <ControlledTextArea
            control={control}
            name="description"
            label={t('channels.update.description_label')}
            placeholder={t('channels.update.description_placeholder')}
            minRows={3}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={handleClose}>
              {t('channels.update.cancel_button')}
            </Button>
            <Button type="submit" loading={updateMutation.isPending}>
              {t('channels.update.submit_button')}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}

