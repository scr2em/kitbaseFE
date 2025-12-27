import { Modal, Button } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { notifications } from '@mantine/notifications';
import { z } from 'zod';
import { ControlledTextInput, ControlledTextArea } from '../../../shared/controlled-form-fields';
import { useUpdateMobileAppMutation } from '../../../shared/api/queries';
import { useShowBackendError } from '../../../shared/hooks';

const editAppSchema = z.object({
  name: z.string().min(1, 'validation.app_name_required'),
  description: z.string().optional(),
});

type EditAppFormData = z.infer<typeof editAppSchema>;

interface EditAppModalProps {
  opened: boolean;
  onClose: () => void;
  app: {
    id: string;
    name: string;
    description?: string;
  };
}

export function EditAppModal({ opened, onClose, app }: EditAppModalProps) {
  const { t } = useTranslation();
  const { showError } = useShowBackendError();
  const updateAppMutation = useUpdateMobileAppMutation();

  const form = useForm<EditAppFormData>({
    resolver: zodResolver(editAppSchema),
    defaultValues: {
      name: app.name,
      description: app.description || '',
    },
  });

  const handleSubmit = async (data: EditAppFormData) => {
    try {
      await updateAppMutation.mutateAsync({
        appId: app.id,
        data: {
          name: data.name,
          description: data.description,
        },
      });

      notifications.show({
        title: t('common.success'),
        message: t('apps.edit.success_message'),
        color: 'green',
      });

      handleClose();
    } catch (error) {
      showError(error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={t('apps.edit.modal_title')}
      size="md"
    >
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="flex flex-col gap-4">
          <ControlledTextInput
            control={form.control}
            name="name"
            label={t('apps.edit.name_label')}
            placeholder={t('apps.edit.name_placeholder')}
            required
          />

          <ControlledTextArea
            control={form.control}
            name="description"
            label={t('apps.edit.description_label')}
            placeholder={t('apps.edit.description_placeholder')}
            rows={3}
          />

          <Button
            type="submit"
            loading={updateAppMutation.isPending}
            fullWidth
            mt="md"
          >
            {t('apps.edit.submit_button')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}





