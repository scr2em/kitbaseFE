import { Modal, Button } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { ControlledTextInput, ControlledTextArea } from '../../../shared/controlled-form-fields';
import { useShowBackendError } from '../../../shared/hooks';
import { useCreateEnvironmentMutation } from '../../../shared/api/queries/environments';
import { createEnvironmentSchema, type CreateEnvironmentFormData } from '../model/schema';

interface CreateEnvironmentModalProps {
  opened: boolean;
  onClose: () => void;
  projectKey: string;
}

export function CreateEnvironmentModal({ opened, onClose, projectKey }: CreateEnvironmentModalProps) {
  const { t } = useTranslation();
  const createMutation = useCreateEnvironmentMutation(projectKey);
  const { showError } = useShowBackendError();

  const { control, handleSubmit, reset } = useForm<CreateEnvironmentFormData>({
    resolver: zodResolver(createEnvironmentSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit = async (data: CreateEnvironmentFormData) => {
    try {
      await createMutation.mutateAsync(data);
      notifications.show({
        title: t('common.success'),
        message: t('environments.create.success_message'),
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
      title={t('environments.create.modal_title')}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <ControlledTextInput
            control={control}
            name="name"
            label={t('environments.create.name_label')}
            placeholder={t('environments.create.name_placeholder')}
            required
          />
          
          <ControlledTextArea
            control={control}
            name="description"
            label={t('environments.create.description_label')}
            placeholder={t('environments.create.description_placeholder')}
            minRows={3}
          />

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="subtle" onClick={handleClose}>
              {t('environments.create.cancel_button')}
            </Button>
            <Button type="submit" loading={createMutation.isPending}>
              {t('environments.create.submit_button')}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}





















