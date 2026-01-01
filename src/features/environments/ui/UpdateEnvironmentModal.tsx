import { Modal, Button } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { ControlledTextInput, ControlledTextArea } from '../../../shared/controlled-form-fields';
import { useShowBackendError } from '../../../shared/hooks';
import { useUpdateEnvironmentMutation } from '../../../shared/api/queries/environments';
import { updateEnvironmentSchema, type UpdateEnvironmentFormData } from '../model/schema';
import type { EnvironmentResponse } from '../../../generated-api';

interface UpdateEnvironmentModalProps {
  opened: boolean;
  onClose: () => void;
  projectKey: string;
  environment: EnvironmentResponse;
}

export function UpdateEnvironmentModal({ opened, onClose, projectKey, environment }: UpdateEnvironmentModalProps) {
  const { t } = useTranslation();
  const updateMutation = useUpdateEnvironmentMutation(projectKey, environment.name);
  const { showError } = useShowBackendError();

  const { control, handleSubmit, reset } = useForm<UpdateEnvironmentFormData>({
    resolver: zodResolver(updateEnvironmentSchema),
    defaultValues: {
      name: environment.name,
      description: environment.description || '',
    },
  });

  const onSubmit = async (data: UpdateEnvironmentFormData) => {
    try {
      await updateMutation.mutateAsync(data);
      notifications.show({
        title: t('common.success'),
        message: t('environments.update.success_message'),
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
      title={t('environments.update.modal_title')}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <ControlledTextInput
            control={control}
            name="name"
            label={t('environments.update.name_label')}
            placeholder={t('environments.update.name_placeholder')}
            required
          />
          
          <ControlledTextArea
            control={control}
            name="description"
            label={t('environments.update.description_label')}
            placeholder={t('environments.update.description_placeholder')}
            minRows={3}
          />

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="subtle" onClick={handleClose}>
              {t('environments.update.cancel_button')}
            </Button>
            <Button type="submit" loading={updateMutation.isPending}>
              {t('environments.update.submit_button')}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}










