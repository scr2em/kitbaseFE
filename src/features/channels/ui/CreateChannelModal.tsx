import { Modal, Stack, Button, Group } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { ControlledTextInput, ControlledTextArea } from '../../../shared/controlled-form-fields';
import { useShowBackendError } from '../../../shared/hooks';
import { useCreateChannelMutation } from '../../../shared/api/queries/channels';
import { createChannelSchema, type CreateChannelFormData } from '../model/schema';

interface CreateChannelModalProps {
  opened: boolean;
  onClose: () => void;
}

export function CreateChannelModal({ opened, onClose }: CreateChannelModalProps) {
  const { t } = useTranslation();
  const createMutation = useCreateChannelMutation();
  const { showError } = useShowBackendError();

  const { control, handleSubmit, reset } = useForm<CreateChannelFormData>({
    resolver: zodResolver(createChannelSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit = async (data: CreateChannelFormData) => {
    try {
      await createMutation.mutateAsync(data);
      notifications.show({
        title: t('common.success'),
        message: t('channels.create.success_message'),
        color: 'green',
      });
      reset();
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
      title={t('channels.create.modal_title')}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="md">
          <ControlledTextInput
            control={control}
            name="name"
            label={t('channels.create.name_label')}
            placeholder={t('channels.create.name_placeholder')}
            required
          />
          
          <ControlledTextArea
            control={control}
            name="description"
            label={t('channels.create.description_label')}
            placeholder={t('channels.create.description_placeholder')}
            minRows={3}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={handleClose}>
              {t('channels.create.cancel_button')}
            </Button>
            <Button type="submit" loading={createMutation.isPending}>
              {t('channels.create.submit_button')}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}

