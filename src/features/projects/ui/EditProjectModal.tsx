import { Modal, Button } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { notifications } from '@mantine/notifications';
import { z } from 'zod';
import { ControlledTextInput, ControlledTextArea } from '../../../shared/controlled-form-fields';
import { useUpdateProjectMutation } from '../../../shared/api/queries';
import { useShowBackendError } from '../../../shared/hooks';

const editProjectSchema = z.object({
  name: z.string().min(1, 'validation.project_name_required'),
  description: z.string().optional(),
});

type EditProjectFormData = z.infer<typeof editProjectSchema>;

interface EditProjectModalProps {
  opened: boolean;
  onClose: () => void;
  project: {
    projectKey: string;
    name: string;
    description?: string;
  };
}

export function EditProjectModal({ opened, onClose, project }: EditProjectModalProps) {
  const { t } = useTranslation();
  const { showError } = useShowBackendError();
  const updateProjectMutation = useUpdateProjectMutation();

  const form = useForm<EditProjectFormData>({
    resolver: zodResolver(editProjectSchema),
    defaultValues: {
      name: project.name,
      description: project.description || '',
    },
  });

  const handleSubmit = async (data: EditProjectFormData) => {
    try {
      await updateProjectMutation.mutateAsync({
        projectKey: project.projectKey,
        data: {
          name: data.name,
          description: data.description,
        },
      });

      notifications.show({
        title: t('common.success'),
        message: t('projects.edit.success_message'),
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
      title={t('projects.edit.modal_title')}
      size="md"
    >
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="flex flex-col gap-4">
          <ControlledTextInput
            control={form.control}
            name="name"
            label={t('projects.edit.name_label')}
            placeholder={t('projects.edit.name_placeholder')}
            required
          />

          <ControlledTextArea
            control={form.control}
            name="description"
            label={t('projects.edit.description_label')}
            placeholder={t('projects.edit.description_placeholder')}
            rows={3}
          />

          <Button
            type="submit"
            loading={updateProjectMutation.isPending}
            fullWidth
            mt="md"
          >
            {t('projects.edit.submit_button')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}



