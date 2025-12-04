import { Modal, Button, Stack } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { notifications } from '@mantine/notifications';
import { createAppSchema, type CreateAppFormData } from '../model/schema';
import { useCreateMobileAppMutation } from '../../../shared/api/queries';
import {
  ControlledTextInput,
  ControlledTextArea,
} from '../../../shared/controlled-form-fields';
import { useShowBackendError } from '../../../shared/hooks';

interface CreateAppModalProps {
  opened: boolean;
  onClose: () => void;
}

export function CreateAppModal({ opened, onClose }: CreateAppModalProps) {
  const { t } = useTranslation();
  const createAppMutation = useCreateMobileAppMutation();
  const { showError } = useShowBackendError();

  const form = useForm<CreateAppFormData>({
    resolver: zodResolver(createAppSchema),
    defaultValues: {
      bundleId: '',
      name: '',
      description: '',
    },
  });

  const handleSubmit = async (data: CreateAppFormData) => {
    try {
      await createAppMutation.mutateAsync(data);
      notifications.show({
        title: t('common.success'),
        message: t('apps.create.success_message'),
        color: 'green',
      });
      form.reset();
      onClose();
    } catch (error) {
      showError(error);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={t('apps.create.modal_title')}
      size="md"
    >
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Stack gap="md">
       
          <ControlledTextInput
            control={form.control}
            name="name"
            label={t('apps.create.name_label')}
            placeholder={t('apps.create.name_placeholder')}
            required
          />

<ControlledTextInput
            control={form.control}
            name="bundleId"
            label={t('apps.create.bundle_id_label')}
            placeholder={t('apps.create.bundle_id_placeholder')}
            required
          />

          <ControlledTextArea
            control={form.control}
            name="description"
            label={t('apps.create.description_label')}
            placeholder={t('apps.create.description_placeholder')}
            minRows={3}
          />

          <Button
            type="submit"
            loading={createAppMutation.isPending}
            fullWidth
            mt="md"
          >
            {t('apps.create.submit_button')}
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}

